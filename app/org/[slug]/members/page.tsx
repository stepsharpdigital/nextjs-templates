
import { getOrganizationsBySlug } from "@/server/organizations";
import OrganizationMembers from "@/components/organization/getMembers";

type Params = Promise<{ slug: string}>

export default async  function OrganizationMembersPage({
  params,
}: {
  params: Params
}) {
  const {slug} = await params;
  const organization = await getOrganizationsBySlug(slug)
  // console.log(organization)

  return (
    <div className="container mx-auto p-6">
         <OrganizationMembers members={ organization?.members || []}/>
    </div>
  )
}