"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
interface OrganizationInviteProps {
  organizationId: string;
}
type ValidRole = "admin" | "owner" | "member";

// Define the schema for invitation form validation
const inviteFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  role: z.enum(["admin", "owner", "member"]),
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

export default function OrganizationInvite({
  organizationId,
}: OrganizationInviteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      role: "member", //default value
    },
  });

  async function onSubmit(value: InviteFormData) {
  setIsLoading(true);
  try {
    const roleToAssign: ValidRole = value.role;
    // console.log(roleToAssign);
    const payload = {
      email: value.email,
      role: roleToAssign,
      organizationId: organizationId,
    };

    const response = await fetch("/api/addMember",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.message || "Failed to send invitation. Please try again.");
    } else {
      toast.success(result.message || `Invitation sent to ${value.email}`);
    }
    
    form.reset({
      email: "",
      role: value.role, 
    });
    router.push("/org");
  } catch (error) {
    console.error(error);
    toast.error("Network error. Please check your connection and try again.");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/org`}>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                      />
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Role Field */}
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="role">Role</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="role"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/org`)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Invitations
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
