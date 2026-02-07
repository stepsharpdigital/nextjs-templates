"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Users,
  Settings,
  Mail,
  ChevronLeft,
  Shield,
  Clock,
  CreditCard,
  LucideLock
} from "lucide-react";
import { OrganizationSwitcher } from "@/components/organization/org-switcher";
import { authClient } from "@/lib/auth-client";
import { getOrganizationSubscriptionDetailsClient } from "@/lib/stripe/subs";
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
  
  // Get active organization with full data
  const { 
    data: activeOrganization, 
    isPending: isPendingActiveOrg,
    error: activeOrgError 
  } = authClient.useActiveOrganization();
  
  // Get list of all organizations for the switcher
  const { 
    data: organizationsList, 
    isPending: isPendingOrganizationsList
  } = authClient.useListOrganizations();

  // Get active member role
  const { 
    data: activeMemberRole 
  } = authClient.useActiveMemberRole();

  // State for subscription data
  const [hasActiveSubscription, setHasActiveSubscription] = React.useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = React.useState(false);
  const [subscriptionError, setSubscriptionError] = React.useState<string | null>(null);

  // Combined loading states
  const isLoading = isPendingActiveOrg || isPendingOrganizationsList;

  // Calculate member count from active organization data
  const memberCount = activeOrganization?.members?.length || 0;
  
  // Calculate pending invitations
  const pendingInvitations = activeOrganization?.invitations?.filter(
    inv => inv.status === "pending"
  ) || [];

  // Transform organizations for the switcher component
  const switcherOrganizations: OrganizationSwitcherOrg[] = React.useMemo(() => {
    if (!organizationsList) return [];
    
    return organizationsList.map(org => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logo: org.logo || null,
      createdAt: org.createdAt,
      metadata: org.metadata ? String(org.metadata) : null
    }));
  }, [organizationsList]);

  // Check for active subscription when organization changes
  React.useEffect(() => {
    async function checkSubscription() {
      if (!activeOrganization?.id) {
        setHasActiveSubscription(false);
        return;
      }

      setIsCheckingSubscription(true);
      setSubscriptionError(null);

      try {
        const subsDetail = await getOrganizationSubscriptionDetailsClient(activeOrganization.id);
        console.log("Subscription Details:", subsDetail);
        if (subsDetail.success && subsDetail.hasActiveSubscription) {
          setHasActiveSubscription(true);
        } else {
          setHasActiveSubscription(false);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setSubscriptionError("Failed to check subscription status");
        setHasActiveSubscription(false);
      } finally {
        setIsCheckingSubscription(false);
      }
    }

    checkSubscription();
  }, [activeOrganization?.id]);

  const handleSubPage = () => {
    if (!activeOrganization || !hasActiveSubscription) return;
    router.push(`/org/${activeOrganization.slug}/subs`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
            <p className="text-muted-foreground">
              Loading organization details...
            </p>
          </div>
          <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>
        <div className="max-w-[50vw] mx-auto">
          <Card className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If no active organization
  if (!activeOrganization && !isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Button 
              variant="outline" 
              onClick={() => router.push("/dashboard")}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">No Active Organization</h1>
            <p className="text-muted-foreground">
              Select or create an organization to get started
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No active organization
              </h3>
              <p className="text-muted-foreground mb-4">
                {organizationsList && organizationsList.length > 0 
                  ? "Select an organization from the switcher or create a new one"
                  : "Create your first organization to get started"}
              </p>
              <Button onClick={() => router.push("/org/create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeOrgError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">
            Failed to load organization data
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="text-muted-foreground">
            Manage your organization and team
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/org/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Organization Switcher - Only show if user has multiple organizations */}
      {switcherOrganizations && switcherOrganizations.length > 1 && activeOrganization && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Current Organization:</span>
            <OrganizationSwitcher 
              organizations={switcherOrganizations}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Switch between your {switcherOrganizations.length} organizations
          </p>
        </div>
      )}

      {/* Active Organization Card */}
      {activeOrganization && (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {activeOrganization.logo && (
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        <Image 
                          src={activeOrganization.logo} 
                          alt={activeOrganization.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-2xl">{activeOrganization.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <span className="font-semibold">Slug:</span> {activeOrganization.slug}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <Badge variant={activeMemberRole?.role === "owner" ? "default" : "secondary"}>
                    <Shield className="mr-1 h-3 w-3" />
                    {(activeMemberRole?.role || "MEMBER").toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    <Users className="mr-1 h-3 w-3" />
                    {memberCount} {memberCount === 1 ? "Member" : "Members"}
                  </Badge>
                  {pendingInvitations.length > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                      <Clock className="mr-1 h-3 w-3" />
                      {pendingInvitations.length} Pending
                    </Badge>
                  )}
                  {hasActiveSubscription && (
                    <Badge variant="default" className="bg-green-50 text-green-800 border-green-200">
                      <CreditCard className="mr-1 h-3 w-3" />
                      Active Subscription
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link href={`/org/${activeOrganization.slug}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link href={`/org/${activeOrganization.slug}/members`}>
                    <Users className="mr-2 h-4 w-4" />
                    Members
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link href={`/org/${activeOrganization.slug}/invite`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Invite
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link href={`/org/${activeOrganization.slug}/billing`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </Button>
                
                {/* Subscribers Only Button - Only show if organization has active subscription */}
                {hasActiveSubscription && (
                  <Button 
                    onClick={handleSubPage}
                    variant="outline" 
                    size="sm" 
                    className="flex-1 sm:flex-none"
                    disabled={isCheckingSubscription}
                  >
                    {isCheckingSubscription ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <LucideLock className="mr-2 h-4 w-4" />
                        Subscribers Only
                      </>
                    )}
                  </Button>
                )}
                
                {subscriptionError && (
                  <div className="col-span-full text-sm text-red-600 mt-2">
                    Error checking subscription: {subscriptionError}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{memberCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total active members
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInvitations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting acceptance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {new Date(activeOrganization.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Organization age
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Show subscription status card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                Current subscription information for this organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCheckingSubscription ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  <span className="ml-3">Checking subscription status...</span>
                </div>
              ) : hasActiveSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Active Subscription</h4>
                        <p className="text-sm text-green-600">This organization has an active subscription</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSubPage}>
                      Access Subscriber Content
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Subscriber-only features are available for members of this organization.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">No Active Subscription</h4>
                        <p className="text-sm text-gray-600">This organization does not have an active subscription</p>
                      </div>
                    </div>
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/org/${activeOrganization.slug}/billing`}>
                        View Billing Options
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Subscribe to access exclusive features and content for your organization.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{memberCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total active members
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInvitations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting acceptance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {new Date(activeOrganization.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Organization age
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Members Preview */}
          {activeOrganization.members && activeOrganization.members.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>
                  Latest members who joined this organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeOrganization.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {member.user.image && (
                          <div className="relative h-8 w-8 rounded-full overflow-hidden">
                            <Image 
                              src={member.user.image} 
                              alt={member.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{member.user.name}</div>
                          <div className="text-sm text-muted-foreground">{member.user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                          {member.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {activeOrganization.members.length > 3 && (
                    <div className="pt-2 border-t">
                      <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href="/org/members">
                          View all {activeOrganization.members.length} members
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Invitations Preview */}
          {pendingInvitations.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Invitations waiting for acceptance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingInvitations.slice(0, 3).map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{invitation.email}</div>
                        <div className="text-sm text-muted-foreground">
                          Role: {invitation.role} • Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {invitation.status}
                      </Badge>
                    </div>
                  ))}
                  {pendingInvitations.length > 3 && (
                    <div className="pt-2 border-t">
                      <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href="/org/invite">
                          View all {pendingInvitations.length} pending invitations
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for this organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" asChild className="justify-start h-auto py-3">
                  <Link href={`/org/${activeOrganization.slug}/members`}>
                    <Users className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Manage Members</div>
                      <div className="text-xs text-muted-foreground">Add, remove, or change roles</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start h-auto py-3">
                  <Link href={`/org/${activeOrganization.slug}/invite`}>
                    <Mail className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Invite People</div>
                      <div className="text-xs text-muted-foreground">Send invitation emails</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start h-auto py-3">
                  <Link href={`/org/${activeOrganization.slug}/settings`}>
                    <Settings className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Organization Settings</div>
                      <div className="text-xs text-muted-foreground">Update name, logo, etc.</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}