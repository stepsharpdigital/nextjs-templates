import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { member, subscription } from "@/db/schema";

// Type definition for better-auth/Stripe errors
interface ApiError {
  status?: string;
  statusCode?: number;
  message?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

// Type guard to check if error is an ApiError
function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    ('status' in error || 'statusCode' in error || 'message' in error)
  );
}

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return "Unknown error occurred";
}

export async function POST(request: NextRequest) {
  try {
    // Get session
    const sessionHeaders = await headers();
    const session = await auth.api.getSession({ headers: sessionHeaders });

    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false,
          message: "Please sign in to access billing" 
        },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json().catch(() => ({}));
    const { referenceId, returnUrl } = body;
      
    if (!referenceId) {
      return NextResponse.json(
        { 
          success: false,
          message: "Organization ID is required" 
        },
        { status: 400 }
      );
    }

    // Check if user is a member of the organization
    const memberItem = await db.query.member.findFirst({
      where: and(
        eq(member.organizationId, referenceId),
        eq(member.userId, session.user.id)
      ),
    });

    if (!memberItem) {
      return NextResponse.json(
        { 
          success: false,
          message: "You are not a member of this organization" 
        },
        { status: 403 }
      );
    }

    // Check if user is owner (only owners can access billing portal)
    if (memberItem.role !== "owner") {
      return NextResponse.json(
        { 
          success: false,
          message: "You are not authorized to access billing for this organization. Only organization owners can manage billing." 
        },
        { status: 403 }
      );
    }

    // Check if organization has a Stripe customer/subscription
    const activeSubscriptions = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.referenceId, referenceId),
          eq(subscription.status, "active")
        )
      );

    const trialingSubscriptions = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.referenceId, referenceId),
          eq(subscription.status, "trialing")
        )
      );

    const allSubscriptions = [...activeSubscriptions, ...trialingSubscriptions];
    const activeSubscription = allSubscriptions[0];

    if (!activeSubscription || !activeSubscription.stripeCustomerId) {
      return NextResponse.json(
        { 
          success: false,
          message: "No Stripe customer found for this organization" 
        },
        { status: 404 }
      );
    }

    // Create billing portal session for the ORGANIZATION
    const result = await auth.api.createBillingPortal({
      body: {
        returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/org/${referenceId}/billing`,
        referenceId: referenceId,
        customerType: "organization", 
        disableRedirect: true,
      },
      headers: sessionHeaders,
    });

    if (!result.url) {
      return NextResponse.json(
        { 
          success: false,
          message: "Failed to create billing portal session" 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });

  } catch (err: unknown) {
    console.error("Billing portal error:", err);
    
    // Handle specific better-auth/Stripe errors
    if (isApiError(err)) {
      if (err.status === "NOT_FOUND" || err.statusCode === 404) {
        return NextResponse.json(
          { 
            success: false,
            message: "Stripe customer not found for this organization" 
          },
          { status: 404 }
        );
      }

      if (err.status === "UNAUTHORIZED" || err.statusCode === 403) {
        return NextResponse.json(
          { 
            success: false,
            message: "You are not authorized to access the billing portal for this organization" 
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false,
        message: `Failed to open billing portal: ${getErrorMessage(err)}` 
      },
      { status: 500 }
    );
  }
}