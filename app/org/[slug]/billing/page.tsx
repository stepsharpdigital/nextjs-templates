import { getOrganizationsBySlug } from "@/server/organizations";
import OrganizationBilling from "@/components/organization/getBilling";

type Params = Promise<{ slug: string }>

export default async function OrganizationBillingPage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params;
  const organization = await getOrganizationsBySlug(slug);

  if (!organization) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Organization not found</h1>
          <p className="text-muted-foreground">
            The organization with slug &quot;{slug}&quot; does not exist or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <OrganizationBilling organization={organization} />
    </div>
  );
}