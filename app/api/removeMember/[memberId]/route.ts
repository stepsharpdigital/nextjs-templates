import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { member } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateOrganizationSeats } from "@/lib/stripe/update-seats";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const sessionHeaders = await headers();
    
    // Get current user session
    const session = await auth.api.getSession({ headers: sessionHeaders });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false,
          message: "Please sign in to perform this action" 
        },
        { status: 401 }
      );
    }

    // Get the member record to find the organization
    const memberToDelete = await db.query.member.findFirst({
      where: eq(member.id, memberId),
      with: {
        organization: true,
      },
    });

    if (!memberToDelete) {
      return NextResponse.json(
        { 
          success: false,
          message: "Member not found" 
        },
        { status: 404 }
      );
    }

    // Check if current user is an owner of the organization
    const currentUserMember = await db.query.member.findFirst({
      where: and(
        eq(member.organizationId, memberToDelete.organizationId),
        eq(member.userId, session.user.id)
      ),
    });

    if (!currentUserMember) {
      return NextResponse.json(
        { 
          success: false,
          message: "You are not a member of this organization" 
        },
        { status: 403 }
      );
    }

    // Only owners can remove members
    if (currentUserMember.role !== "owner") {
      return NextResponse.json(
        { 
          success: false,
          message: "Only organization owners can remove members" 
        },
        { status: 403 }
      );
    }

    // Prevent removing the last owner
    if (memberToDelete.role === "owner") {
      const ownerCount = await db
        .select({ count: member.id })
        .from(member)
        .where(
          and(
            eq(member.organizationId, memberToDelete.organizationId),
            eq(member.role, "owner")
          )
        );

      if (ownerCount.length === 1) {
        return NextResponse.json(
          { 
            success: false,
            message: "Cannot remove the last owner of the organization. Please transfer ownership first." 
          },
          { status: 400 }
        );
      }
    }

    // Prevent removing yourself
    if (memberToDelete.userId === session.user.id) {
      return NextResponse.json(
        { 
          success: false,
          message: "You cannot remove yourself. Please transfer ownership or ask another owner to remove you." 
        },
        { status: 400 }
      );
    }

    // Delete the member
    await db.delete(member).where(eq(member.id, memberId));

    // Update subscription seats after removal
    try {
      const updateResult = await updateOrganizationSeats(memberToDelete.organizationId);
      
      if (updateResult.success) {
        console.log(`Updated seats after member removal: ${updateResult.message}`);
      } else {
        console.warn(`Failed to update seats after member removal:`, updateResult.message);
      }
    } catch (error) {
      console.error("Error updating seats after member removal:", error);
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Member removed successfully",
        organizationId: memberToDelete.organizationId,
        organizationName: memberToDelete.organization?.name
      }, 
      { status: 200 }
    );
    
  } catch (error: unknown) {
    console.error("Error removing member:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to delete the member";
    
    return NextResponse.json(
      { 
        success: false,
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}