import { ListingVisibility } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

const listingInclude = {
  images: {
    orderBy: {
      position: "asc" as const,
    },
  },
};

export const getAgentProfile = cache(async () => {
  return prisma.adminUser.findFirst({
    orderBy: { createdAt: "asc" },
  });
});

export const getPublishedListings = cache(async () => {
  return prisma.listing.findMany({
    where: { visibility: ListingVisibility.PUBLISHED },
    include: listingInclude,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
});

export const getFeaturedListings = cache(async () => {
  return prisma.listing.findMany({
    where: {
      visibility: ListingVisibility.PUBLISHED,
      featured: true,
    },
    include: listingInclude,
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
});

export const getPublicListingBySlug = cache(async (slug: string) => {
  return prisma.listing.findFirst({
    where: {
      slug,
      visibility: ListingVisibility.PUBLISHED,
    },
    include: listingInclude,
  });
});

export const getAdminListings = cache(async () => {
  return prisma.listing.findMany({
    include: listingInclude,
    orderBy: { updatedAt: "desc" },
  });
});

export const getAdminListingById = cache(async (id: string) => {
  return prisma.listing.findUnique({
    where: { id },
    include: listingInclude,
  });
});
