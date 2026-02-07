"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Trash2, Users } from "lucide-react"
import Link from "next/link"

// Define the organization type based on your data structure
interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  logo: string | null;
  metadata: string | null;
  members: {
    id: string;
    createdAt: Date;
    userId: string;
    organizationId: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
}

export default function OrganizationSettings({ organization }: { organization: Organization }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: organization.name,
    slug: organization.slug,
    description: organization.metadata || "",
  });

  // Calculate member count
  const memberCount = organization.members.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/organizations/${organization.id}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh the page to show updated data
        router.refresh();
        // Show success message
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/org');
        alert('Organization deleted successfully');
      } else {
        throw new Error('Failed to delete organization');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Failed to delete organization. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/org">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
          <p className="text-muted-foreground">Manage your organization details</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members ({memberCount})</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="danger">Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Update your organization&apos;s basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Organization Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input 
                      id="slug" 
                      value={formData.slug} 
                      onChange={handleInputChange}
                      placeholder="Enter URL slug"
                      disabled // Often slugs shouldn't be changed after creation
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This is the unique identifier in your organization URL
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your organization"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Member Count</p>
                        <p className="text-sm text-muted-foreground">Total active members in this organization</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">{memberCount}</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>
                Manage members of {organization.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Total Members: {memberCount}</h3>
                    <p className="text-sm text-muted-foreground">Showing all members in this organization</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Invite Member
                  </Button>
                </div>
                
                <div className="border rounded-lg">
                  <div className="grid grid-cols-4 p-3 bg-muted font-medium text-sm">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Joined</div>
                  </div>
                  
                  {organization.members.map((member) => (
                    <div key={member.id} className="grid grid-cols-4 p-3 border-t items-center">
                      <div className="flex items-center gap-2">
                        {/* {member.user.image && (
                          <img 
                            src={member.user.image} 
                            alt={member.user.name} 
                            className="h-8 w-8 rounded-full"
                          />
                        )} */}
                        <span>{member.user.name}</span>
                      </div>
                      <div>{member.user.email}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      <div>{new Date(member.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your organization&apos;s security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require 2FA for members</Label>
                  <p className="text-sm text-muted-foreground">
                    All members must enable two-factor authentication
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">Delete Organization</h3>
                    <p className="text-sm text-muted-foreground">
                      Once deleted, it cannot be recovered. All members will lose access.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteOrganization}
                    disabled={isLoading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isLoading ? "Deleting..." : "Delete Organization"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}