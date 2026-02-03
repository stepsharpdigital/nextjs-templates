"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  MoreVertical, 
  Search,
  Shield, 
  Trash2,
  Check,
  X 
} from "lucide-react"
import Link from "next/link"
import { Member } from "@/db/schema"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface MembersProps {
  members: Member[];
}

export default function OrganizationMembers({ members }: MembersProps) {
  const [search, setSearch] = React.useState("");
  const [editingRole, setEditingRole] = React.useState<string | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  
  // Initialize selected roles from members
  React.useEffect(() => {
    const initialRoles: Record<string, string> = {};
    members.forEach(member => {
      initialRoles[member.id] = member.role;
    });
    setSelectedRole(initialRoles);
  }, [members]);

  const filteredMembers = members.filter((member) =>
    member.user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRoleChange = (memberId: string, newRole: string) => {
    setSelectedRole(prev => ({
      ...prev,
      [memberId]: newRole
    }));
    setEditingRole(memberId);
  };

  const saveRoleChange = async (memberId: string) => {
    try {
      const newRole = selectedRole[memberId];
      
      const response = await fetch(`/api/change-role/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.error || "Failed to change role");
        const originalMember = members.find(m => m.id === memberId);
        if (originalMember) {
          setSelectedRole(prev => ({
            ...prev,
            [memberId]: originalMember.role
          }));
        }
        return;
      }
      
      toast.success(data.message || "Role updated successfully");
      setEditingRole(null);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
      
      const originalMember = members.find(m => m.id === memberId);
      if (originalMember) {
        setSelectedRole(prev => ({
          ...prev,
          [memberId]: originalMember.role
        }));
      }
      setEditingRole(null);
    }
  };

  const cancelRoleChange = (memberId: string) => {
    const originalMember = members.find(m => m.id === memberId);
    if (originalMember) {
      setSelectedRole(prev => ({
        ...prev,
        [memberId]: originalMember.role
      }));
    }
    setEditingRole(null);
  };

  const handleDeleteMember = async (memberId: string) => {
    setIsDeleting(memberId);
    try {
      const response = await fetch(`/api/removeMember/${memberId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        let errorMessage = "Failed to delete member";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        toast.error(errorMessage);
        return;
      }
      
      toast.success("Member removed successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Failed to delete member:", error);
      toast.error("Network error: Failed to delete member");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/org">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Members</h1>
            <p className="text-muted-foreground">
              Manage team members and their permissions
            </p>
          </div>
        </div>
        <Button asChild>
          {/* <Link href={`/org/${members.slug}/invite`}> */}
            {/* <UserPlus className="mr-2 h-4 w-4" /> */}
            {/* Invite Member */}
          {/* </Link> */}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {members.length} members in this organization
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full sm:w-75"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-sm text-muted-foreground">{member.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingRole === member.id ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedRole[member.id] || member.role}
                          onValueChange={(value) => handleRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => saveRoleChange(member.id)}
                          className="h-8 w-8"
                          disabled={isDeleting === member.id}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => cancelRoleChange(member.id)}
                          className="h-8 w-8"
                          disabled={isDeleting === member.id}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                          <Shield className="mr-1 h-3 w-3" />
                          {(member.role || "member").toUpperCase()}
                        </Badge>
                        {member.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRole(member.id)}
                            className="h-7 px-2 text-xs"
                            disabled={isDeleting === member.id}
                          >
                            Change
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(member.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {member.role !== "owner" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={isDeleting === member.id || editingRole === member.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.user.name} from the organization? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting === member.id}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(member.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={isDeleting === member.id}
                              >
                                {isDeleting === member.id ? "Removing..." : "Remove Member"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button variant="ghost" size="icon" disabled={isDeleting === member.id}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}