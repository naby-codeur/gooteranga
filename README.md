# GooTeranga - Plateforme de Tourisme au Sénégal

Plateforme web de mise en relation touristique pour digitaliser l'expérience touristique au Sénégal.

## 🚀 Technologies

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes (intégré)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Payments**: Stripe + CinetPay
- **Maps**: Leaflet.js
- **Charts**: Chart.js avec react-chartjs-2
- **i18n**: Next-Intl (FR/EN/AR)

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd gooteranga
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Remplir les variables dans `.env` avec vos clés Supabase, Stripe, etc.

4. **Configurer la base de données**
```bash
# Configurer DATABASE_URL dans .env avec votre URL Supabase
npx prisma generate
npx prisma db push
npx prisma migrate dev 
npx prisma migrate dev --name update

```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
gooteranga/
├── app/
│   ├── [locale]/          # Pages avec internationalisation
│   │   ├── page.tsx       # Page d'accueil
│   │   ├── explorer/      # Page d'exploration
│   │   ├── experience/    # Pages de détails d'expérience
│   │   ├── login/         # Connexion
│   │   ├── signup/        # Inscription
│   │   ├── dashboard/     # Dashboard utilisateur
│   │   ├── dashboard/prestataire/  # Dashboard prestataire
│   │   ├── dashboard/admin/  # Dashboard admin
│   │   ├── auth/callback/  # Callback OAuth
│   │   └── ...
│   ├── api/               # API Routes Next.js
│   │   ├── auth/          # Routes d'authentification
│   │   ├── offres/        # Routes pour les offres
│   │   ├── reservations/  # Routes pour les réservations
│   │   ├── paiements/     # Routes pour les paiements
│   │   ├── favoris/       # Routes pour les favoris
│   │   ├── avis/          # Routes pour les avis
│   │   ├── abonnements/   # Routes pour les abonnements
│   │   ├── boosts/        # Routes pour les boosts
│   │   └── admin/         # Routes admin
│   └── layout.tsx         # Layout racine
├── components/
│   ├── ui/                # Composants shadcn/ui
│   └── layout/            # Header, Footer
├── lib/
│   ├── api/               # Utilitaires API (auth, response)
│   ├── supabase/          # Clients Supabase (server & client)
│   ├── hooks/             # Hooks React (useAuth)
│   ├── utils/             # Utilitaires (auth helpers)
│   ├── prisma.ts          # Client Prisma
│   └── stripe.ts          # Client Stripe
├── prisma/
│   └── schema.prisma      # Schéma de base de données
├── i18n/                  # Configuration i18n
├── messages/              # Fichiers de traduction
└── types/                 # Types TypeScript
```

## 🎯 Fonctionnalités

### Côté Utilisateur
- ✅ Exploration des offres avec filtres avancés
- ✅ Pages de détails d'expérience
- ✅ Système d'authentification complet (Supabase Auth)
- ✅ Inscription/Connexion avec distinction Touriste/Prestataire
- ✅ **Comptes multiples avec la même email** : Un utilisateur peut avoir un compte touriste et un compte prestataire avec la même adresse email (mots de passe différents)
- ✅ Dashboard utilisateur avec profil, réservations, favoris
- ✅ OAuth (Google, Facebook)
- ✅ Déconnexion redirige vers la page d'accueil
- ⏳ Réservation et paiement (structure en place)
- ⏳ Profil utilisateur complet

### Côté Prestataire
- ✅ Dashboard prestataire complet
- ✅ Gestion d'annonces (CRUD)
- ✅ Gestion des réservations
- ✅ Système d'abonnements (GRATUIT, PRO, PREMIUM)
- ✅ Boosts et mise en avant d'offres
- ✅ Statistiques et revenus avec graphiques Chart.js
- ⏳ Upload d'images/vidéos (structure prête)

### Côté Administrateur
- ✅ Panel admin avec gestion complète
- ✅ Modération des offres et prestataires
- ✅ Statistiques globales avec graphiques Chart.js
- ✅ Gestion des utilisateurs
- ✅ Analytics avec graphiques interactifs (lignes, barres, secteurs)

## 🗄️ Modèles de données

Le schéma Prisma inclut:
- `User` - Utilisateurs (touristes, prestataires, admins)
  - **Contrainte unique** : `[email, role]` - permet à une même email d'avoir un compte USER et un compte PRESTATAIRE
- `Prestataire` - Prestataires de services
- `Offre` - Offres touristiques
- `Reservation` - Réservations
- `Paiement` - Paiements
- `Avis` - Avis et notes
- `Favori` - Favoris utilisateurs
- `Message` - Messagerie
- `Statistique` - Statistiques

## 🌍 Internationalisation

Le projet supporte 3 langues:
- 🇫🇷 Français (par défaut)
- 🇬🇧 English
- 🇸🇦 العربية

Les traductions sont dans le dossier `messages/`.

## 📝 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run start` - Lancer le serveur de production
- `npm run lint` - Lancer ESLint

## 🔐 Sécurité

- Variables d'environnement pour les clés sensibles
- Authentification via Supabase Auth
- Paiements sécurisés via Stripe (PCI-DSS)
- Protection CSRF intégrée

## 📄 Licence

Propriétaire - GooTeranga

## 👥 Contribution

Ce projet est en développement actif. Pour contribuer, veuillez créer une issue ou une pull request.



## 🔌 API Routes

Le projet utilise Next.js API Routes pour toutes les opérations backend. Les routes sont disponibles sous `/api/`:

### Routes disponibles

- **Authentification**: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`, `GET /api/auth/callback`
- **Offres**: `GET /api/offres`, `POST /api/offres`, `GET /api/offres/[id]`, `PUT /api/offres/[id]`, `DELETE /api/offres/[id]`
- **Réservations**: `GET /api/reservations`, `POST /api/reservations`, `GET /api/reservations/[id]`, `PUT /api/reservations/[id]`, `DELETE /api/reservations/[id]`
- **Paiements**: `POST /api/paiements/stripe/route`, `POST /api/paiements/stripe/webhook`
- **Favoris**: `GET /api/favoris`, `POST /api/favoris`, `DELETE /api/favoris/[offreId]`
- **Avis**: `POST /api/avis`
- **Abonnements**: `GET /api/abonnements`, `POST /api/abonnements`
- **Boosts**: `GET /api/boosts`, `POST /api/boosts`
- **Admin**: `GET /api/admin/*` (stats, prestataires, membres, activités)

Toutes les routes nécessitent une authentification (sauf certaines routes publiques). L'authentification est gérée via Supabase Auth avec gestion des rôles (USER, PRESTATAIRE, ADMIN).

Pour plus de détails, consultez la documentation dans `docs/API_ROUTES.md`.

