# Gestion des Rôles Utilisateurs - Touristes et Prestataires

Ce document explique comment le système d'authentification distingue et gère les différents types d'utilisateurs dans GooTeranga.

## 🎭 Types d'utilisateurs

Le système supporte trois types d'utilisateurs :

1. **USER** (Touriste/Voyageur) - Utilisateur standard qui cherche des expériences
2. **PRESTATAIRE** - Prestataire de services (hôtel, guide, restaurant, etc.)
3. **ADMIN** - Administrateur de la plateforme

## 📝 Inscription selon le type

### Touriste (USER)

Lors de l'inscription, l'utilisateur choisit le type "Voyageur / Touriste" :

- **Champs requis** : Email, mot de passe, nom, prénom
- **Champs optionnels** : Téléphone, nationalité, pays de résidence
- **Profil créé** : Seulement dans la table `User` avec `role = 'USER'`

### Prestataire (PRESTATAIRE)

Lors de l'inscription, l'utilisateur choisit le type "Prestataire" :

- **Champs requis** : 
  - Informations personnelles : Email, mot de passe, nom, prénom
  - Informations entreprise : Nom de l'entreprise, type de prestataire
- **Champs optionnels** : Téléphone, adresse, ville, région, description
- **Profils créés** : 
  - Dans la table `User` avec `role = 'PRESTATAIRE'`
  - Dans la table `Prestataire` avec les informations de l'entreprise

**Types de prestataires disponibles** :
- HOTEL
- GUIDE
- AGENCE
- RESTAURANT
- ARTISAN
- ASSOCIATION
- AUBERGE
- TRANSPORT
- AUTRE

## 🔐 Authentification et redirection

### Connexion

Les deux types d'utilisateurs utilisent la même page de connexion (`/login`), mais sont redirigés vers des dashboards différents après authentification :

- **USER** → `/dashboard` (Dashboard touriste)
- **PRESTATAIRE** → `/dashboard/prestataire` (Dashboard prestataire)
- **ADMIN** → `/dashboard/admin` (Dashboard admin)

### Protection des routes

Chaque dashboard est protégé selon le rôle :

#### Dashboard Touriste (`/dashboard`)
- ✅ Accessible uniquement aux **USER**
- 🔒 Les **PRESTATAIRE** sont redirigés vers `/dashboard/prestataire`
- 🔒 Les **ADMIN** sont redirigés vers `/dashboard/admin`

#### Dashboard Prestataire (`/dashboard/prestataire`)
- ✅ Accessible aux **PRESTATAIRE**
- ✅ Accessible aux **ADMIN** (pour la gestion)
- 🔒 Les **USER** sont redirigés vers `/dashboard`

#### Dashboard Admin (`/dashboard/admin`)
- ✅ Accessible uniquement aux **ADMIN**
- 🔒 Les autres rôles sont redirigés vers leurs dashboards respectifs

## 🛠️ Fonctionnalités par rôle

### Touriste (USER)

- ✅ Explorer les offres disponibles
- ✅ Réserver des expériences
- ✅ Gérer ses réservations
- ✅ Laisser des avis
- ✅ Ajouter des offres en favoris
- ✅ Communiquer avec les prestataires
- ❌ Ne peut pas créer d'offres

### Prestataire (PRESTATAIRE)

- ✅ Créer et gérer ses offres
- ✅ Gérer ses réservations
- ✅ Voir les statistiques de ses offres
- ✅ Gérer ses abonnements (GRATUIT, PRO, PREMIUM)
- ✅ Activer des boosts pour ses offres
- ✅ Recevoir des paiements
- ✅ Communiquer avec les clients
- ❌ Ne peut pas réserver (c'est un prestataire, pas un client)

## 📊 Structure de données

### Table User

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  nom           String
  prenom        String?
  telephone     String?
  role          UserRole  @default(USER)  // USER, PRESTATAIRE, ADMIN
  // ...
}
```

### Table Prestataire

```prisma
model Prestataire {
  id              String          @id @default(cuid())
  userId          String          @unique
  user            User            @relation(...)
  type            PrestataireType // HOTEL, GUIDE, etc.
  nomEntreprise   String
  // ...
}
```

**Important** : Seuls les utilisateurs avec `role = 'PRESTATAIRE'` ont une entrée dans la table `Prestataire`.

## 🔄 Flux d'inscription

### Inscription Touriste

1. Utilisateur choisit "Voyageur / Touriste"
2. Remplit le formulaire (email, password, nom, etc.)
3. `POST /api/auth/signup` avec `role: 'USER'`
4. Création dans Supabase Auth
5. Création dans Prisma `User` avec `role = 'USER'`
6. Pas de profil `Prestataire` créé

### Inscription Prestataire

1. Utilisateur choisit "Prestataire"
2. Remplit le formulaire complet (personnel + entreprise)
3. `POST /api/auth/signup` avec `role: 'PRESTATAIRE'` + données entreprise
4. Création dans Supabase Auth
5. Création dans Prisma `User` avec `role = 'PRESTATAIRE'`
6. Création dans Prisma `Prestataire` avec les infos entreprise

## 🎯 Vérification du rôle dans le code

### Côté serveur (API Routes, Server Components)

```typescript
import { requireRole } from '@/lib/api/auth'

// Vérifier si l'utilisateur est prestataire
const user = await requireRole('PRESTATAIRE', request)

// Vérifier si l'utilisateur est admin
const admin = await requireRole('ADMIN', request)
```

### Côté client (Composants React)

```typescript
import { useAuth } from '@/lib/hooks/useAuth'

function MyComponent() {
  const { user } = useAuth()

  if (user?.role === 'PRESTATAIRE') {
    // Afficher les fonctionnalités prestataire
  } else if (user?.role === 'USER') {
    // Afficher les fonctionnalités touriste
  }
}
```

### Utilitaires

```typescript
import { getDashboardPath, canAccessDashboard } from '@/lib/utils/auth'

// Obtenir le dashboard selon le rôle
const dashboardPath = getDashboardPath(user.role) // '/dashboard/prestataire' si PRESTATAIRE

// Vérifier l'accès
const canAccess = canAccessDashboard('PRESTATAIRE', '/dashboard/prestataire') // true
```

## 🔍 Exemples de routes protégées

### Routes API

- `POST /api/offres` → Nécessite `PRESTATAIRE` ou `ADMIN`
- `GET /api/reservations` → Nécessite `USER`, `PRESTATAIRE` ou `ADMIN`
- `POST /api/favoris` → Nécessite `USER` ou `PRESTATAIRE` ou `ADMIN`
- `GET /api/admin/*` → Nécessite `ADMIN`

### Routes Pages

- `/dashboard` → Nécessite `USER`
- `/dashboard/prestataire` → Nécessite `PRESTATAIRE` ou `ADMIN`
- `/dashboard/admin` → Nécessite `ADMIN`

## ✅ Vérification dans l'implémentation actuelle

Le système actuel :

- ✅ Distingue les deux types lors de l'inscription
- ✅ Crée le profil Prestataire si nécessaire
- ✅ Redirige vers le bon dashboard après connexion
- ✅ Protège les dashboards selon le rôle
- ✅ Vérifie les rôles dans les routes API
- ✅ Supporte la gestion des rôles dans les composants clients

Tout est en place pour gérer correctement les Touristes et les Prestataires ! 🎉



