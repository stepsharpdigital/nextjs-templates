import { db } from "@/db/drizzle";
import { eq, count } from "drizzle-orm"; 
import { subscription, member } from "@/db/schema";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export interface UpdateSeatsResult {
  success: boolean;
  message: string;
  memberCount?: number;
  updatedSeats?: number;
  subscriptionId?: string;
  stripeSubscriptionId?: string;
}

interface StripeError extends Error {
  code?: string;
  type?: string;
  param?: string;
  message: string;
}

export async function updateOrganizationSeats(
  organizationId: string
): Promise<UpdateSeatsResult> {
  try {
    console.log(`Starting seat update for organization: ${organizationId}`);

    // Get current member count
    const memberCountResult = await db
      .select({ count: count(member.id) })
      .from(member)
      .where(eq(member.organizationId, organizationId));

    const memberCount = memberCountResult[0]?.count || 0;
    console.log(`Current member count: ${memberCount}`);

    // Get aLL subscriptions for this organization, sorted by status
    const subscriptions = await db
      .select()
      .from(subscription)
      .where(eq(subscription.referenceId, organizationId))
      .orderBy(subscription.status); 

    console.log(`Found ${subscriptions.length} subscriptions for organization`);

    const activeSub = subscriptions.find(sub => sub.status === "active");
    const trialingSub = subscriptions.find(sub => sub.status === "trialing");
    
    const targetSubscription = activeSub || trialingSub;
    
    if (!targetSubscription) {
      console.log("No active or trialing subscription found");
      
      // Check if there are any other subscriptions that might need updating
      const otherSubs = subscriptions.filter(sub => 
        sub.status !== "canceled" && sub.status !== "ended"
      );
      
      if (otherSubs.length > 0) {
        console.log(`Found other subscriptions: ${otherSubs.map(s => s.status).join(', ')}`);
      }
      
      return {
        success: false,
        message: "No active or trialing subscription found",
        memberCount
      };
    }

    console.log(`Using subscription: ${targetSubscription.id} (${targetSubscription.status})`);

    // Checking if we need to update at all
    if (targetSubscription.seats === memberCount) {
      console.log(`Seats already set to ${memberCount}, no update needed`);
      return {
        success: true,
        message: `Seats already set to ${memberCount}`,
        memberCount,
        updatedSeats: memberCount,
        subscriptionId: targetSubscription.id,
        stripeSubscriptionId: targetSubscription.stripeSubscriptionId || undefined
      };
    }

    // Update Stripe if we have a stripeSubscriptionId
    if (targetSubscription.stripeSubscriptionId) {
      try {
        console.log(`Updating Stripe subscription: ${targetSubscription.stripeSubscriptionId}`);
        
        const stripeSubscription = await stripe.subscriptions.retrieve(
          targetSubscription.stripeSubscriptionId
        );

        // Get the first subscription item
        const subscriptionItem = stripeSubscription.items.data[0];
        
        if (!subscriptionItem) {
          console.error("No subscription items found in Stripe");
          return {
            success: false,
            message: "No subscription items found in Stripe",
            memberCount,
            subscriptionId: targetSubscription.id,
            stripeSubscriptionId: targetSubscription.stripeSubscriptionId
          };
        }

        // Check current quantity in Stripe
        const currentStripeQuantity = subscriptionItem.quantity || 1;
        
        if (currentStripeQuantity !== memberCount) {
          console.log(`Updating Stripe quantity from ${currentStripeQuantity} to ${memberCount}`);
          
          await stripe.subscriptionItems.update(subscriptionItem.id, {
            quantity: memberCount,
          });

          console.log("Stripe subscription updated successfully");
        } else {
          console.log(`Stripe already has ${memberCount} seats, no update needed`);
        }
        
      } catch (stripeError) {
        console.error("Stripe API error:", stripeError);
        
        // Type guard to check if error has a code property
        const isStripeError = (error: unknown): error is StripeError => {
          return error instanceof Error && 'code' in error;
        };
        
        // Handle specific Stripe errors
        if (isStripeError(stripeError) && stripeError.code === "resource_missing") {
          console.error("Stripe subscription not found - might be deleted in Stripe");
          // Mark subscription as canceled in our DB
          await db
            .update(subscription)
            .set({ 
              status: "canceled",
              seats: memberCount 
            })
            .where(eq(subscription.id, targetSubscription.id));
          
          return {
            success: false,
            message: "Stripe subscription not found - marked as canceled",
            memberCount,
            subscriptionId: targetSubscription.id
          };
        }
        
        // For other Stripe errors, we'll still update our DB but return a warning
        const errorMessage = stripeError instanceof Error 
          ? stripeError.message 
          : "Unknown Stripe error";
        
        return {
          success: false,
          message: `Stripe error: ${errorMessage}`,
          memberCount,
          subscriptionId: targetSubscription.id,
          stripeSubscriptionId: targetSubscription.stripeSubscriptionId
        };
      }
    } else {
      console.log("No stripeSubscriptionId found - updating only local database");
    }

    // Update our database regardless of Stripe status
    console.log(`Updating database subscription seats to ${memberCount}`);
    
    await db
      .update(subscription)
      .set({ 
        seats: memberCount,
        // If we couldn't update Stripe but have seats, mark as needs_sync?
        // This depends on your business logic
      })
      .where(eq(subscription.id, targetSubscription.id));

    console.log(`Successfully updated seats for organization ${organizationId}`);
    
    return {
      success: true,
      message: `Updated subscription to ${memberCount} seats`,
      memberCount,
      updatedSeats: memberCount,
      subscriptionId: targetSubscription.id,
      stripeSubscriptionId: targetSubscription.stripeSubscriptionId || undefined
    };

  } catch (error) {
    console.error("Unexpected error updating organization seats:", error);
    
    // Try to get basic info even if update failed
    let memberCount = 0;
    try {
      const memberCountResult = await db
        .select({ count: count(member.id) })
        .from(member)
        .where(eq(member.organizationId, organizationId));
      memberCount = memberCountResult[0]?.count || 0;
    } catch (countError) {
      console.error("Could not get member count after error:", countError);
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unexpected error updating seats";
    
    return {
      success: false,
      message: errorMessage,
      memberCount
    };
  }
}


export async function getOrganizationSubscriptionDetails(organizationId: string) {
  try {
    const subscriptions = await db
      .select()
      .from(subscription)
      .where(eq(subscription.referenceId, organizationId))
      .orderBy(subscription.status);

    const memberCountResult = await db
      .select({ count: count(member.id) })
      .from(member)
      .where(eq(member.organizationId, organizationId));

    const memberCount = memberCountResult[0]?.count || 0;

    return {
      subscriptions,
      memberCount,
      activeSubscription: subscriptions.find(sub => sub.status === "active"),
      trialingSubscription: subscriptions.find(sub => sub.status === "trialing")
    };
  } catch (error) {
    console.error("Error getting subscription details:", error);
    throw error;
  }
}

export async function checkSeatUpdateNeeded(organizationId: string): Promise<boolean> {
  try {
    const details = await getOrganizationSubscriptionDetails(organizationId);
    
    const activeSub = details.activeSubscription || details.trialingSubscription;
    
    if (!activeSub) {
      return false; // No active subscription to update
    }

    return activeSub.seats !== details.memberCount;
  } catch (error) {
    console.error("Error checking seat update needed:", error);
    return false;
  }
}