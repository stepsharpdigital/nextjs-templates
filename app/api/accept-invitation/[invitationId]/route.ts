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
    return NextResponse.json(
      { message: "Invitation not found" },
      { status: 404 },
    );
  }

  if (inv[0].status === "accepted"){
    return NextResponse.json(
      { message: "Invitation already accepted" },
      { status: 400 },
    );
  }
  const invitedEmail = inv[0].email;

  if (session.user.email.toLowerCase() !== invitedEmail.toLowerCase()) {
    return NextResponse.json(
      { message: "Invitation is not for you" },
      { status: 401 },
    );
  }

  try {
    await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });
    return NextResponse.json({ message: "Invitation accepted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to accept invitation" },
      { status: 500 },
    );
  }
}
