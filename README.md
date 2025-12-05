# GooTeranga - Plateforme de Tourisme au Sénégal

Plateforme web de mise en relation touristique pour digitaliser l'expérience touristique au Sénégal.

## 🚀 Technologies

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes (intégré)
- **Database**: PostgreSQL (via Prisma) - optionnel en mode dev
- **ORM**: Prisma
- **Authentication**: Mode développement (authentification désactivée)
- **Payments**: Stripe + CinetPay (non configuré)
- **Maps**: Leaflet.js
- **Charts**: Chart.js avec react-chartjs-2
- **i18n**: Next-Intl (FR/EN/AR)

## ⚠️ Mode Développement

**Le projet fonctionne actuellement en mode développement** :
- ✅ Authentification désactivée - Accès direct aux dashboards
- ✅ Données fictives - Pas besoin de base de données pour commencer
- ✅ Développement rapide sans dépendances externes

Consultez [docs/DEVELOPMENT_MODE.md](docs/DEVELOPMENT_MODE.md) pour plus d'informations.

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

3. **Configurer les variables d'environnement (optionnel en mode dev)**
```bash
cp .env.example .env.local
```

Pour le développement, seule l'URL de l'application est nécessaire :
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Pour utiliser Prisma (optionnel) :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/gooteranga
DIRECT_URL=postgresql://user:password@localhost:5432/gooteranga
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Accéder aux dashboards**

En mode développement, vous pouvez accéder directement à :
- Dashboard Client : http://localhost:3000/fr/dashboard
- Dashboard Prestataire : http://localhost:3000/fr/dashboard/prestataire
- Dashboard Admin : http://localhost:3000/fr/dashboard/admin

## 🎯 Structure du Projet

```
gooteranga/
├── app/                    # Pages Next.js (App Router)
│   ├── [locale]/          # Pages internationalisées
│   │   ├── dashboard/     # Dashboards (client, prestataire, admin)
│   │   ├── login/         # Page de connexion
│   │   └── signup/        # Page d'inscription
│   └── api/               # Routes API
│       └── auth/          # Routes d'authentification (mode dev)
├── components/            # Composants React réutilisables
│   ├── layout/           # Composants de layout (Header, Sidebar, etc.)
│   └── ui/               # Composants UI (shadcn/ui)
├── lib/                   # Utilitaires et hooks
│   ├── hooks/            # Hooks React personnalisés
│   ├── api/              # Utilitaires API
│   └── utils/            # Fonctions utilitaires
├── prisma/               # Schéma Prisma (optionnel)
├── docs/                 # Documentation
└── public/               # Fichiers statiques
```

## 📚 Documentation

- [Guide de Démarrage](docs/GETTING_STARTED.md)
- [Mode Développement](docs/DEVELOPMENT_MODE.md)
- [État de l'Authentification](docs/AUTH_STATUS.md)
- [Configuration Environnement](docs/ENV_SETUP.md)
- [Dépannage](docs/TROUBLESHOOTING.md)
- [API Routes](docs/API_ROUTES.md)

## ✨ Fonctionnalités

- ✅ **Dashboards** : Client, Prestataire, Admin avec données fictives
- ✅ **Gestion des offres** : CRUD pour les prestataires
- ✅ **Réservations** : Suivi des réservations (données fictives)
- ✅ **Favoris** : Gestion des favoris (données fictives)
- ✅ **Internationalisation** : FR/EN/AR
- ✅ **Design responsive** : Mobile-first
- ⏳ **Authentification** : Désactivée en mode dev
- ⏳ **Paiements** : Non implémenté
- ⏳ **Upload fichiers** : Non implémenté

## 🔄 Migration vers la Production

Pour passer en production, vous devrez :

1. **Réactiver l'authentification**
   - Choisir un système d'authentification (NextAuth, Supabase, etc.)
   - Mettre à jour les routes API et hooks

2. **Connecter une base de données**
   - Configurer Prisma avec une vraie base PostgreSQL
   - Remplacer les données fictives par des appels API réels

3. **Configurer les services externes**
   - Stripe pour les paiements
   - Service de stockage pour les images

Consultez [docs/AUTH_STATUS.md](docs/AUTH_STATUS.md) pour plus de détails.

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Construire pour la production
npm run start        # Lancer le serveur de production
npm run lint         # Vérifier le code avec ESLint
```

## 📝 Notes

- Le projet est en mode développement avec authentification désactivée
- Les données sont fictives et ne sont pas persistées
- Consultez la documentation dans `docs/` pour plus d'informations

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez la documentation pour comprendre la structure du projet.
