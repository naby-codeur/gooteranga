# Guide de dépannage - GooTeranga

## ⚠️ Mode Développement

En mode développement, l'authentification est désactivée. Vous pouvez accéder directement aux tableaux de bord sans connexion.

## Problèmes courants

### 1. Erreur de connexion à la base de données

**Symptômes:**
```
Error: Can't reach database server
```

**Solutions:**
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez que `DATABASE_URL` est correct dans `.env.local`
3. Testez la connexion: `psql $DATABASE_URL`

### 2. Erreurs TypeScript

**Symptômes:**
```
Cannot find module '@supabase/...'
```

**Solutions:**
1. Les packages Supabase ont été retirés
2. Supprimez `node_modules` et `package-lock.json`
3. Réinstallez: `npm install`

### 3. Problèmes de build

**Symptômes:**
```
Build failed
```

**Solutions:**
1. Vérifiez les erreurs TypeScript: `npm run lint`
2. Supprimez `.next` et rebuild: `npm run build`
3. Vérifiez que toutes les imports Supabase ont été supprimées

## Support

Pour plus d'aide, consultez la documentation du projet.
