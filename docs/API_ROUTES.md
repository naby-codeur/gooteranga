# Documentation des API Routes Next.js

Ce document décrit toutes les routes API disponibles dans GooTeranga.

## 🔐 Authentification

Toutes les routes API (sauf celles explicitement publiques) nécessitent une authentification via Supabase Auth. L'authentification est gérée automatiquement via les cookies de session.

### Rôles utilisateurs

- `USER` - Utilisateur standard (touriste)
- `PRESTATAIRE` - Prestataire de services
- `ADMIN` - Administrateur

## 📡 Routes API

### Authentification

#### `POST /api/auth/signup`

Crée un nouveau compte utilisateur (Touriste ou Prestataire).

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+221 77 123 45 67",
  "role": "USER",
  // Pour PRESTATAIRE uniquement:
  "nomEntreprise": "Mon Hôtel",
  "typePrestataire": "HOTEL",
  "adresse": "...",
  "ville": "...",
  "region": "...",
  "description": "..."
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "USER" },
    "requiresEmailVerification": true
  }
}
```

#### `POST /api/auth/login`

Connecte un utilisateur. **Note** : La connexion se fait maintenant principalement côté client via la page `/login` pour une meilleure gestion des sessions. Cette route API est toujours disponible mais peut être utilisée pour des cas spécifiques.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "USER" }
  }
}
```

**Important** : La page de connexion (`/login`) permet de sélectionner le type de compte (Touriste ou Prestataire) car une même adresse email peut être utilisée pour les deux types de comptes avec des mots de passe différents.

#### `POST /api/auth/logout`

Déconnecte l'utilisateur actuel. Après la déconnexion, l'utilisateur est automatiquement redirigé vers la page d'accueil (`/`) via le hook `useAuth()`.

#### `GET /api/auth/session`

Récupère la session actuelle de l'utilisateur avec toutes les informations (incluant le profil prestataire si applicable).

**Réponse:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "...",
      "nom": "...",
      "role": "PRESTATAIRE",
      "prestataire": { ... }
    }
  }
}
```

#### `GET /api/auth/callback`

Gère les callbacks OAuth et les confirmations d'email. Redirige automatiquement vers le dashboard approprié selon le rôle.

**Query Parameters:**
- `code` - Code d'autorisation OAuth
- `next` - URL de redirection après authentification

Pour plus de détails sur l'authentification, consultez `docs/AUTH_SETUP.md` et `docs/AUTH_IMPLEMENTATION.md`.

---

### Offres

#### `GET /api/offres`

Récupère la liste des offres avec filtres optionnels.

**Query Parameters:**
- `type` - Type d'offre (HEBERGEMENT, GUIDE, ACTIVITE, RESTAURANT, CULTURE, EVENEMENT)
- `region` - Région
- `ville` - Ville
- `minPrix` - Prix minimum
- `maxPrix` - Prix maximum
- `isActive` - Offres actives (défaut: true)
- `isFeatured` - Offres en vedette (true/false)
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 20)

**Réponse:**
```json
{
  "success": true,
  "data": {
    "offres": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### `POST /api/offres`

Crée une nouvelle offre. **Requiert le rôle PRESTATAIRE.**

**Body:**
```json
{
  "titre": "Séjour à Dakar",
  "description": "Description de l'offre",
  "type": "HEBERGEMENT",
  "region": "Dakar",
  "ville": "Dakar",
  "adresse": "Adresse complète",
  "latitude": 14.7167,
  "longitude": -17.4677,
  "prix": 50000,
  "prixUnite": "par nuit",
  "images": ["url1", "url2"],
  "videos": ["url1"],
  "duree": 24,
  "capacite": 4,
  "disponibilite": {}
}
```

#### `GET /api/offres/[id]`

Récupère les détails d'une offre spécifique.

#### `PUT /api/offres/[id]`

Met à jour une offre. **Requiert d'être le propriétaire ou ADMIN.**

#### `DELETE /api/offres/[id]`

Supprime une offre. **Requiert d'être le propriétaire ou ADMIN.**

---

### Réservations

#### `GET /api/reservations`

Récupère la liste des réservations de l'utilisateur authentifié.

**Query Parameters:**
- `statut` - Filtrer par statut (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `page` - Numéro de page
- `limit` - Nombre d'éléments par page

#### `POST /api/reservations`

Crée une nouvelle réservation.

**Body:**
```json
{
  "offreId": "offre_id",
  "dateDebut": "2024-01-15T00:00:00Z",
  "dateFin": "2024-01-20T00:00:00Z",
  "nombrePersonnes": 2,
  "notes": "Notes optionnelles"
}
```

#### `GET /api/reservations/[id]`

Récupère les détails d'une réservation. **Requiert d'être le propriétaire, le prestataire ou ADMIN.**

#### `PUT /api/reservations/[id]`

Met à jour le statut d'une réservation.

**Body:**
```json
{
  "statut": "CONFIRMED"
}
```

#### `DELETE /api/reservations/[id]`

Annule une réservation. **Seules les réservations PENDING peuvent être annulées.**

---

### Paiements

#### `POST /api/paiements/stripe/create-intent`

Crée un PaymentIntent Stripe pour une réservation.

**Body:**
```json
{
  "reservationId": "reservation_id"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx",
    "paiement": {...}
  }
}
```

#### `POST /api/paiements/stripe/webhook`

Webhook Stripe pour gérer les événements de paiement. **Ne nécessite pas d'authentification utilisateur.**

---

### Favoris

#### `GET /api/favoris`

Récupère la liste des favoris de l'utilisateur authentifié.

#### `POST /api/favoris`

Ajoute une offre aux favoris.

**Body:**
```json
{
  "offreId": "offre_id"
}
```

#### `DELETE /api/favoris/[offreId]`

Retire une offre des favoris.

---

### Avis

#### `POST /api/avis`

Crée un nouvel avis pour une offre.

**Body:**
```json
{
  "offreId": "offre_id",
  "reservationId": "reservation_id", // Optionnel
  "rating": 5,
  "commentaire": "Excellent séjour !"
}
```

---

## 🔧 Utilitaires API

### Format de réponse

Toutes les routes API retournent un format standardisé:

**Succès:**
```json
{
  "success": true,
  "data": {...},
  "message": "Message optionnel"
}
```

**Erreur:**
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

### Codes de statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `409` - Conflit (ressource existe déjà)
- `500` - Erreur serveur

### Gestion des erreurs

Les erreurs sont automatiquement capturées et formatées. Les erreurs Prisma sont converties en messages d'erreur lisibles.

---

## 📝 Exemple d'utilisation

### Utilisation directe avec fetch

```typescript
// Récupérer les offres
const response = await fetch('/api/offres?type=HEBERGEMENT&region=Dakar')
const data = await response.json()

if (data.success) {
  console.log(data.data.offres)
} else {
  console.error(data.error)
}

// Créer une réservation
const reservationResponse = await fetch('/api/reservations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    offreId: 'offre_123',
    dateDebut: '2024-01-15T00:00:00Z',
    dateFin: '2024-01-20T00:00:00Z',
    nombrePersonnes: 2,
  }),
})
```

### Utilisation avec le client API (recommandé)

Le projet inclut un client API dans `lib/api/client.ts` qui simplifie les appels :

```typescript
import { offresApi, reservationsApi, favorisApi } from '@/lib/api/client'

// Récupérer les offres
const offresResponse = await offresApi.getAll({
  type: 'HEBERGEMENT',
  region: 'Dakar',
  page: 1,
  limit: 20,
})

if (offresResponse.success) {
  console.log(offresResponse.data?.offres)
}

// Créer une réservation
const reservationResponse = await reservationsApi.create({
  offreId: 'offre_123',
  dateDebut: '2024-01-15T00:00:00Z',
  dateFin: '2024-01-20T00:00:00Z',
  nombrePersonnes: 2,
})

// Ajouter aux favoris
const favoriResponse = await favorisApi.add('offre_123')
```

### Utilisation dans un composant React

```typescript
'use client'

import { useState, useEffect } from 'react'
import { offresApi } from '@/lib/api/client'

export function OffresList() {
  const [offres, setOffres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOffres() {
      const response = await offresApi.getAll({ type: 'HEBERGEMENT' })
      if (response.success) {
        setOffres(response.data?.offres || [])
      }
      setLoading(false)
    }
    fetchOffres()
  }, [])

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      {offres.map(offre => (
        <div key={offre.id}>{offre.titre}</div>
      ))}
    </div>
  )
}
```

---

## 🔒 Sécurité

- Toutes les routes authentifiées vérifient l'utilisateur via Supabase Auth
- Les permissions sont vérifiées (propriétaire, rôle, etc.)
- Les validations sont effectuées côté serveur
- Les webhooks Stripe utilisent la vérification de signature

