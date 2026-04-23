import { ListingVisibility } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

const listingInclude = {
  images: {
    orderBy: {
      position: "asc" as const,
    },
  },
};

export async function getAgentProfile() {
  noStore();
  return prisma.adminUser.findFirst({
    orderBy: { createdAt: "asc" },
  });
}

export async function getPublishedListings() {
  noStore();
  return prisma.listing.findMany({
    where: { visibility: ListingVisibility.PUBLISHED },
    include: listingInclude,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getFeaturedListings() {
  noStore();
  return prisma.listing.findMany({
    where: {
      visibility: ListingVisibility.PUBLISHED,
      featured: true,
    },
    include: listingInclude,
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
}

export async function getPublicListingBySlug(slug: string) {
  noStore();
  return prisma.listing.findFirst({
    where: {
      slug,
      visibility: ListingVisibility.PUBLISHED,
    },
    include: listingInclude,
  });
}

export async function getAdminListings() {
  noStore();
  return prisma.listing.findMany({
    include: listingInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAdminListingById(id: string) {
  noStore();
  return prisma.listing.findUnique({
    where: { id },
    include: listingInclude,
  });
}
