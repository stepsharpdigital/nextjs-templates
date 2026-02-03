"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@/db/schema";
import { toast } from "sonner";

interface OrganizaionSwitcherProps {
  organizations: Organization[];
}
export function OrganizationSwitcher({
  organizations,
}: OrganizaionSwitcherProps) {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleChangeOrganization = async (organizationId: string) => {
    
         const {error} = await authClient.organization.setActive({
      organizationId,
    });
         if(error){
          toast.error("Failed to change Organization");
          return;
         }else{
           toast.success("Organization changed!");
          }
  };
  return (
    <Select
      onValueChange={handleChangeOrganization}
      value={activeOrganization?.id}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
