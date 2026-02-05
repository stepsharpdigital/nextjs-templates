import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const sessionHeaders = await headers();
    const session = await auth.api.getSession({ headers: sessionHeaders });
    const body = await request.json();
    const returnUrl = body.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing`;

    // console.log('Cancel subscription request:', {
    //   userId: session?.user?.id,
    //   referenceId: body.referenceId,
    //   subscriptionId: body.subscriptionId,
    //   returnUrl
    // });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // redirects to Stripe Billing Portal to confirm cancelling
    const result = await auth.api.cancelSubscription({
      body: {
        referenceId: body.referenceId,
        subscriptionId: body.subscriptionId,
        returnUrl: returnUrl,
      },
      headers: sessionHeaders,
    });

    // console.log('Cancel subscription result:', result);

    // Return the Stripe Billing Portal URL for frontend to redirect
    return NextResponse.json({
      success: true,
      url: result.url,
      message: "Redirecting to Stripe Billing Portal to cancel subscription",
    });
  } catch (err: unknown) {
    console.error("Cancel subscription failed:", err);

    const message =
      err instanceof Error ? err.message : "Failed to cancel subscription";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}