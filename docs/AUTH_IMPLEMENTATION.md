# Implémentation de l'authentification - Résumé

Ce document résume l'implémentation complète du système d'authentification avec Supabase dans GooTeranga.

## ✅ Ce qui a été implémenté

### 1. Routes API d'authentification

#### `/api/auth/signup` (POST)
- Crée un compte utilisateur dans Supabase Auth
- Crée l'utilisateur correspondant dans Prisma avec le même ID
- Gère la création de profil prestataire si nécessaire
- Supporte la vérification d'email

#### `/api/auth/login` (POST)
- Connecte un utilisateur avec email/password
- Gère les sessions Supabase
- Vérifie la confirmation d'email (optionnel)

#### `/api/auth/logout` (POST)
- Déconnecte l'utilisateur
- Nettoie la session Supabase

#### `/api/auth/session` (GET)
- Récupère la session actuelle
- Retourne les informations complètes de l'utilisateur depuis Prisma
- Inclut les informations du prestataire si applicable

#### `/api/auth/callback` (GET)
- Gère les callbacks OAuth (Google, Facebook)
- Gère les confirmations d'email
- Synchronise automatiquement les utilisateurs avec Prisma
- Redirige vers la page demandée

#### `/api/auth/webhook` (POST)
- Webhook Supabase pour synchroniser les événements Auth
- Gère INSERT, UPDATE, DELETE d'utilisateurs
- Synchronisation automatique entre Supabase Auth et Prisma

### 2. Pages d'authentification

#### `/login` (Page client)
- Formulaire de connexion avec email/password
- **Sélecteur de type de compte** (Touriste/Prestataire) - permet de gérer les comptes multiples avec la même email
- Connexion directement côté client avec Supabase pour une meilleure gestion des sessions
- Support OAuth (Google, Facebook)
- Gestion d'erreurs
- Redirection après connexion selon le rôle
- Lien vers signup et mot de passe oublié

#### `/signup` (Page client)
- Formulaire d'inscription en 2 étapes :
  1. Choix du type de compte (USER/PRESTATAIRE)
  2. Remplissage du formulaire
- Validation des champs
- Support OAuth
- Création automatique du profil prestataire si nécessaire
- Messages de succès/erreur

#### `/auth/callback` (Page client)
- Page de transition lors des callbacks OAuth
- Redirection automatique vers la page demandée

### 3. Middleware d'authentification

Le middleware (`middleware.ts`) :
- Protège automatiquement les routes `/dashboard/*`
- Redirige les utilisateurs non authentifiés vers `/login`
- Redirige les utilisateurs connectés depuis `/login` et `/signup` vers `/dashboard`
- Préserve les paramètres `next` pour la redirection après connexion
- Compatible avec l'internationalisation (next-intl)

### 4. Hooks et utilitaires

#### `useAuth()` (Hook React)
- Hook client pour gérer l'authentification
- Retourne : `{ user, loading, signOut, refresh }`
- Écoute automatiquement les changements d'état Supabase
- Met à jour l'état lors des événements auth
- **`signOut()`** : Déconnecte l'utilisateur et redirige vers la page d'accueil (`/`)

#### `lib/api/auth.ts`
- `getAuthUser()` : Récupère l'utilisateur depuis Supabase et Prisma
- `requireAuth()` : Force l'authentification (lance une erreur si non authentifié)
- `requireRole()` : Vérifie un rôle spécifique (USER, PRESTATAIRE, ADMIN)

### 5. Clients Supabase

#### `lib/supabase/server.ts`
- Client Supabase pour le serveur (Server Components, API Routes)
- Gère les cookies de session
- Supporte un mode mock en développement si Supabase n'est pas configuré

#### `lib/supabase/client.ts`
- Client Supabase pour le navigateur
- Utilisé dans les composants clients

## 🔄 Flux d'authentification

### Inscription
1. Utilisateur remplit le formulaire sur `/signup`
2. Soumission vers `/api/auth/signup`
3. Création dans Supabase Auth
4. Création dans Prisma (même ID)
5. Si PRESTATAIRE, création du profil prestataire
6. Redirection vers `/dashboard` ou message de vérification email

### Connexion
1. Utilisateur entre email/password sur `/login`
2. Utilisateur sélectionne le type de compte (Touriste ou Prestataire)
3. Connexion directement côté client avec Supabase (utilise l'email virtuel correspondant au rôle)
4. Supabase vérifie les credentials
5. Session créée automatiquement (cookies gérés par Supabase SSR)
6. Récupération du rôle depuis Prisma via `/api/auth/session`
7. Redirection vers `/dashboard` ou la page demandée (`next` param) selon le rôle

### OAuth (Google/Facebook)
1. Utilisateur clique sur "Connexion avec Google/Facebook"
2. Redirection vers Supabase OAuth
3. Après authentification, callback vers `/api/auth/callback`
4. Synchronisation avec Prisma si nécessaire
5. Redirection vers `/dashboard`

### Protection des routes
1. Utilisateur accède à `/dashboard/*`
2. Middleware vérifie la session Supabase
3. Si non authentifié → redirection vers `/login?next=/dashboard/...`
4. Si authentifié → accès autorisé

## 📁 Structure des fichiers

```
app/
├── api/
│   └── auth/
│       ├── signup/route.ts      # POST /api/auth/signup
│       ├── login/route.ts       # POST /api/auth/login
│       ├── logout/route.ts      # POST /api/auth/logout
│       ├── session/route.ts     # GET /api/auth/session
│       ├── callback/route.ts    # GET /api/auth/callback (serveur)
│       └── webhook/route.ts     # POST /api/auth/webhook
│
├── [locale]/
│   ├── login/page.tsx           # Page de connexion
│   ├── signup/page.tsx          # Page d'inscription
│   └── auth/
│       └── callback/page.tsx    # Page de callback (client)
│
lib/
├── supabase/
│   ├── server.ts                # Client Supabase serveur
│   └── client.ts                # Client Supabase client
├── api/
│   └── auth.ts                  # Utilitaires auth (requireAuth, etc.)
└── hooks/
    └── useAuth.ts               # Hook React useAuth

middleware.ts                    # Middleware d'authentification
```

## 🔐 Sécurité

- ✅ Mots de passe hashés (gérés par Supabase)
- ✅ Sessions via cookies HTTP-only
- ✅ Protection CSRF intégrée (Supabase)
- ✅ Vérification d'email optionnelle
- ✅ Protection des routes via middleware
- ✅ Vérification des rôles dans les API routes

## ✨ Fonctionnalités récentes

### Comptes multiples avec la même email
- ✅ Un utilisateur peut avoir un compte touriste et un compte prestataire avec la même adresse email
- ✅ Les deux comptes ont des mots de passe différents
- ✅ Le système utilise des emails virtuels dans Supabase (`user+user@email.com`, `user+prestataire@email.com`)
- ✅ L'email réel est stocké dans Prisma avec une contrainte unique sur `[email, role]`

### Connexion améliorée
- ✅ Connexion directement côté client avec Supabase pour une meilleure gestion des sessions
- ✅ Sélecteur de type de compte sur la page de connexion
- ✅ Redirection automatique selon le rôle après connexion

### Déconnexion
- ✅ La déconnexion redirige automatiquement vers la page d'accueil (`/`)

## 🚀 Prochaines étapes (optionnel)

- [ ] Page de réinitialisation de mot de passe (`/forgot-password`)
- [ ] Page de changement de mot de passe
- [ ] Gestion des tokens de refresh
- [ ] Limitation des tentatives de connexion (rate limiting)
- [ ] 2FA (authentification à deux facteurs)
- [ ] Gestion des sessions multiples
- [ ] Logout de tous les appareils

## 📚 Documentation

Pour la configuration détaillée, voir [AUTH_SETUP.md](./AUTH_SETUP.md).



