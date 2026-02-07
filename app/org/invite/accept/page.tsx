"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building, Check, X } from "lucide-react"
import { toast } from "sonner"
import { Suspense } from "react"

function AcceptInviteContent({
  token,
}: {
  token: string | null
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  // Mock organization data
  const orgData = {
    name: "Acme Inc",
    inviter: "John Doe",
    inviterEmail: "john@example.com",
    role: "Member",
  }

  const handleAccept = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success("Invitation accepted! You have joined the organization.")
    
    router.push("/org")
    setIsLoading(false)
  }

  const handleDecline = async () => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.info("You have declined the invitation.")
    
    router.push("/")
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-md min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Avatar className="h-16 w-16 mx-auto">
              <AvatarFallback>
                <Building className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold">{orgData.name}</p>
              <p className="text-muted-foreground">
                Invited by {orgData.inviter} ({orgData.inviterEmail})
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Organization:</div>
                <div className="font-medium">{orgData.name}</div>
                
                <div className="text-muted-foreground">Your Role:</div>
                <div className="font-medium">{orgData.role}</div>
                
                <div className="text-muted-foreground">Invitation Code:</div>
                <div className="font-mono text-sm">{token || "No token provided"}</div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>By accepting, you&apos;ll gain access to this organization&apos;s resources and team members.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              {isLoading ? "Accepting..." : "Accept Invitation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AcceptInviteWithSearchParams() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  return <AcceptInviteContent token={token} />
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6 max-w-md min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarFallback>
                  <Building className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>Organization Invitation</CardTitle>
            <CardDescription>
              Loading invitation...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">Please wait while we load the invitation details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AcceptInviteWithSearchParams />
    </Suspense>
  )
}