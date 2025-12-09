import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api/response'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * POST /api/paiements/stripe/webhook
 * Webhook Stripe pour gérer les événements de paiement
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return errorResponse('Signature manquante', 400)
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return errorResponse('Signature invalide', 400)
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      // Paiements de réservations (Stripe Connect)
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const reservationId = paymentIntent.metadata.reservationId

        if (reservationId) {
          // Mettre à jour le paiement
          await (prisma.paiement as { update: (args: unknown) => Promise<unknown> }).update({
            where: { reservationId },
            data: {
              statut: 'PAID',
              transactionId: paymentIntent.id,
            },
          })

          // Mettre à jour la réservation
          await (prisma.reservation as { update: (args: unknown) => Promise<unknown> }).update({
            where: { id: reservationId },
            data: { statut: 'CONFIRMED' },
          })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const reservationId = paymentIntent.metadata.reservationId

        if (reservationId) {
          await (prisma.paiement as { update: (args: unknown) => Promise<unknown> }).update({
            where: { reservationId },
            data: {
              statut: 'FAILED',
            },
          })
        }
        break
      }

      // Abonnements Stripe Billing
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Si c'est un abonnement (subscription)
        if (session.mode === 'subscription' && session.subscription) {
          const prestataireId = session.metadata?.prestataireId
          const planType = session.metadata?.planType

          if (prestataireId && planType) {
            // Récupérer l'abonnement Stripe pour obtenir les détails
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

            const dateDebut = new Date(subscription.current_period_start * 1000)
            const dateFin = new Date(subscription.current_period_end * 1000)

            // Créer l'abonnement dans la base de données
            const abonnement = await prisma.abonnement.create({
              data: {
                prestataireId,
                planType: planType as 'PRO' | 'PREMIUM',
                montant: subscription.items.data[0]?.price.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0,
                dateDebut,
                dateFin,
                statut: 'ACTIVE',
                methode: 'stripe',
                stripeSubscriptionId: subscription.id,
                autoRenouvellement: true,
              },
            })

            // Mettre à jour le prestataire
            await prisma.prestataire.update({
              where: { id: prestataireId },
              data: {
                planType: planType as 'PRO' | 'PREMIUM',
                planExpiresAt: dateFin,
              },
            })
          }
        }

        // Si c'est un paiement ponctuel (boost)
        if (session.mode === 'payment') {
          const prestataireId = session.metadata?.prestataireId
          const type = session.metadata?.type
          const duree = session.metadata?.duree
          const offreId = session.metadata?.offreId
          const region = session.metadata?.region
          const categorie = session.metadata?.categorie
          const dateDebut = session.metadata?.dateDebut
          const dateFin = session.metadata?.dateFin

          if (prestataireId && type && duree && dateDebut && dateFin) {
            // Créer le boost dans la base de données
            const boost = await prisma.boost.create({
              data: {
                prestataireId,
                offreId: offreId && offreId !== '' ? offreId : null,
                type: type as 'EXPERIENCE' | 'REGIONAL' | 'CATEGORIE' | 'MENSUEL',
                region: region && region !== '' ? region : null,
                categorie: categorie && categorie !== '' ? categorie : null,
                montant: session.amount_total ? session.amount_total / 100 : 0,
                dateDebut: new Date(dateDebut),
                dateFin: new Date(dateFin),
                isActive: true,
                methode: 'stripe',
                transactionId: session.payment_intent as string,
              },
            })

            // Si c'est un boost d'expérience, marquer l'offre comme featured
            if (type === 'EXPERIENCE' && offreId && offreId !== '') {
              await prisma.offre.update({
                where: { id: offreId },
                data: {
                  isFeatured: true,
                  featuredExpiresAt: new Date(dateFin),
                },
              })
            }
          }
        }
        break
      }

      // Gestion des renouvellements d'abonnement
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const prestataireId = subscription.metadata?.prestataireId

        if (prestataireId && subscription.status === 'active') {
          const dateFin = new Date(subscription.current_period_end * 1000)

          // Mettre à jour l'abonnement
          await prisma.abonnement.updateMany({
            where: {
              prestataireId,
              stripeSubscriptionId: subscription.id,
            },
            data: {
              dateFin,
              statut: 'ACTIVE',
            },
          })

          // Mettre à jour le prestataire
          await prisma.prestataire.update({
            where: { id: prestataireId },
            data: {
              planExpiresAt: dateFin,
            },
          })
        }
        break
      }

      // Annulation d'abonnement
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const prestataireId = subscription.metadata?.prestataireId

        if (prestataireId) {
          // Marquer l'abonnement comme annulé
          await prisma.abonnement.updateMany({
            where: {
              prestataireId,
              stripeSubscriptionId: subscription.id,
            },
            data: {
              statut: 'CANCELLED',
              autoRenouvellement: false,
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return successResponse({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return errorResponse('Erreur lors du traitement du webhook', 500)
  }
}

