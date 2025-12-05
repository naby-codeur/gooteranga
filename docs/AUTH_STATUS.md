# État de l'authentification - GooTeranga

## Mode Développement Actuel

**IMPORTANT** : L'authentification Supabase a été complètement retirée du projet. Le système fonctionne actuellement en mode développement avec des données fictives.

### État actuel

- ✅ **Authentification désactivée** : Accès direct aux tableaux de bord sans connexion
- ✅ **Données fictives** : Tous les hooks retournent des données fictives pour le développement
- ✅ **Utilisateurs fictifs** : Le hook `useAuth` retourne automatiquement un utilisateur selon l'URL

### Structure actuelle

#### Hooks d'authentification

- `lib/hooks/useAuth.ts` : Retourne un utilisateur fictif selon l'URL
  - `/dashboard/admin` → Utilisateur ADMIN
  - `/dashboard/prestataire` → Utilisateur PRESTATAIRE
  - `/dashboard` → Utilisateur USER (client)

#### Routes API d'authentification

Toutes les routes `/api/auth/*` retournent des réponses de succès avec des données fictives :

- `GET /api/auth/session` : Retourne un utilisateur fictif
- `POST /api/auth/login` : Retourne une réponse de succès
- `POST /api/auth/logout` : Retourne une réponse de succès
- `POST /api/auth/signup` : Retourne une réponse de succès
- `GET /api/auth/callback` : Redirige vers le dashboard
- `POST /api/auth/webhook` : Retourne une réponse de succès

#### Données fictives

Les hooks suivants retournent des données fictives :

- `useReservations` : 3 réservations fictives avec différents statuts
- `useFavoris` : 3 favoris fictifs avec des offres variées
- `useAuth` : Utilisateur fictif selon le contexte

### Accès aux dashboards

En mode développement, vous pouvez accéder directement à :

- `/fr/dashboard` - Dashboard client (utilisateur fictif : client@example.com)
- `/fr/dashboard/prestataire` - Dashboard prestataire (utilisateur fictif : prestataire@example.com)
- `/fr/dashboard/admin` - Dashboard admin (utilisateur fictif : admin@gooteranga.com)

### Migration vers la production

Pour activer l'authentification en production :

1. Réintégrer un système d'authentification (Supabase, NextAuth, etc.)
2. Mettre à jour `lib/hooks/useAuth.ts` pour utiliser l'API réelle
3. Mettre à jour les routes `/api/auth/*` pour utiliser le système d'authentification
4. Réactiver les vérifications d'authentification dans les layouts
5. Remplacer les données fictives par des appels API réels

### Fichiers modifiés

- `lib/api/auth.ts` : Retourne des utilisateurs fictifs
- `lib/hooks/useAuth.ts` : Utilise des utilisateurs fictifs selon l'URL
- `app/api/auth/session/route.ts` : Retourne un utilisateur fictif
- `app/api/auth/login/route.ts` : Retourne une réponse de succès
- `app/api/auth/logout/route.ts` : Retourne une réponse de succès
- `app/api/auth/signup/route.ts` : Retourne une réponse de succès
- `app/api/auth/callback/route.ts` : Redirige vers le dashboard
- `app/api/auth/webhook/route.ts` : Retourne une réponse de succès
- `app/[locale]/dashboard/*/layout.tsx` : Authentification désactivée
- `lib/hooks/useReservations.ts` : Données fictives
- `lib/hooks/useFavoris.ts` : Données fictives

### Packages retirés

- `@supabase/ssr`
- `@supabase/supabase-js`

