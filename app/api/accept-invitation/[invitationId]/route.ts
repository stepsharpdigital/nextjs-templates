import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { invitation } from "@/db/schema";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const { invitationId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/login?invite=${invitationId}`);
  }

  const inv = await db
    .select()
    .from(invitation)
    .where(eq(invitation.id, invitationId));

  if (inv.length === 0) {
      return NextResponse.redirect(
        new URL("/org?error=invitation_not_found", request.url),
      );
  }

  if (inv[0].status === "accepted"){
   return NextResponse.redirect(
        new URL("/org?error=already_accepted", request.url),
      );
  }
  const invitedEmail = inv[0].email;

  if (session.user.email.toLowerCase() !== invitedEmail.toLowerCase()) {
    return NextResponse.redirect(
        new URL("/org?error=not_for_you", request.url),
      );
  }

  try {
    await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });
     return NextResponse.redirect(
      new URL("/org?success=invite_accepted", request.url),
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to accept invitation" },
      { status: 500 },
    );
  }
}
