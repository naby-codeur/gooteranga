# 🔐 Guide d'Accès au Dashboard Admin

Ce guide explique comment accéder au dashboard administrateur en développement et en production.

## 📋 Prérequis

- Un compte utilisateur avec le rôle `ADMIN` dans la base de données
- Un compte correspondant dans Supabase Auth avec le même email
- Les variables d'environnement Supabase configurées

---

## 🛠️ En Développement

### Méthode 1 : Script de Seed (Recommandé)

1. **Créer l'utilisateur admin dans la base de données** :
   ```bash
   # Installer tsx si nécessaire
   npm install -D tsx
   
   # Exécuter le script de seed
   npx tsx scripts/seed-admin.ts
   ```

   Le script va :
   - ✅ Créer un utilisateur avec le rôle `ADMIN` dans Prisma
   - ✅ Utiliser l'email `admin@gooteranga.com` par défaut
   - ✅ Afficher les instructions pour créer l'utilisateur dans Supabase

2. **Personnaliser l'email et le nom** (optionnel) :
   ```bash
   ADMIN_EMAIL=votre-email@example.com ADMIN_NOM=VotreNom ADMIN_PRENOM=VotrePrenom npx tsx scripts/seed-admin.ts
   ```

3. **Créer l'utilisateur dans Supabase Auth** :
   - Allez dans votre projet Supabase
   - **Authentication** > **Users**
   - Cliquez sur **Add user** > **Create new user**
   - Remplissez :
     - **Email** : `admin+admin@gooteranga.com` (email virtuel avec le suffixe +admin)
       - Si votre email réel est `admin@gooteranga.com`, l'email Supabase sera `admin+admin@gooteranga.com`
     - **Password** : Choisissez un mot de passe sécurisé
     - **Auto Confirm User** : ✅ Cochez cette case
   - Cliquez sur **Create user**

4. **Se connecter** :
   ```bash
   # Lancer le serveur de développement
   npm run dev
   ```
   - Ouvrez `http://localhost:3000/fr/login`
   - **Important** : Pour un compte ADMIN, vous devez :
     - Entrer votre email réel (ex: `admin@gooteranga.com`)
     - Sélectionner **"Prestataire"** dans le sélecteur de type de compte
       - Le système générera automatiquement l'email virtuel `admin+admin@gooteranga.com` pour Supabase
     - Entrer votre mot de passe (celui créé dans Supabase avec l'email virtuel)
   - Après connexion, vous serez automatiquement redirigé vers `/fr/dashboard/admin` selon votre rôle

### Méthode 2 : Via Prisma Studio

1. **Lancer Prisma Studio** :
   ```bash
   npx prisma studio
   ```

2. **Créer l'utilisateur admin** :
   - Ouvrez `http://localhost:5555` dans votre navigateur
   - Allez dans la table **User**
   - Cliquez sur **Add record**
   - Remplissez :
     - **email** : `admin@gooteranga.com`
     - **nom** : `Admin`
     - **prenom** : `GooTeranga` (optionnel)
     - **role** : Sélectionnez `ADMIN` dans le dropdown
   - Cliquez sur **Save 1 change**

3. **Créer l'utilisateur dans Supabase Auth** (voir étape 3 de la Méthode 1)

4. **Se connecter** (voir étape 4 de la Méthode 1)

### Méthode 3 : Via SQL dans Supabase

1. **Allez dans Supabase > SQL Editor**

2. **Exécutez cette requête** (remplacez l'email et le nom) :
   ```sql
   INSERT INTO "User" (id, email, nom, prenom, role, "createdAt", "updatedAt")
   VALUES (
     gen_random_uuid()::text,
     'admin@gooteranga.com',
     'Admin',
     'GooTeranga',
     'ADMIN',
     NOW(),
     NOW()
   );
   ```

3. **Créer l'utilisateur dans Supabase Auth** (voir étape 3 de la Méthode 1)

4. **Se connecter** (voir étape 4 de la Méthode 1)

### Méthode 4 : Via l'API Admin (si vous avez déjà un admin)

Si vous avez déjà un compte admin, vous pouvez créer d'autres admins via l'API :

```bash
# POST /api/admin/membres
curl -X POST http://localhost:3000/api/admin/membres \
  -H "Content-Type: application/json" \
  -H "Cookie: votre-session-cookie" \
  -d '{
    "email": "nouveau-admin@example.com",
    "nom": "Nouveau",
    "prenom": "Admin",
    "role": "ADMIN"
  }'
```

---

## 🚀 En Production (Déploiement)

### Étape 1 : Créer l'utilisateur admin dans la base de données

**Option A : Via le script de seed** (recommandé pour le premier admin)
```bash
# Sur votre serveur de production
ADMIN_EMAIL=admin@votre-domaine.com ADMIN_NOM=Admin npx tsx scripts/seed-admin.ts
```

**Option B : Via Prisma Studio en production**
```bash
# Connectez-vous à votre base de données de production
DATABASE_URL="votre-url-production" npx prisma studio
```

**Option C : Via SQL dans Supabase**
- Allez dans votre projet Supabase de production
- SQL Editor > Exécutez la requête SQL (voir Méthode 3 ci-dessus)

### Étape 2 : Créer l'utilisateur dans Supabase Auth (Production)

1. Allez dans votre projet Supabase de **production**
2. **Authentication** > **Users**
3. **Add user** > **Create new user**
4. Remplissez les informations (même email que dans la DB)
5. **Auto Confirm User** : ✅ Cochez
6. Créez un mot de passe sécurisé

### Étape 3 : Se connecter

1. Allez sur votre site de production : `https://votre-domaine.com/fr/login`
2. **Pour un compte ADMIN** :
   - Entrez votre email réel (ex: `admin@votre-domaine.com`)
   - Sélectionnez **"Prestataire"** dans le sélecteur de type de compte
   - Entrez votre mot de passe
3. Vous serez automatiquement redirigé vers `/fr/dashboard/admin` selon votre rôle

---

## 🔒 Sécurité

### Bonnes pratiques

1. **Mot de passe fort** : Utilisez un mot de passe complexe pour les comptes admin
2. **Email unique** : Utilisez un email dédié pour l'administration
3. **Accès limité** : Ne créez que le nombre nécessaire de comptes admin
4. **Rotation des mots de passe** : Changez régulièrement les mots de passe admin
5. **Surveillance** : Surveillez les accès admin dans les logs

### Protection des routes

- ✅ Le dashboard admin est protégé par le layout (`app/[locale]/dashboard/admin/layout.tsx`)
- ✅ Seuls les utilisateurs avec `role: 'ADMIN'` peuvent accéder
- ✅ Les utilisateurs non authentifiés sont redirigés vers `/login`
- ✅ Les utilisateurs non-admin sont redirigés vers leur dashboard respectif

---

## 🐛 Dépannage

### Problème : "Vous n'avez pas les permissions"

**Solution** :
1. Vérifiez que l'utilisateur a bien le rôle `ADMIN` dans la base de données
2. Vérifiez que l'email dans Prisma correspond à l'email dans Supabase Auth
3. Déconnectez-vous et reconnectez-vous pour rafraîchir la session

### Problème : Redirection vers login en boucle

**Solution** :
1. Vérifiez que Supabase est correctement configuré (variables d'environnement)
2. Vérifiez que l'utilisateur existe dans Supabase Auth
3. Vérifiez que l'email est confirmé dans Supabase

### Problème : L'utilisateur n'existe pas dans Prisma

**Solution** :
1. Exécutez le script de seed : `npx tsx scripts/seed-admin.ts`
2. Ou créez l'utilisateur manuellement via Prisma Studio

### Problème : Erreur "Unauthorized" ou "Forbidden"

**Solution** :
1. Vérifiez que vous êtes bien connecté
2. Vérifiez que votre rôle est bien `ADMIN` dans la base de données
3. Vérifiez les logs du serveur pour plus de détails

---

## 📝 Notes importantes

1. **Email virtuel** : Le système utilise des emails virtuels pour Supabase (format : `email+role@domain.com`). Pour un admin, l'email Supabase sera `admin+admin@gooteranga.com` si l'email réel est `admin@gooteranga.com`. **Important** : 
   - Dans Supabase Auth, créez l'utilisateur avec l'email virtuel : `admin+admin@gooteranga.com`
   - Lors de la connexion, sélectionnez **"Prestataire"** dans le sélecteur et entrez votre email réel (`admin@gooteranga.com`)
   - Le système générera automatiquement l'email virtuel `email+admin@domain.com` pour la connexion Supabase

2. **Comptes multiples** : Un même email peut avoir plusieurs comptes (USER, PRESTATAIRE, ADMIN) avec des mots de passe différents.

3. **Premier admin** : Le premier admin doit être créé manuellement. Ensuite, les autres admins peuvent être créés via l'interface admin.

4. **Variables d'environnement** : Assurez-vous que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont correctement configurées.

---

## 🔗 URLs importantes

- **Dashboard Admin** : `/fr/dashboard/admin` (ou `/en/dashboard/admin`, `/ar/dashboard/admin`)
- **Page de connexion** : `/fr/login`
- **API Admin Membres** : `/api/admin/membres` (pour créer d'autres admins)

---

**Dernière mise à jour** : Décembre 2024

