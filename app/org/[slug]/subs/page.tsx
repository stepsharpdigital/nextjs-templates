import { getOrganizationsBySlug } from "@/server/organizations";
import SubscriberPageContent from "@/components/organization/subscriber-page";
import { getOrganizationSubscriptionDetails } from "@/lib/stripe/update-seats";
import { redirect } from "next/navigation";

type Params = Promise<{ slug: string }>

export default async function SubscriberPage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params;
  
  // Get organization
  const organization = await getOrganizationsBySlug(slug);
  
  if (!organization) {
    redirect(`/org`);
  }
  
  // Check if organization has an active subscription
  const subscriptionDetails = await getOrganizationSubscriptionDetails(organization.id);
  
  const hasActiveSubscription = !!(
    subscriptionDetails.activeSubscription || 
    subscriptionDetails.trialingSubscription
  );
  
  // If no active subscription, redirect to organization page
  if (!hasActiveSubscription) {
    redirect(`/org`);
  }
  
  return <SubscriberPageContent organization={organization} />;
}