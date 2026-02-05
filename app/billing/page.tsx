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
import { PLAN_TO_PRICE, STRIPE_PLANS } from "@/lib/stripe/stripe";
import { getCurrentUser } from "@/server/users";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
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

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [createSubscriptionLoading, setCreateSubscriptionLoading] = useState<
    string | null
  >(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { user } = await getCurrentUser();
        if (!user) {
          toast.error("No user found");
          setLoading(false);
          return;
        }

        setUserId(user.id);
        const referenceId = user.id;
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
  }, []);

  const handleBillingPortal = async () => {
    setBillingLoading(true);
    try {
      if (!userId) {
        toast.error("User not found. Please refresh and try again.");
        return;
      }

      const response = await fetch("/api/stripe/billing-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/billing`,
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

      if (!userId) {
        toast.error("User not found");
        return;
      }

      // Check if already scheduled to cancel
      if (activeSubscription?.cancelAtPeriodEnd) {
        toast.info("Subscription is already scheduled to cancel at period end");
        return;
      }

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
          subscriptionId: subscriptionId, // Stripe subscription ID
          referenceId: userId,
          returnUrl: `${window.location.origin}/billing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      if (data.url) {
        // console.log("Redirecting to Stripe Billing Portal:", data.url);
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

      if (!userId) {
        toast.error("User not found");
        return;
      }

      const subscriptionId =
        activeSubscription?.stripeSubscriptionId || activeSubscription?.id;

      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: plan,
          referenceId: userId,
          subscriptionId: subscriptionId,
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/billing?canceled=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }

      if (data.checkoutUrl) {
        // console.log("Redirecting to Stripe checkout:", data.checkoutUrl);
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
    <div className="space-y-6 mx-auto max-w-3xl mt-10">
      <Navbar/>
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
                        ],
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
                    className="flex items-center gap-2"
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
              You don&apos;t have an active subscription. Choose a plan below.
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
                      PLAN_TO_PRICE[plan.name as keyof typeof PLAN_TO_PRICE],
                    )}
                  </div>
                </div>
              </div>
              <CardDescription>
                Up to {plan.limits.projects} projects
              </CardDescription>
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
                      className="w-full"
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
                    className="w-full"
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
                  className="w-full"
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
