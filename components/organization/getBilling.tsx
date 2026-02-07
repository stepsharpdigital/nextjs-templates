"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Subscription } from "@better-auth/stripe";
import { toast } from "sonner";
import { STRIPE_PLANS } from "@/lib/stripe/stripe";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Organization } from "@/db/schema";
import { getMemberCountByOrganizationSlug } from "@/server/organizations";

// Define plan prices
const PLAN_TO_PRICE = {
  starter: 28.99,
  team: 18.99,
  business: 11.99,
} as const;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface SubscriptionResponse {
  subscriptions: Subscription[];
  hasActiveSubscription: boolean;
  canCreateProject: number;
  projectLimit: number;
  subscriptionStatus: string | null;
}

interface OrganizationBillingProps {
  organization: Organization;
}

export default function OrganizationBilling({
  organization,
}: OrganizationBillingProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [createSubscriptionLoading, setCreateSubscriptionLoading] = useState<
    string | null
  >(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [seatCount, setSeatCount] = useState<number>(0);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const totalMembers = await getMemberCountByOrganizationSlug(
          organization.slug,
        );
        setMemberCount(totalMembers);

        // Use organization ID as reference for billing
        const referenceId = organization.id;
        const response = await fetch(
          `/api/stripe/subscriptions/${referenceId}`,
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }

        const data: SubscriptionResponse = await response.json();
        setSubscriptions(data.subscriptions || []);

        const activeSub =
          data.subscriptions?.find(
            (sub) => sub.status === "active" || sub.status === "trialing",
          ) || null;

        setActiveSubscription(activeSub);
      } catch (error) {
        console.error("Error checking subscription:", error);
        toast.error("Failed to fetch subscription");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [organization.id, memberCount, organization.slug]);

  const handleBillingPortal = async () => {
    setBillingLoading(true);
    try {
      const response = await fetch("/api/stripe/billing-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referenceId: organization.id,
          returnUrl: `${window.location.origin}/org/${organization.slug}/billing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create billing portal session",
        );
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("No billing portal URL returned");
      }
    } catch (err: unknown) {
      console.error("Billing portal error:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setBillingLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelLoading(true);

      const subscriptionId =
        activeSubscription?.stripeSubscriptionId || activeSubscription?.id;

      if (!subscriptionId) {
        toast.error("No subscription ID found");
        return;
      }

      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId,
          referenceId: organization.id,
          returnUrl: `${window.location.origin}/org/${organization.slug}/billing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.success("Subscription cancellation initiated");
        window.location.reload();
      }
    } catch (err: unknown) {
      console.error("Cancel subscription error:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCreateSubscription = async (plan: string) => {
    try {
      setCreateSubscriptionLoading(plan);

      const subscriptionId =
        activeSubscription?.stripeSubscriptionId || activeSubscription?.id;

        if(plan === "starter"){
           setSeatCount(1);
        }
        else{
            setSeatCount(memberCount);
        }


      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: plan,
          referenceId: organization.id,
          seats: seatCount,
          subscriptionId: subscriptionId,
          successUrl: `${window.location.origin}/org/${organization.slug}/billing?success=true`,
          cancelUrl: `${window.location.origin}/org/${organization.slug}/billing?canceled=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("No checkout URL returned");
      }
    } catch (err: unknown) {
      console.error("Create subscription error:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setCreateSubscriptionLoading(null);
    }
  };

  const activePlan = activeSubscription
    ? STRIPE_PLANS.find((plan) => plan.name === activeSubscription.plan)
    : null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/org`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {organization.name} - Billing
            </h1>
            <p className="text-muted-foreground">
              Manage subscription and billing for {organization.name}
            </p>
          </div>
        </div>
      </div>

      {activeSubscription && activePlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold capitalize">
                    {activeSubscription.plan} Plan
                  </h3>
                  {activeSubscription.priceId && (
                    <Badge variant="secondary">
                      {currencyFormatter.format(
                        PLAN_TO_PRICE[
                          activeSubscription.plan as keyof typeof PLAN_TO_PRICE
                        ] || 0,
                      )}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activePlan.limits.projects} projects included
                </p>
                {activeSubscription.periodEnd && (
                  <p className="text-sm text-muted-foreground">
                    {activeSubscription.cancelAtPeriodEnd
                      ? `Cancels on ${new Date(activeSubscription.periodEnd).toLocaleDateString()}`
                      : `Renews on ${new Date(activeSubscription.periodEnd).toLocaleDateString()}`}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center">
                {billingLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleBillingPortal}
                    disabled={billingLoading}
                  >
                    {billingLoading && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Billing Portal
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              {organization.name} doesn&apos;t have an active subscription.
              Choose a plan below.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {STRIPE_PLANS.map((plan) => (
          <Card key={plan.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl capitalize">
                  {plan.name}
                </CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {currencyFormatter.format(
                      PLAN_TO_PRICE[plan.name as keyof typeof PLAN_TO_PRICE] ||
                        0,
                    )}
                    {plan.name !== "starter" && (
                      <span className="text-sm font-normal text-gray-500">
                        /member
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <CardDescription>
                Up to {plan.limits.projects} projects
              </CardDescription>
              {plan.limits.members === Infinity ? (
                <CardDescription> No limit on members </CardDescription>
              ) : (
                <CardDescription>
                  {" "}
                  Up to {plan.limits.members} members{" "}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {activeSubscription?.plan === plan.name ? (
                activeSubscription.cancelAtPeriodEnd ? (
                  <div className="space-y-2">
                    <Button disabled variant="outline" className="w-full">
                      {activeSubscription.periodEnd
                        ? `Cancelling on ${new Date(activeSubscription.periodEnd).toLocaleDateString()}`
                        : "Cancelling"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={() =>
                        toast.info("Reactivate feature coming soon")
                      }
                    >
                      Reactivate
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    className="w-full cursor-pointer"
                    onClick={handleCancelSubscription}
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Cancel Subscription"
                    )}
                  </Button>
                )
              ) : (
                <Button
                  className="w-full cursor-pointer"
                  onClick={() => handleCreateSubscription(plan.name)}
                  disabled={createSubscriptionLoading !== null}
                >
                  {createSubscriptionLoading === plan.name ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {activeSubscription == null
                        ? "Subscribing..."
                        : "Changing Plan..."}
                    </>
                  ) : activeSubscription == null ? (
                    "Subscribe"
                  ) : (
                    "Change Plan"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
