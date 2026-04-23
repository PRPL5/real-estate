"use server";

import { ListingStatus, ListingVisibility } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, clearAdminSession, createAdminSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteLocalImages, saveUploadedImages } from "@/lib/uploads";
import { slugify } from "@/lib/utils";
import { loginSchema, listingSchema } from "@/lib/validators";

type ActionState = {
  error?: string;
};

function parseJsonArray(input: string) {
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function buildUniqueSlug(title: string, listingId?: string) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let index = 1;

  while (true) {
    const existing = await prisma.listing.findFirst({
      where: {
        slug,
        ...(listingId ? { NOT: { id: listingId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return slug;
    index += 1;
    slug = `${baseSlug}-${index}`;
  }
}

function boolFromFormData(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}

function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

async function upsertListing(formData: FormData, listingId?: string) {
  await requireAdmin();

  const raw = {
    title: formData.get("title"),
    propertyType: formData.get("propertyType"),
    price: formData.get("price"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    address: formData.get("address"),
    mapUrl: formData.get("mapUrl"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    area: formData.get("area"),
    areaUnit: formData.get("areaUnit"),
    listingStatus: formData.get("listingStatus"),
    visibility: formData.get("visibility"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    contactWhatsapp: formData.get("contactWhatsapp"),
    officeAddress: formData.get("officeAddress"),
    featured: boolFromFormData(formData.get("featured")),
    coverSelection: formData.get("coverSelection"),
    imagePlan: formData.get("imagePlan"),
    removedImageIds: formData.get("removedImageIds"),
  };

  const parsed = listingSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please review the listing form.",
    };
  }

  const existingListing = listingId
    ? await prisma.listing.findUnique({
        where: { id: listingId },
        include: { images: true },
      })
    : null;

  if (listingId && !existingListing) {
    return { error: "Listing not found." };
  }

  const imagePlan = parseJsonArray(parsed.data.imagePlan) as string[];
  const removedImageIds = parseJsonArray(parsed.data.removedImageIds) as string[];
  const newFiles = formData
    .getAll("newImages")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const uploadedImages = await saveUploadedImages(newFiles);
  const existingImages = (existingListing?.images ?? []).filter(
    (image) => !removedImageIds.includes(image.id),
  );

  const orderedImages = imagePlan
    .map((item) => {
      if (item.startsWith("existing:")) {
        const id = item.replace("existing:", "");
        const match = existingImages.find((image) => image.id === id);
        return match
          ? {
              id: match.id,
              url: match.url,
              altText: match.altText ?? parsed.data.title,
              existing: true,
            }
          : null;
      }

      if (item.startsWith("new:")) {
        const index = Number(item.replace("new:", ""));
        const upload = uploadedImages[index];
        return upload
          ? {
              id: `new:${index}`,
              url: upload.url,
              altText: upload.altText || parsed.data.title,
              existing: false,
            }
          : null;
      }

      return null;
    })
    .filter(Boolean);

  if (!orderedImages.length) {
    await deleteLocalImages(uploadedImages.map((image) => image.url));
    return { error: "At least one image is required." };
  }

  const coverSelection = parsed.data.coverSelection;
  if (!orderedImages.some((image) => image?.id === coverSelection)) {
    await deleteLocalImages(uploadedImages.map((image) => image.url));
    return { error: "Choose a valid cover image." };
  }

  const slug = await buildUniqueSlug(parsed.data.title, listingId);
  const payload = {
    slug,
    title: sanitizeText(parsed.data.title),
    propertyType: sanitizeText(parsed.data.propertyType),
    price: parsed.data.price,
    summary: sanitizeText(parsed.data.summary),
    description: parsed.data.description.trim(),
    address: sanitizeText(parsed.data.address),
    mapUrl: parsed.data.mapUrl,
    bedrooms: parsed.data.bedrooms,
    bathrooms: parsed.data.bathrooms,
    area: parsed.data.area,
    areaUnit: sanitizeText(parsed.data.areaUnit),
    listingStatus: parsed.data.listingStatus as ListingStatus,
    visibility: parsed.data.visibility as ListingVisibility,
    contactName: sanitizeText(parsed.data.contactName),
    contactEmail: parsed.data.contactEmail,
    contactPhone: sanitizeText(parsed.data.contactPhone),
    contactWhatsapp: parsed.data.contactWhatsapp || null,
    officeAddress: parsed.data.officeAddress || null,
    featured: parsed.data.featured,
  };

  const coverUrl = orderedImages.find((image) => image?.id === coverSelection)?.url;

  if (existingListing) {
    const existingListingId = existingListing.id;
    const removedUrls = existingListing.images
      .filter((image) => removedImageIds.includes(image.id))
      .map((image) => image.url);

    await prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: { id: existingListingId },
        data: payload,
      });

      await tx.listingImage.deleteMany({
        where: {
          listingId: existingListingId,
          id: { in: removedImageIds },
        },
      });

      for (const [position, image] of orderedImages.entries()) {
        if (!image) continue;

        if (image.existing) {
          await tx.listingImage.update({
            where: { id: image.id },
            data: {
              position,
              isCover: image.url === coverUrl,
              altText: parsed.data.title,
            },
          });
        } else {
          await tx.listingImage.create({
            data: {
              listing: {
                connect: {
                  id: existingListingId,
                },
              },
              url: image.url,
              altText: parsed.data.title,
              position,
              isCover: image.url === coverUrl,
            },
          });
        }
      }
    });

    await deleteLocalImages(removedUrls);
  } else {
    await prisma.listing.create({
      data: {
        ...payload,
        images: {
          create: orderedImages.map((image, position) => ({
            url: image!.url,
            altText: parsed.data.title,
            position,
            isCover: image!.url === coverUrl,
          })),
        },
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/listings");
  revalidatePath("/admin/dashboard");
  if (existingListing) {
    revalidatePath(`/listings/${existingListing.slug}`);
    revalidatePath(`/admin/listings/${existingListing.id}/edit`);
  }
  revalidatePath(`/listings/${slug}`);

  redirect("/admin/dashboard?success=listing-saved");
}

export async function loginAction(
  _: ActionState | void,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid login details." };
  }

  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!admin) {
    return { error: "Incorrect email or password." };
  }

  await createAdminSession(admin.id, admin.email);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createListingAction(_: ActionState | void, formData: FormData) {
  return upsertListing(formData);
}

export async function updateListingAction(
  listingId: string,
  _: ActionState | void,
  formData: FormData,
) {
  return upsertListing(formData, listingId);
}

export async function deleteListingAction(formData: FormData) {
  await requireAdmin();

  const listingId = String(formData.get("listingId") ?? "");
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { images: true },
  });

  if (!listing) return;

  await prisma.listing.delete({
    where: { id: listingId },
  });

  await deleteLocalImages(listing.images.map((image) => image.url));

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/listings/${listing.slug}`);
}

export async function togglePublishAction(formData: FormData) {
  await requireAdmin();

  const listingId = String(formData.get("listingId") ?? "");
  const visibility = String(formData.get("visibility") ?? "DRAFT") as ListingVisibility;

  const listing = await prisma.listing.update({
    where: { id: listingId },
    data: { visibility },
  });

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/listings/${listing.slug}`);
}
