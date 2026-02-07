"use server";
import { db } from "@/db/drizzle";
import { eq, inArray, count } from "drizzle-orm";
import { getCurrentUser } from "./users";
import { member } from "@/db/schema";
import { organization } from "@/db/schema";

export async function getOrganizations() {
  const { currentUser } = await getCurrentUser();

  const members = await db.query.member.findMany({
    where: eq(member.userId, currentUser.id),
  });

  const organizations = await db.query.organization.findMany({
    where: inArray(
      organization.id,
      members.map((member) => member.organizationId),
    ),
  });

  return organizations;
}

export async function getInitialOrganization(userId: string) {
  const memberUser = await db.query.member.findFirst({
    where: eq(member.userId, userId),
  });

  if (!memberUser) {
    return null;
  }
  const activeOrganization = await db.query.organization.findFirst({
    where: eq(organization.id, memberUser.organizationId),
  });
  return activeOrganization;
}

export async function getOrganizationsBySlug(slug: string) {
  try {
    const organizationBySlug = await db.query.organization.findFirst({
      where: eq(organization.slug, slug),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
    return organizationBySlug;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMemberCountByOrganizationSlug(
  slug: string,
): Promise<number> {
  try {
    const result = await db
      .select({
        count: count(),
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(organization.slug, slug));

    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error getting member count by slug:", error);
    return 0;
  }
}
