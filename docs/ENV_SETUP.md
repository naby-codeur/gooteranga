# Configuration des variables d'environnement

## Fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```env
# ============================================
# Database Configuration (REQUIS)
# ============================================
# URL de connexion à la base de données PostgreSQL
# Format: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://postgres:password@localhost:5432/gooteranga
DIRECT_URL=postgresql://postgres:password@localhost:5432/gooteranga

# ============================================
# Stripe Configuration (Optionnel)
# ============================================
# Pour les paiements en ligne
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ============================================
# CinetPay Configuration (Optionnel)
# ============================================
# Pour les paiements mobiles au Sénégal
CINETPAY_API_KEY=votre_api_key
CINETPAY_SITE_ID=votre_site_id

# ============================================
# Application Configuration
# ============================================
# URL de base de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mode de développement (authentification désactivée)
NODE_ENV=development
```

## Vérification

Après avoir configuré les variables:

1. **Redémarrez le serveur de développement**:
   ```bash
   npm run dev
   ```

2. **Testez l'application** en accédant à `http://localhost:3000`

## Notes importantes

- ⚠️ **Ne commitez JAMAIS** le fichier `.env.local` dans git
- ✅ Le fichier `.env.local` est déjà dans `.gitignore`
- 🔒 Gardez vos clés secrètes privées
- 📝 En mode développement, l'authentification est désactivée et les tableaux de bord sont accessibles directement
