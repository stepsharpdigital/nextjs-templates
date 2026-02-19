import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { invitation, organization } from "@/db/schema";
import { updateOrganizationSeats } from "@/lib/stripe/update-seats";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  try {
    const { invitationId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.redirect(
        new URL(`/login?invite=${invitationId}`, request.url),
      );
    }

    // Get invitation with organization details
    const invitations = await db
      .select()
      .from(invitation)
      .where(eq(invitation.id, invitationId));

    if (invitations.length === 0) {
      return NextResponse.redirect(
        new URL("/org?error=invitation_not_found", request.url),
      );
    }

    const inv = invitations[0];

    if (inv.status === "accepted") {
      return NextResponse.redirect(
        new URL("/org?error=already_accepted", request.url),
      );
    }

    const invitedEmail = inv.email;

    if (session.user.email.toLowerCase() !== invitedEmail.toLowerCase()) {
      return NextResponse.redirect(
        new URL("/org?error=not_for_you", request.url),
      );
    }

    // Get organization details
    const orgs = await db
      .select()
      .from(organization)
      .where(eq(organization.id, inv.organizationId));

    if (orgs.length === 0) {
      return NextResponse.redirect(
        new URL("/org?error=organization_not_found", request.url),
      );
    }

    const currentOrg = orgs[0];

    // Accept the invitation
    await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });

    // Update subscription seats if organization has an active subscription
    try {
      const updateResult = await updateOrganizationSeats(currentOrg.id);

      if (updateResult.success) {
        console.log(
          `Updated seats for ${currentOrg.name}: ${updateResult.message}`,
        );
      } else {
        console.warn(
          `Failed to update seats for ${currentOrg.name}:`,
          updateResult.message,
        );
      }
    } catch (error) {
      console.error("Error updating seats:", error);
    }

    // Redirect to organization page after successful acceptance
    return NextResponse.redirect(
      new URL("/org?success=invite_accepted", request.url),
    );
  } catch (err: unknown) {
    console.error("Error accepting invitation:", err);

    const isNextRedirect =
      err instanceof Error && err.message === "NEXT_REDIRECT";

    if (isNextRedirect) {
      throw err;
    }

    const message =
      err instanceof Error ? err.message : "Failed to accept invitation";

    return NextResponse.json(
      {
        message: "Failed to accept invitation",
        error: message,
      },
      { status: 500 },
    );
  }
}
