# Mode Développement - GooTeranga

## Vue d'ensemble

Le projet fonctionne actuellement en **mode développement** avec l'authentification désactivée et des données fictives. Cela permet de développer et tester les fonctionnalités sans dépendre de services externes.

## Authentification

### Accès direct aux dashboards

Vous pouvez accéder directement aux tableaux de bord sans connexion :

- **Dashboard Client** : `/fr/dashboard` (ou `/en/dashboard`, `/ar/dashboard`)
- **Dashboard Prestataire** : `/fr/dashboard/prestataire`
- **Dashboard Admin** : `/fr/dashboard/admin`

### Utilisateurs fictifs

Le système génère automatiquement un utilisateur fictif selon l'URL :

| Route | Utilisateur fictif | Rôle |
|-------|-------------------|------|
| `/dashboard` | client@example.com | USER |
| `/dashboard/prestataire` | prestataire@example.com | PRESTATAIRE |
| `/dashboard/admin` | admin@gooteranga.com | ADMIN |

## Données fictives

### Réservations

Le hook `useReservations` retourne 3 réservations fictives :
- Visite de l'Île de Gorée (CONFIRMED)
- Hôtel Teranga - Chambre double (PENDING)
- Safari dans le Parc Niokolo-Koba (COMPLETED)

### Favoris

Le hook `useFavoris` retourne 3 favoris fictifs :
- Visite de l'Île de Gorée
- Hôtel Teranga - Chambre double
- Restaurant La Teranga

## Développement

### Avantages

- ✅ Pas besoin de configurer Supabase ou d'autres services
- ✅ Pas besoin de créer des comptes de test
- ✅ Développement rapide sans dépendances externes
- ✅ Tests faciles avec données prédictibles

### Limitations

- ❌ Pas de persistance des données
- ❌ Pas de véritable authentification
- ❌ Les modifications ne sont pas sauvegardées
- ❌ Pas de synchronisation avec une base de données

## Configuration

### Variables d'environnement minimales

Pour le développement, seul `DATABASE_URL` est optionnellement nécessaire si vous utilisez Prisma :

```env
# Optionnel pour Prisma
DATABASE_URL=postgresql://user:password@localhost:5432/gooteranga
DIRECT_URL=postgresql://user:password@localhost:5432/gooteranga

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Packages requis

Les packages d'authentification ont été retirés. Les dépendances principales sont :

- `next` : Framework React
- `prisma` : ORM (optionnel en mode dev)
- `next-intl` : Internationalisation
- Composants UI (Radix UI, Tailwind CSS)

## Migration vers la production

Quand vous serez prêt pour la production :

1. **Choisir un système d'authentification**
   - NextAuth.js
   - Supabase Auth
   - Auth0
   - Custom JWT

2. **Réactiver l'authentification**
   - Mettre à jour `lib/api/auth.ts`
   - Mettre à jour `lib/hooks/useAuth.ts`
   - Réactiver les vérifications dans les layouts

3. **Connecter à une base de données**
   - Configurer Prisma avec une vraie base de données
   - Remplacer les données fictives par des appels API
   - Implémenter la persistance des données

4. **Sécuriser les routes**
   - Réactiver les middleware d'authentification
   - Implémenter les vérifications de rôles
   - Ajouter la gestion des sessions

