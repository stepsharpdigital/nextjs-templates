import { stripe } from '@better-auth/stripe';
import { db } from '@/db/drizzle';
import { subscription as subscriptionSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserSubscription(userStripeCustomerId: string | null) {
  try {
    // First, check your database for subscription info
    if (!userStripeCustomerId) {
      return null;
    }

    // Get subscription from your database
    const userSubscription = await db.query.subscription.findFirst({
      where: eq(subscriptionSchema.stripeCustomerId, userStripeCustomerId),
    });

    // If you want to sync with Stripe, you can fetch from Stripe API
    if (userSubscription?.stripeSubscriptionId) {
      try {
        const stripeSubscription = await stripe.subscription.retrieve(
          userSubscription.stripeSubscriptionId,
          {
            expand: ['items.data.price.product'],
          }
        );

        return {
          ...userSubscription,
          stripeData: stripeSubscription,
        };
      } catch (error) {
        console.error('Error fetching from Stripe:', error);
        return userSubscription;
      }
    }

    return userSubscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export type UserSubscription = Awaited<ReturnType<typeof getUserSubscription>>;