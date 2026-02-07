import { member } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { isOwner } from "@/server/permissions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  try {
    const { memberId } = await params;
  
    const body = await request.json();
    const { role } = body;
  
    const validRoles = ["owner", "admin", "member"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be: owner, admin, or member" },
        { status: 400 }
      );
    }
    
    // Check if user has permission (only owners can change roles)
    const hasPermission = await isOwner();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "You are not authorized to change roles" },
        { status: 403 }
      );
    }
    
    // Find the member
    const existingMember = await db.query.member.findFirst({
      where: eq(member.id, memberId),
    });
    
    if (!existingMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }
    
    // Update the role
    await db.update(member)
      .set({ role })
      .where(eq(member.id, memberId));
    
    return NextResponse.json(
      { message: "Role updated successfully", role },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Change role error:", error);
    return NextResponse.json(
      { error: "Failed to change role" },
      { status: 500 }
    );
  }
}