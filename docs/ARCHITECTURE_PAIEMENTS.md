# 💳 Architecture des Paiements - GooTeranga

## Vue d'ensemble

GooTeranga utilise **Stripe** pour gérer tous les paiements :
- **Stripe Connect Standard** : Paiements directs des touristes aux prestataires
- **Stripe Billing** : Abonnements et boosts des prestataires
- **Paiement cash** : Option disponible pour tous les types de paiements

**Important** : GooTeranga ne touche jamais l'argent et n'est pas responsable des transactions. Les paiements vont directement aux prestataires.

---

## 💳 Méthodes de Paiement Supportées

### Pour les PRESTATAIRES (ils paient GooTeranga)

Les prestataires paient leurs **abonnements** et **boosts** via Stripe avec les méthodes suivantes :

✅ **Paiement en ligne via Stripe** :
- 💳 Visa
- 💳 Mastercard
- 💳 American Express (AMEX)
- 📱 Apple Pay
- 📱 Google Pay

✅ **Paiement hors-ligne** :
- 💵 Cash (en espèces)

### Pour les TOURISTES (ils paient les prestataires)

Les touristes paient leurs **réservations** directement aux prestataires :

✅ **Paiement en ligne via Stripe (recommandé)** :
- 💳 Visa
- 💳 Mastercard
- 💳 American Express (AMEX)
- 📱 Apple Pay
- 📱 Google Pay

✅ **Paiement hors-ligne** :
- 💵 Cash en arrivant
- 📱 Mobile Money direct (hors plateforme - géré directement entre touriste et prestataire)

---

## 🏗️ Architecture

### 1. Paiements des Réservations (Touristes → Prestataires)

#### Paiement en ligne via Stripe Connect (Recommandé)
- Les touristes paient directement les prestataires via Stripe Connect
- **Méthodes supportées** : Visa, Mastercard, AMEX, Apple Pay, Google Pay
- L'argent va directement au compte Stripe du prestataire
- GooTeranga ne prend aucune commission (application_fee_amount = 0)
- Route : `POST /api/paiements/stripe/create-intent`

#### Paiement hors-ligne
- **Cash en arrivant** : Les touristes paient en espèces directement au prestataire
  - Le prestataire enregistre le paiement avec un `transactionId`
  - Route : `POST /api/paiements/cash`
- **Mobile Money direct** : Géré directement entre touriste et prestataire (hors plateforme)

### 2. Abonnements des Prestataires

#### Paiement en ligne via Stripe Billing
- Les prestataires paient leurs abonnements (PRO, PREMIUM) via Stripe Billing
- **Méthodes supportées** : Visa, Mastercard, AMEX, Apple Pay, Google Pay
- Abonnements récurrents mensuels
- Route : `POST /api/abonnements` (avec `methode: 'stripe'`)
- Retourne une URL de checkout Stripe

#### Paiement Cash
- Les prestataires peuvent payer leurs abonnements en espèces
- Route : `POST /api/abonnements` (avec `methode: 'cash'` et `transactionId`)
- Pas de renouvellement automatique pour le cash

### 3. Boosts des Prestataires

#### Paiement en ligne via Stripe Billing
- Les prestataires paient leurs boosts via Stripe Checkout
- **Méthodes supportées** : Visa, Mastercard, AMEX, Apple Pay, Google Pay
- Paiements ponctuels (pas d'abonnement)
- Route : `POST /api/boosts` (avec `methode: 'stripe'`)
- Retourne une URL de checkout Stripe

#### Paiement Cash
- Les prestataires peuvent payer leurs boosts en espèces
- Route : `POST /api/boosts` (avec `methode: 'cash'` et `transactionId`)

---

## 🔧 Configuration Stripe Connect

### Onboarding des Prestataires

Les prestataires doivent créer un compte Stripe Connect avant de recevoir des paiements :

1. **Créer le compte Stripe Connect**
   - Route : `POST /api/stripe-connect/onboarding`
   - Crée un compte Stripe Connect Standard
   - Retourne une URL d'onboarding

2. **Vérifier le statut**
   - Route : `GET /api/stripe-connect/onboarding`
   - Route : `PATCH /api/stripe-connect/onboarding`

### Champs Prisma

Le modèle `Prestataire` inclut :
- `stripeAccountId` : ID du compte Stripe Connect
- `stripeOnboardingCompleted` : Indique si l'onboarding est terminé

---

## 📡 Webhooks Stripe

Le webhook gère les événements suivants :

### Paiements de Réservations
- `payment_intent.succeeded` : Met à jour le paiement et la réservation
- `payment_intent.payment_failed` : Marque le paiement comme échoué

### Abonnements
- `checkout.session.completed` (mode: subscription) : Crée l'abonnement
- `customer.subscription.updated` : Met à jour les dates d'expiration
- `customer.subscription.deleted` : Annule l'abonnement

### Boosts
- `checkout.session.completed` (mode: payment) : Crée le boost

Route : `POST /api/paiements/stripe/webhook`

---

## 🔐 Variables d'Environnement

```env
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

---

## 📋 Flux de Paiement

### Réservation (Stripe Connect)

1. Touriste crée une réservation
2. Touriste appelle `POST /api/paiements/stripe/create-intent`
3. Système vérifie que le prestataire a un compte Stripe Connect configuré
4. Système crée un PaymentIntent avec `transfer_data` vers le compte du prestataire
5. Touriste paie via Stripe Checkout
6. Webhook `payment_intent.succeeded` met à jour le paiement et la réservation
7. L'argent va directement au compte Stripe du prestataire

### Abonnement (Stripe Billing)

1. Prestataire appelle `POST /api/abonnements` avec `methode: 'stripe'`
2. Système crée un produit et un prix Stripe
3. Système crée une session Checkout en mode `subscription`
4. Prestataire est redirigé vers Stripe Checkout
5. Après paiement, webhook `checkout.session.completed` crée l'abonnement
6. Webhook `customer.subscription.updated` gère les renouvellements

### Boost (Stripe Billing)

1. Prestataire appelle `POST /api/boosts` avec `methode: 'stripe'`
2. Système crée une session Checkout en mode `payment`
3. Prestataire est redirigé vers Stripe Checkout
4. Après paiement, webhook `checkout.session.completed` crée le boost

---

## 💰 Modèle Économique

- **0% de commission** sur les réservations
- **100% des paiements** vont directement aux prestataires
- **Revenus GooTeranga** : Uniquement via abonnements et boosts
- **Paiements directs** : Les touristes paient directement les prestataires

---

## ✅ Points Importants

1. **Stripe Connect Standard** : Les prestataires doivent compléter l'onboarding avant de recevoir des paiements
2. **Paiement cash** : Toujours disponible comme alternative
3. **Webhooks** : Essentiels pour synchroniser les paiements Stripe avec la base de données
4. **Aucune commission** : GooTeranga ne prend pas de commission sur les réservations
5. **MongoDB + Prisma** : Toutes les données sont stockées via Prisma (PostgreSQL actuellement)

---

## 🚀 Prochaines Étapes

1. Tester l'intégration Stripe Connect en mode test
2. Configurer les webhooks dans le dashboard Stripe
3. Implémenter l'interface utilisateur pour l'onboarding Stripe Connect
4. Ajouter la gestion des erreurs et des cas limites
5. Documenter les processus de retrait pour les prestataires

---

## 📚 Documentation Complémentaire

- [Méthodes de Paiement Supportées](./METHODES_PAIEMENT.md) : Détails sur toutes les méthodes de paiement disponibles
- [CGU Paiements & Responsabilités](./CGU_PAIEMENTS_RESPONSABILITES.md) : Version juridique complète des conditions de paiement et responsabilités

---

**Date de création** : 2024  
**Statut** : ✅ Implémenté

