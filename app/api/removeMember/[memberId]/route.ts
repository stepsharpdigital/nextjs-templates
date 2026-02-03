import { member } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { isOwner } from "@/server/permissions";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params;
  
  try {
    const Owner = await isOwner();
    
    if (!Owner) {
      return NextResponse.json(
        { error: "You are not authorized to perform this action" },
        { status: 403 }
      );
    }
    
    await db.delete(member).where(eq(member.id, memberId));
    return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete the member" },
      { status: 500 }
    );
  }
}