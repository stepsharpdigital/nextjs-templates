import { getOrganizationsBySlug } from "@/server/organizations";
import OrganizationInvite from "@/components/organization/org-invite";
import { notFound } from "next/navigation";

type Params  = Promise<{slug: string}>

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Params
}){
  const {slug} = await params;
  const organization = await getOrganizationsBySlug(slug);
  const orgId = organization?.id;

  if(!organization){
       notFound();
     }
    function organizationIdSolver(orgId?: string){
          if(orgId){
            return orgId;
          }
          return '';
    }

const organizationID =  organizationIdSolver(orgId);

  if(organizationID === ''){
    notFound();
  }
  
     return (
         <div className="container mx-auto p-6">
              <OrganizationInvite organizationId={organizationID} />
         </div>
     )
}