import { Subscription } from "@better-auth/stripe";

interface SubscriptionResponse {
  success: boolean;
  subscriptions: Subscription[];
  hasActiveSubscription: boolean;
  canCreateProject: number;
  projectLimit: number;
  subscriptionStatus: string | null;
  activeSubscription?: Subscription;
}

export async function getOrganizationSubscriptionDetailsClient(organizationId: string): Promise<SubscriptionResponse> {
  try {
    console.log(`Fetching subscription details for organization: ${organizationId}`);
    const response = await fetch(`/api/stripe/subscriptions/${organizationId}`, {
      cache: 'no-store', 
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`Failed to fetch subscription: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch subscription: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log("Subscription response data:", responseData);
    
    if (!responseData.hasActiveSubscription) {
      console.log("API returned no active subscription:", responseData);
    }
    
    return {
      success: true,
      subscriptions: responseData.subscriptions || [],
      hasActiveSubscription: responseData.hasActiveSubscription || false,
      canCreateProject: responseData.canCreateProject || 0,
      projectLimit: responseData.projectLimit || 0,
      subscriptionStatus: responseData.subscriptionStatus || null,
      activeSubscription: responseData.activeSubscription,
    };

  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return {
      success: false,
      subscriptions: [],
      hasActiveSubscription: false,
      canCreateProject: 0,
      projectLimit: 0,
      subscriptionStatus: null,
    };
  }
}