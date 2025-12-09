# 💳 Méthodes de Paiement - GooTeranga

## 📋 Résumé Global

### Pour les PRESTATAIRES (ils paient GooTeranga)

Les prestataires paient leurs **abonnements** et **boosts** à GooTeranga.

#### ✅ Paiement en ligne via Stripe
- 💳 **Visa**
- 💳 **Mastercard**
- 💳 **American Express (AMEX)**
- 📱 **Apple Pay**
- 📱 **Google Pay**

#### ✅ Paiement hors-ligne
- 💵 **Cash** (en espèces)

---

### Pour les TOURISTES (ils paient les prestataires)

Les touristes paient leurs **réservations** directement aux prestataires.

#### ✅ Paiement en ligne via Stripe (recommandé)
- 💳 **Visa**
- 💳 **Mastercard**
- 💳 **American Express (AMEX)**
- 📱 **Apple Pay**
- 📱 **Google Pay**

#### ✅ Paiement hors-ligne
- 💵 **Cash en arrivant** (paiement en espèces directement au prestataire)
- 📱 **Mobile Money direct** (géré directement entre touriste et prestataire, hors plateforme)

---

## 🔧 Configuration Technique

### Stripe Checkout

Stripe Checkout supporte automatiquement toutes ces méthodes de paiement :
- Les cartes bancaires (Visa, Mastercard, AMEX) sont activées par défaut
- Apple Pay et Google Pay sont automatiquement activés si configurés dans le Stripe Dashboard

### Activation Apple Pay / Google Pay

Pour activer Apple Pay et Google Pay dans Stripe :

1. Connectez-vous au [Stripe Dashboard](https://dashboard.stripe.com)
2. Allez dans **Settings** → **Payment methods**
3. Activez **Apple Pay** et **Google Pay**
4. Configurez votre domaine pour Apple Pay
5. Les méthodes seront automatiquement disponibles dans les sessions Checkout

---

## 📱 Mobile Money (Hors Plateforme)

Le Mobile Money (Orange Money, Wave, Free Money) est géré **directement** entre le touriste et le prestataire, **hors de la plateforme GooTeranga**.

Cela signifie :
- GooTeranga ne traite pas ces paiements
- Les prestataires et touristes gèrent ces transactions entre eux
- Aucune intégration API n'est nécessaire pour ces méthodes

---

## 💡 Recommandations

### Pour les Prestataires
- **Recommandé** : Utiliser Stripe (Visa, Mastercard, AMEX, Apple Pay, Google Pay) pour les abonnements et boosts
- **Alternative** : Paiement cash disponible pour tous les services

### Pour les Touristes
- **Recommandé** : Utiliser Stripe (Visa, Mastercard, AMEX, Apple Pay, Google Pay) pour les réservations
- **Alternatives** : 
  - Cash en arrivant (enregistré par le prestataire)
  - Mobile Money direct (hors plateforme)

---

## 🔒 Sécurité

Tous les paiements en ligne via Stripe sont :
- ✅ **Sécurisés** : Conformes PCI-DSS
- ✅ **Chiffrés** : Toutes les données sont chiffrées
- ✅ **Protégés** : Protection contre la fraude intégrée
- ✅ **Directs** : Les paiements vont directement aux prestataires (0% de commission)

---

**Date de création** : 2024  
**Statut** : ✅ Documenté

