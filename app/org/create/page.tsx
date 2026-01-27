"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Building } from "lucide-react"
import Link from "next/link"
import {toast} from 'sonner';
import { Loader2 } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

// Define the schema for form validation using Zod
const formSchema = z.object({
    name: z.string()
    .min(2,{message: "Organization name must be at least 2 characters"})
    .max(50,{message: "Organization name is too long"}),
    slug: z.string()
    .min(2,{message: "Organization slug must be at least 2 characters"})
    .max(10,{message: "Organization slug is too long"}),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateOrganizationPage() {
  const router = useRouter()


    const form = useForm<FormData>({
      resolver: zodResolver(formSchema), 
      mode: "onSubmit",
      defaultValues: {
        name: "",
        slug: "",
      },
    });

      async function onSubmit(value: FormData) { 

    const { error } = await authClient.organization.create({
   name: value.name, // required
    slug: value.slug, // required
});
         if (error){
              toast.error(error.message);
         }
    else {
      toast.success("Organization created successfully!");
     router.push("/org"); 
    } 
 
  }


  return (
    <div className="container mx-auto p-6 max-w-md">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/org">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <CardTitle>Create Organization</CardTitle>
          </div>
          <CardDescription>
            Set up a new organization for your team
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={form.handleSubmit(onSubmit)}>
             <FieldGroup className="gap-6">
                          {/* Organization Field */}
                          <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">
                                  Enter Your Organization Name:
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="name"
                                  type="text"
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError>{fieldState.error?.message}</FieldError>
                                )}
                              </Field>
                            )}
                          />

            {/* Password Field */}
                          <Controller
                            name="slug"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="slug">
                                  Enter Slug:
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="slug"
                                  type="text"
                                  aria-invalid={fieldState.invalid}
                                  autoComplete="new-password"
                                />
                                {fieldState.invalid && (
                                  <FieldError>{fieldState.error?.message}</FieldError>
                                )}
                              </Field>
                            )}
                          />
                        
            <div className="flex justify-end mt-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/org")}
              >
                Cancel
              </Button>
               {/* Submit Button */}
                            
              <Button type="submit"  disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? (
                                  <Loader2 className="size-5 animate-spin" />
                                ) : (
                                  "Create Organization"
                                )}
              </Button>
            </div>
      </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}