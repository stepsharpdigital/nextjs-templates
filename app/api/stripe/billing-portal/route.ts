import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    // Get session
    const sessionHeaders = await headers();
    const session = await auth.api.getSession({ headers: sessionHeaders });

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please sign in to access billing" },
        { status: 401 }
      );
    }

    // Get return URL from request or use default
    const body = await request.json().catch(() => ({}));
    const returnUrl = body.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing`;

    // Create billing portal session
    const result = await auth.api.createBillingPortal({
      body: {
        returnUrl,
        referenceId: session.user.id,
        disableRedirect: true,
      },
      headers: sessionHeaders,
    });

    if (!result.url) {
      return NextResponse.json(
        { message: "Failed to create billing session" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: result.url,
    });

  } catch (err) {
    console.error("Billing portal error:", err);
    
    return NextResponse.json(
      { message: "Failed to open billing portal" },
      { status: 500 }
    );
  }
}