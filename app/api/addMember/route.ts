
import { Role } from "@/db/schema";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest){

                const invitationData = await request.json();
                    // console.log(invitationData);
        try{
                const data = await auth.api.createInvitation({
    body: {
        email: invitationData.email,
        role: invitationData.role as Role,
        organizationId: invitationData.organizationId,
        resend: true,
    },
    headers: await headers(),
});
        //    console.log(data);
             return NextResponse.json({ 
      success: true,
      message: `Invitation sent to ${invitationData.email} as ${invitationData.role}`,
      data 
    }, { status: 200 });
        }
        catch(err){
            console.error(err);
            return NextResponse.json(
                { message: "Failed to send invitation" },
                { status: 500 },
            );
        }
}