# 🚀 Guide de Démarrage Rapide - GooTeranga

Ce guide vous aidera à démarrer rapidement avec le projet GooTeranga en moins de 5 minutes.

## 📋 Prérequis

- **Node.js 18+** et npm
- **Git** (pour cloner le projet)

> ⚠️ **Note** : Le projet fonctionne actuellement en mode développement. Aucune base de données ou service externe n'est nécessaire pour commencer.

## 🚀 Installation rapide

### 1. Cloner et installer

```bash
git clone <repository-url>
cd gooteranga
npm install
```

### 2. Configuration minimale

Créez un fichier `.env.local` à la racine du projet :

```env
# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

C'est tout ! Le projet peut fonctionner avec cette seule variable.

### 3. Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### 4. Accéder aux dashboards

En mode développement, vous pouvez accéder directement aux dashboards :

- **Dashboard Client** : http://localhost:3000/fr/dashboard
- **Dashboard Prestataire** : http://localhost:3000/fr/dashboard/prestataire  
- **Dashboard Admin** : http://localhost:3000/fr/dashboard/admin

> ✅ Aucune authentification requise en mode développement !

## 📊 Données fictives

Le projet utilise des données fictives pour le développement :

- **Utilisateurs** : Générés automatiquement selon l'URL
- **Réservations** : 3 réservations fictives
- **Favoris** : 3 favoris fictifs
- **Offres** : Données fictives via les hooks

## 🔧 Configuration optionnelle

### Base de données (optionnel)

Si vous souhaitez utiliser Prisma avec une vraie base de données :

1. **Installer PostgreSQL** (localement ou via service cloud)

2. **Configurer la connexion** dans `.env.local` :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/gooteranga
DIRECT_URL=postgresql://user:password@localhost:5432/gooteranga
```

3. **Générer le client Prisma** :
```bash
npx prisma generate
```

4. **Appliquer le schéma** :
```bash
npx prisma db push
```

> 💡 **Note** : En mode développement, la base de données est optionnelle car les données sont fictives.

## 🎨 Personnalisation

### Langues

Le projet supporte 3 langues :
- Français (`fr`) - par défaut
- Anglais (`en`)
- Arabe (`ar`)

Accéder à une langue spécifique :
- http://localhost:3000/fr (Français)
- http://localhost:3000/en (English)
- http://localhost:3000/ar (العربية)

### Couleurs

Les couleurs du thème peuvent être modifiées dans :
- `app/globals.css` - Variables CSS
- `tailwind.config` - Configuration Tailwind

## 📚 Documentation Complète

- [Mode Développement](DEVELOPMENT_MODE.md) - Guide complet du mode dev
- [État de l'Authentification](AUTH_STATUS.md) - Détails sur l'auth
- [Configuration Environnement](ENV_SETUP.md) - Variables d'environnement
- [API Routes](API_ROUTES.md) - Documentation des routes API
- [Dépannage](TROUBLESHOOTING.md) - Solutions aux problèmes courants

## 🔄 Prochaines Étapes

1. **Explorer les dashboards** : Visitez les différents dashboards pour voir les fonctionnalités
2. **Modifier les données fictives** : Éditez les hooks dans `lib/hooks/` pour personnaliser les données
3. **Développer des fonctionnalités** : Ajoutez de nouvelles fonctionnalités aux dashboards
4. **Préparer la production** : Consultez [AUTH_STATUS.md](AUTH_STATUS.md) pour la migration

## ❓ Besoin d'aide ?

- Consultez [TROUBLESHOOTING.md](TROUBLESHOOTING.md) pour les problèmes courants
- Vérifiez les logs de la console pour les erreurs
- Consultez la documentation dans le dossier `docs/`

## ✅ Vérification

Une fois le serveur lancé, vous devriez pouvoir :

- ✅ Accéder à http://localhost:3000
- ✅ Accéder aux dashboards sans authentification
- ✅ Voir des données fictives dans les dashboards
- ✅ Naviguer entre les différentes sections

Si tout fonctionne, vous êtes prêt à développer ! 🎉
