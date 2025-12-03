# Configuration de l'authentification Supabase

Ce document explique comment configurer et utiliser le système d'authentification de GooTeranga avec Supabase.

## 🔧 Configuration initiale

### 1. Variables d'environnement

Assurez-vous d'avoir les variables suivantes dans votre fichier `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_WEBHOOK_SECRET=votre_webhook_secret (optionnel)

# Database (utilise la même base que Supabase)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### 2. Configuration Supabase Dashboard

#### Email Authentication

1. Allez dans **Authentication** > **Providers**
2. Activez **Email** provider
3. Configurez les options selon vos besoins :
   - **Enable email confirmations** : Recommandé pour la production
   - **Secure email change** : Activé
   - **Double confirmation** : Optionnel

#### OAuth Providers (optionnel)

Pour activer Google/Facebook OAuth :

1. **Google OAuth** :
   - Allez dans **Authentication** > **Providers** > **Google**
   - Activez le provider
   - Ajoutez vos **Client ID** et **Client Secret** Google
   - Ajoutez l'URL de callback dans Google Console : `https://votre-projet.supabase.co/auth/v1/callback`

2. **Facebook OAuth** :
   - Allez dans **Authentication** > **Providers** > **Facebook**
   - Activez le provider
   - Ajoutez vos **App ID** et **App Secret** Facebook
   - Ajoutez l'URL de callback dans Facebook Developers : `https://votre-projet.supabase.co/auth/v1/callback`

#### URL de redirection

Dans **Authentication** > **URL Configuration**, ajoutez :
- **Site URL** : `https://votre-domaine.com` (ou `http://localhost:3000` en dev)
- **Redirect URLs** :
  - `http://localhost:3000/api/auth/callback` (dev)
  - `https://votre-domaine.com/api/auth/callback` (production)

### 3. Webhook Supabase (optionnel mais recommandé)

Pour synchroniser automatiquement les utilisateurs entre Supabase Auth et Prisma :

1. Allez dans **Database** > **Webhooks**
2. Créez un nouveau webhook :
   - **Name** : `auth-users-sync`
   - **Events** : `auth.users` (INSERT, UPDATE, DELETE)
   - **HTTP Request** :
     - **URL** : `https://votre-domaine.com/api/auth/webhook`
     - **HTTP Method** : POST
     - **HTTP Headers** :
       - `x-webhook-secret: votre_webhook_secret` (si vous avez configuré SUPABASE_WEBHOOK_SECRET)
     - **HTTP Version** : HTTP/1.1

**Note** : Le webhook est optionnel car la synchronisation se fait aussi via les routes API et le callback. Le webhook assure une synchronisation plus fiable.

## 🚀 Utilisation

### Routes API d'authentification

#### POST `/api/auth/signup`

Crée un nouveau compte utilisateur.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+221 77 123 45 67",
  "role": "USER",
  // Pour PRESTATAIRE :
  "nomEntreprise": "Mon Hôtel",
  "typePrestataire": "HOTEL",
  "adresse": "Adresse",
  "ville": "Dakar",
  "region": "Dakar",
  "description": "Description"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "nom": "Dupont",
      "role": "USER"
    },
    "requiresEmailVerification": true
  },
  "message": "Compte créé. Veuillez vérifier votre email..."
}
```

#### POST `/api/auth/login`

Connecte un utilisateur. **Note** : La connexion se fait maintenant directement côté client avec Supabase pour une meilleure gestion des sessions.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "role": "USER"
    }
  },
  "message": "Connexion réussie"
}
```

**Important** : La page de connexion (`/login`) permet maintenant de sélectionner le type de compte (Touriste ou Prestataire) car une même adresse email peut être utilisée pour les deux types de comptes, mais avec des mots de passe différents.

#### POST `/api/auth/logout`

Déconnecte l'utilisateur actuel. Après la déconnexion, l'utilisateur est automatiquement redirigé vers la page d'accueil (`/`).

**Réponse :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

#### GET `/api/auth/session`

Récupère la session actuelle de l'utilisateur.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "nom": "Dupont",
      "prenom": "Jean",
      "role": "USER",
      "prestataire": null
    }
  }
}
```

### Hook React `useAuth`

Utilisez le hook `useAuth` dans vos composants clients :

```tsx
'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export default function MyComponent() {
  const { user, loading, signOut, refresh } = useAuth()

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!user) {
    return <div>Non connecté</div>
  }

  return (
    <div>
      <p>Bonjour {user.nom}!</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  )
}
```

### Protection des routes

Le middleware protège automatiquement les routes `/dashboard/*`. 

Les utilisateurs non authentifiés sont redirigés vers `/login?next=/dashboard/...`.

### Protection côté serveur

Utilisez `requireAuth` ou `requireRole` dans vos routes API et Server Components :

```ts
import { requireAuth, requireRole } from '@/lib/api/auth'

// Vérifier l'authentification
const user = await requireAuth(request)

// Vérifier un rôle spécifique
const user = await requireRole('PRESTATAIRE', request)
```

## 🔄 Synchronisation Supabase Auth ↔ Prisma

Le système synchronise automatiquement les utilisateurs entre Supabase Auth et la base de données Prisma :

1. **Lors de l'inscription** (`/api/auth/signup`) : 
   - Création dans Supabase Auth avec un email virtuel (ex: `user+prestataire@email.com`)
   - Création dans Prisma avec le même ID et l'email réel (ex: `user@email.com`)

2. **Lors du callback OAuth/Email** (`/api/auth/callback`) :
   - Synchronisation si l'utilisateur n'existe pas dans Prisma

3. **Via le webhook** (`/api/auth/webhook`) :
   - Synchronisation automatique des événements (INSERT, UPDATE, DELETE)

**Important** : 
- L'ID utilisateur dans Prisma correspond à l'ID Supabase Auth pour maintenir la cohérence.
- Le système utilise des emails virtuels dans Supabase (ex: `user+prestataire@email.com`) pour permettre à une même adresse email d'avoir plusieurs comptes (touriste et prestataire) avec des mots de passe différents, tout en stockant l'email réel dans Prisma.

## 📧 Comptes multiples avec la même email

Le système permet à un utilisateur d'avoir deux comptes distincts avec la même adresse email :
- Un compte **touriste** (USER) avec un mot de passe
- Un compte **prestataire** (PRESTATAIRE) avec un mot de passe différent

**Fonctionnement** :
- Dans Supabase Auth, les comptes sont créés avec des emails virtuels : `user+user@email.com` et `user+prestataire@email.com`
- Dans Prisma, les deux comptes ont l'email réel : `user@email.com` mais avec des rôles différents
- Lors de la connexion, l'utilisateur doit sélectionner le type de compte (Touriste ou Prestataire)
- La contrainte unique dans Prisma est sur `[email, role]`, permettant cette flexibilité

## 🛡️ Sécurité

- Les mots de passe sont hashés et stockés dans Supabase (jamais dans Prisma)
- Les sessions sont gérées via des cookies HTTP-only
- La vérification d'email peut être activée pour plus de sécurité
- Le webhook doit être protégé avec un secret si exposé publiquement

## 🐛 Dépannage

### "Supabase is not configured"
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont bien définis

### "Email already exists"
- Un compte avec cet email et ce rôle existe déjà
- **Note importante** : Une même adresse email peut être utilisée pour un compte touriste (USER) et un compte prestataire (PRESTATAIRE), mais avec des mots de passe différents. Si vous essayez de créer un compte avec le même email et le même rôle, vous obtiendrez cette erreur.

### La session ne persiste pas
- Vérifiez que les cookies sont activés
- Vérifiez la configuration des redirect URLs dans Supabase

### OAuth ne fonctionne pas
- Vérifiez que les URLs de callback sont correctement configurées dans les providers
- Vérifiez que les Client ID/Secret sont corrects

