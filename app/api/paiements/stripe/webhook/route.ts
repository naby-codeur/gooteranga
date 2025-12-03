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

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return successResponse({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return errorResponse('Erreur lors du traitement du webhook', 500)
  }
}

