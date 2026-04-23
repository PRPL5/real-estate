import { ListingStatus, ListingVisibility } from "@prisma/client";
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

export async function getFilteredAdminListings(search?: string, status?: string) {
  noStore();

  return prisma.listing.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        status === "DRAFT"
          ? { visibility: ListingVisibility.DRAFT }
          : status && ["AVAILABLE", "PENDING", "SOLD"].includes(status)
            ? {
                visibility: ListingVisibility.PUBLISHED,
                listingStatus: status as ListingStatus,
              }
            : {},
      ],
    },
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

export async function getAdminDashboardData() {
  noStore();

  const [listings, latestListings] = await Promise.all([
    prisma.listing.findMany({
      include: listingInclude,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.listing.findMany({
      include: listingInclude,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = {
    total: listings.length,
    available: listings.filter(
      (listing) =>
        listing.visibility === ListingVisibility.PUBLISHED &&
        listing.listingStatus === ListingStatus.AVAILABLE,
    ).length,
    pending: listings.filter(
      (listing) =>
        listing.visibility === ListingVisibility.PUBLISHED &&
        listing.listingStatus === ListingStatus.PENDING,
    ).length,
    sold: listings.filter(
      (listing) =>
        listing.visibility === ListingVisibility.PUBLISHED &&
        listing.listingStatus === ListingStatus.SOLD,
    ).length,
    drafts: listings.filter((listing) => listing.visibility === ListingVisibility.DRAFT).length,
  };

  return {
    listings,
    latestListings,
    stats,
  };
}
