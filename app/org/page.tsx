"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  Users,
  Settings,
  Mail,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { getOrganizations } from "@/server/organizations";
import { useState, useEffect } from "react";
import { OrganizationSwitcher } from "@/components/org-switcher";

// Define the type for organization based on what getOrganizations returns
interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
  metadata: string | null; // This matches the actual return type
  memberCount?: number;
  role?: string;
}

// Type for OrganizationSwitcher
interface OrganizationSwitcherOrg {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  logo: string | null;
  metadata: string | null;
}

export default function OrganizationsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const filteredOrgs = organizations.filter((org: Organization) =>
    org.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Transform organizations for OrganizationSwitcher
  const switcherOrgs: OrganizationSwitcherOrg[] = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    logo: org.logo,
    createdAt: org.createdAt,
    metadata: org.metadata,
  }));

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
            <p className="text-muted-foreground">
              Manage your organizations and teams
            </p>
          </div>
          <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>
        <div className="max-w-[50vw] mx-auto gap-4">
          <Card className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Loader2 className="animate-spin size-7 mx-auto" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your organizations and teams
          </p>
        </div>
        <div className="flex gap-7">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft/>
          Dashboard
        </Button>
        <Button onClick={() => router.push("/org/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="mt-4 mb-8 pl-12">
        <OrganizationSwitcher organizations={switcherOrgs} />
      </div>
      <div className="grid gap-4">
        {filteredOrgs.map((org: Organization) => (
          <Card key={org.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{org.name}</CardTitle>
                  <CardDescription>
                    {org.memberCount || 0} members • {org.role || "Member"}
                  </CardDescription>
                </div>
                <Badge variant={org.role === "Owner" ? "default" : "secondary"}>
                  {org.role || "Member"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/org/${org.id}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/org/${org.id}/members`}>
                    <Users className="mr-2 h-4 w-4" />
                    Members
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/org/${org.id}/invite`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Invite
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No organizations found
              </h3>
              <p className="text-muted-foreground mb-4">
                {search
                  ? "Try a different search term"
                  : "Create your first organization to get started"}
              </p>
              <Button onClick={() => router.push("/org/create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
