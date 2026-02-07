"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Users, Settings, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { Organization } from "@/db/schema"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface SubscriberPageProps {
  organization: Organization;
}

export default function SubscriberPageContent({ organization }: SubscriberPageProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.push(`/org`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="w-fit pl-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Premium Content</h1>
          <p className="text-muted-foreground mt-2">
            Exclusive access for <span className="font-semibold">{organization.name}</span> subscribers
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle>Subscriber Access Active</CardTitle>
          </div>
          <CardDescription>
            Your organization has an active subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">About This Access</h3>
            <p className="text-sm text-muted-foreground">
              Your subscription supports our continued development and provides your team with exclusive features 
              and content not available to free users.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Available Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-2">Advanced Analytics</div>
                <p className="text-sm text-muted-foreground">
                  Detailed insights and reporting tools for your organization
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-2">Priority Support</div>
                <p className="text-sm text-muted-foreground">
                  Faster response times and dedicated technical support
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-2">Extended History</div>
                <p className="text-sm text-muted-foreground">
                  Access to extended data retention and historical records
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-2">Team Management</div>
                <p className="text-sm text-muted-foreground">
                  Advanced team collaboration and permission controls
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Subscription information for {organization.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">Organization</span>
              <span>{organization.name}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">Slug</span>
              <span className="font-mono text-sm">{organization.slug}</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="default" className="bg-green-600">
                Active Subscription
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your subscription and organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href={`/org/${organization.slug}`} className="flex flex-col items-center gap-2">
                <Settings className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Dashboard</div>
                  <div className="text-xs text-muted-foreground mt-1">View organization dashboard</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href={`/org/${organization.slug}/billing`} className="flex flex-col items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Billing</div>
                  <div className="text-xs text-muted-foreground mt-1">Manage subscription</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href={`/org/${organization.slug}/members`} className="flex flex-col items-center gap-2">
                <Users className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Team</div>
                  <div className="text-xs text-muted-foreground mt-1">Manage organization members</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Need help with your subscription? Contact support@example.com</p>
      </div>
    </div>
  )
}