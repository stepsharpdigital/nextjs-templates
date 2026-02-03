"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type ProjectPermission = "create" | "update" | "delete" | "share";

const checkPermission = async (projectPermissions: ProjectPermission[]) => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: { permissions: { project: projectPermissions } },
    });
    
    return { success: !!success, error };
  } catch (error) {
    console.error("Permission check failed:", error);
    return { success: false, error: "Failed to check permissions" };
  }
};

// Owner: Full project permissions
export const isOwner = async () => {
  const result = await checkPermission(["create", "update", "delete"]);
  return result.success;
};

// Admin: Create and update projects
export const isAdmin = async () => {
  const result = await checkPermission(["create", "update"]);
  return result.success;
};

// Member: Only create projects
export const isMember = async () => {
  const result = await checkPermission(["create"]);
  return result.success;
};

export const isAuthenticated = async () => {
  const result = await checkPermission(["create"]);
  return result.success;
};