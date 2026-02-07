import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { member } from "@/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ referenceId: string }> },
) {
  try {
    const { referenceId } = await params;

    const sessionHeaders = await headers();
    const session = await auth.api.getSession({ headers: sessionHeaders });

    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false,
          message: "Please sign in to access billing" 
        },
        { status: 401 },
      );
    }

    const memberItem = await db.query.member.findFirst({
      where: and(
        eq(member.organizationId, referenceId),
        eq(member.userId, session.user.id),
      ),
    });

    if (!memberItem) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not a member of this organization",
          hasActiveSubscription: false,
          canCreateProject: 0,
          projectLimit: 0,
          subscriptionStatus: null,
        },
        { status: 403 },
      );
    }

    const subscriptions = await auth.api.listActiveSubscriptions({
      query: {
        referenceId,
        customerType: "organization",
      },
      headers: sessionHeaders,
    });

    const hasActiveSubscription = subscriptions.some(
      (sub) => sub.status === "active" || sub.status === "trialing",
    );

    const activeSub = subscriptions.find(
      (sub) => sub.status === "active" || sub.status === "trialing",
    );

    const totalProjectLimit = subscriptions.reduce((total, sub) => {
      const projectLimit = sub.limits?.projects;
      if (typeof projectLimit === "number") {
        return total + projectLimit;
      }
      return total;
    }, 0);

    return NextResponse.json({
      success: true,
      subscriptions,
      hasActiveSubscription,
      canCreateProject: activeSub?.limits?.projects ?? 0,
      projectLimit: totalProjectLimit,
      subscriptionStatus: activeSub?.status ?? null,
      activeSubscription: activeSub,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        hasActiveSubscription: false,
        canCreateProject: 0,
        projectLimit: 0,
        subscriptionStatus: null,
        error: "Failed to check subscription",
      },
      { status: 500 },
    );
  }
}