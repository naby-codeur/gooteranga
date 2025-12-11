# Seed des Prestataires avec Parrainage

Ce script permet de générer des données fictives de prestataires avec des relations de parrainage pour tester le système.

## Données générées

Le script crée :
- **10 prestataires** avec différents types (Hôtel, Restaurant, Guide, Agence, etc.)
- **9 relations de parrainage** entre les prestataires
- **Événements de parrainage** : inscriptions, premières offres, réservations, abonnements premium
- **Points et boosts** calculés automatiquement

## Structure des parrainages

### Parrains principaux

1. **Hôtel Teranga Excellence** (Parrain)
   - Parraine Safari Nature Sénégal (300 points)
   - Parraine Restaurant Le Baobab (950 points)
   - Parraine Guide Touristique Dakar (150 points)

2. **Safari Nature Sénégal** (Parrain)
   - Parraine Plage Paradise Resort (300 points)
   - Parraine Auberge Casamance (100 points)

3. **Restaurant Le Baobab** (Parrain)
   - Parraine Transport Teranga (300 points)
   - Parraine Artisanat Sénégalais (150 points)

4. **Guide Touristique Dakar** (Parrain)
   - Parraine Association Tourisme Durable (300 points)

5. **Plage Paradise Resort** (Parrain)
   - Parraine Hôtel Sine Saloum (800 points)

## Points gagnés par événement

- **INSCRIPTION_VALIDEE** : 100 points
- **PREMIERE_OFFRE_PUBLIEE** : 50 points
- **RESERVATION_EFFECTUEE** : 150 points
- **ABONNEMENT_PREMIUM** : 500 points

## Conversion points → boosts

- **100 points = 1 boost**
- Les points restants (< 100) ne sont pas convertis

## Utilisation

### Option 1 : Avec npm script (recommandé)

```bash
npm run seed:prestataires
```

### Option 2 : Avec tsx directement

```bash
npx tsx scripts/seed-prestataires-parrainage.ts
```

### Option 3 : Avec ts-node

```bash
npx ts-node scripts/seed-prestataires-parrainage.ts
```

## Prérequis

- Base de données PostgreSQL configurée
- Variables d'environnement configurées (DATABASE_URL)
- Prisma migrations appliquées

## Comportement du script

- **Idempotent** : Le script vérifie l'existence des données avant de créer
- **Sûr** : Ne supprime pas les données existantes
- **Informatif** : Affiche un résumé détaillé à la fin

## Exemple de sortie

```
🌱 Début du seed des prestataires avec parrainage...

✅ Utilisateur créé: Diallo Amadou
✅ Prestataire créé: Hôtel Teranga Excellence (Code: GT-ABCD1234)
...

📊 Création des relations de parrainage...

✅ Parrainage créé: Hôtel Teranga Excellence → Safari Nature Sénégal
   📈 Points gagnés: 300 (3 événements)
...

📊 Résumé du seed:

   • Prestataires: 10
   • Parrainages: 9
   • Événements: 25
   • Points totaux: 3400
   • Boosts disponibles: 34

✅ Seed terminé avec succès!
```

## Notes importantes

- Les emails utilisés sont fictifs (format `@example.com`)
- Les codes parrain sont générés automatiquement (format `GT-XXXX1234`)
- Les dates des événements sont réparties sur les 3 derniers mois
- Les prestataires sont créés avec des ratings aléatoires entre 3 et 5

## Vérification des données

Après l'exécution, vous pouvez vérifier les données dans votre base de données :

```sql
-- Voir tous les prestataires avec leurs points
SELECT nomEntreprise, codeParrain, points, boostsDisponibles 
FROM "Prestataire" 
ORDER BY points DESC;

-- Voir les parrainages
SELECT 
  p1.nomEntreprise as parrain,
  p2.nomEntreprise as filleul,
  r.pointsGagnes,
  r.statut
FROM "Referral" r
JOIN "Prestataire" p1 ON r.parrainId = p1.id
JOIN "Prestataire" p2 ON r.filleulId = p2.id;

-- Voir les événements de parrainage
SELECT 
  re.type,
  re.points,
  p.nomEntreprise as filleul
FROM "ReferralEvent" re
JOIN "Referral" r ON re.referralId = r.id
JOIN "Prestataire" p ON r.filleulId = p.id
ORDER BY re.createdAt DESC;
```

