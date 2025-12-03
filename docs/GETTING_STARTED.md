# 🚀 Guide de Démarrage Rapide - GooTeranga

Ce guide vous aidera à démarrer rapidement avec le projet GooTeranga en 5 minutes.

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Compte Stripe (pour les paiements)
- Compte CinetPay (optionnel, pour les paiements mobiles)

## 🚀 Installation rapide

### 1. Cloner et installer

```bash
git clone <repository-url>
cd gooteranga
npm install
```

### 2. Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer l'URL et la clé anonyme depuis les paramètres du projet
3. Créer une base de données PostgreSQL

### 3. Configuration de la base de données

1. Copier `.env.example` vers `.env`
2. Remplir `DATABASE_URL` avec votre URL Supabase:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```
3. Générer le client Prisma:
   ```bash
   npx prisma generate
   ```
4. Appliquer le schéma à la base de données:
   ```bash
   npx prisma db push
   ```

### 4. Configuration des variables d'environnement

Remplir le fichier `.env` avec vos clés:

```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (optionnel pour commencer)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# CinetPay (optionnel)
CINETPAY_API_KEY=your_api_key
CINETPAY_SITE_ID=your_site_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans `app/globals.css`. Vous pouvez les modifier pour correspondre à votre identité visuelle.

### Traductions

Les fichiers de traduction sont dans `messages/`:
- `fr.json` - Français
- `en.json` - English
- `ar.json` - العربية

### Composants UI

Les composants shadcn/ui peuvent être ajoutés avec:
```bash
npx shadcn@latest add [component-name]
```

## 📁 Structure des dossiers

```
app/
  [locale]/          # Pages avec i18n
    page.tsx         # Accueil
    explorer/        # Exploration
    experience/      # Détails expérience
    login/           # Connexion
    signup/          # Inscription
components/
  ui/                # Composants shadcn/ui
  layout/            # Header, Footer
  map/               # Composants cartes
lib/
  supabase/          # Clients Supabase
  prisma.ts          # Client Prisma
  stripe.ts          # Client Stripe
  regions.ts         # Données régions
prisma/
  schema.prisma      # Schéma base de données
messages/            # Traductions
```

## 🔐 Authentification

L'authentification utilise Supabase Auth. Pour l'implémenter:

1. Configurer Supabase Auth dans le dashboard
2. Créer les pages de connexion/inscription (déjà créées)
3. Ajouter la logique d'authentification dans les composants

## 💳 Paiements

### Stripe

1. Créer un compte Stripe
2. Récupérer les clés API (mode test)
3. Configurer les webhooks pour les événements de paiement

### CinetPay

1. Créer un compte CinetPay
2. Récupérer l'API Key et Site ID
3. Configurer les callbacks

## 🗺️ Cartes

Les cartes utilisent Leaflet.js. Le composant `MapView` est disponible dans `components/map/MapView.tsx`.

## 🧪 Tests

Pour tester l'application:

1. Créer un compte utilisateur
2. Créer un compte prestataire
3. Ajouter une offre
4. Faire une réservation de test

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com)
- [Documentation Next-Intl](https://next-intl-docs.vercel.app)

## 🐛 Problèmes courants

### Erreur de connexion à la base de données

Vérifier que:
- `DATABASE_URL` est correct
- La base de données Supabase est accessible
- Les migrations Prisma sont appliquées

### Erreur d'authentification Supabase

Vérifier que:
- Les clés Supabase sont correctes
- L'URL Supabase est correcte
- Les règles RLS (Row Level Security) sont configurées

### Erreur de build

```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run build
```

## 🆘 Support

Pour toute question ou problème, créer une issue sur le repository.


