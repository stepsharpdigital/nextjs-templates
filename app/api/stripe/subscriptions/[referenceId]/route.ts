import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ referenceId: string }> }
) {
  try {
    const { referenceId } = await params;

    const subscriptions = await auth.api.listActiveSubscriptions({
      query: { referenceId },
      headers: await headers(),
    });

    const hasActiveSubscription = subscriptions.some(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    const activeSub = subscriptions.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    const totalProjectLimit = subscriptions.reduce((total, sub) => {

      const projectLimit = sub.limits?.projects;
      if (typeof projectLimit === 'number') {
        return total + projectLimit;
      }
      return total;
    }, 0);

    return NextResponse.json({
      subscriptions,
      hasActiveSubscription,
      canCreateProject: activeSub?.limits?.projects ?? 0,
      projectLimit: totalProjectLimit, 
      subscriptionStatus: activeSub?.status ?? null,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { 
        hasActiveSubscription: false, 
        canCreateProject: 0,
        projectLimit: 0,
        subscriptionStatus: null,
        error: "Failed to check subscription" 
      },
      { status: 500 }
    );
  }
}