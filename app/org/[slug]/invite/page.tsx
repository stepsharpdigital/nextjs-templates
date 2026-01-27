"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Copy, Send } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function InviteMembersPage({
  params,
}: {
  params: { orgId: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [inviteLink, setInviteLink] = React.useState("https://app.example.com/org/invite/accept?token=abc123")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success("Invitations sent successfully!")
    router.push(`/org/${params.orgId}/members`)
    
    setIsLoading(false)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast.success("Invite link copied to clipboard!")
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/org/${params.orgId}/members`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Link>
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invite by Email</CardTitle>
            <CardDescription>
              Send an email invitation to join your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emails">Email Addresses *</Label>
                  <Textarea
                    id="emails"
                    placeholder="email1@example.com, email2@example.com"
                    required
                   
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="member">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Custom Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message to your invitation..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/org/${params.orgId}/members`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  {isLoading ? "Sending..." : "Send Invitations"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite Link</CardTitle>
            <CardDescription>
              Share this link to invite people to your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input value={inviteLink} readOnly />
                <Button variant="outline" onClick={copyInviteLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>This link will expire in 7 days</p>
                <Button variant="link" className="p-0 h-auto">
                  Generate new link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}