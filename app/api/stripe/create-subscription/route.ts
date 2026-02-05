import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const sessionHeaders = await headers();
    const session = await auth.api.getSession({ headers: sessionHeaders });
    const body = await request.json();

    // console.log('Create subscription request:', {
    //   plan: body.plan,
    //   referenceId: body.referenceId,
    //   subscriptionId: body.subscriptionId
    // });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create the subscription checkout session
    const result = await auth.api.upgradeSubscription({
      body: {
        plan: body.plan,
        referenceId: body.referenceId,
        subscriptionId: body.subscriptionId,
        successUrl: body.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
        cancelUrl: body.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
        returnUrl: body.returnUrl,
        disableRedirect: false, 
      },
      headers: sessionHeaders,
    });

    // console.log('Create subscription result:', result);

    // Check if we got a URL from Stripe
    if (!result.url) {
      return NextResponse.json(
        { error: "No checkout URL returned from Stripe" },
        { status: 400 }
      );
    }

    // Return the Stripe checkout URL
    return NextResponse.json({
      success: true,
      checkoutUrl: result.url,
    });

  } catch (err: unknown) {
    console.error("Subscription creation failed:", err);

    const message =
      err instanceof Error ? err.message : "Failed to create subscription";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 },
    );
  }
}