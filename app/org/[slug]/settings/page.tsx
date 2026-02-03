import { getOrganizationsBySlug } from "@/server/organizations";
import OrganizationSettings from "@/components/organization/getSettings";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params;
  const organization = await getOrganizationsBySlug(slug);
  
  if (!organization) {
    notFound(); 
  }

  return (
    <div className="container mx-auto p-6">
      <OrganizationSettings organization={organization} />
    </div>
  );
}