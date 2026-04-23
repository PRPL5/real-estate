import { z } from "zod";

const listingStatusSchema = z.enum(["AVAILABLE", "PENDING", "SOLD"]);
const visibilitySchema = z.enum(["DRAFT", "PUBLISHED"]);

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const listingSchema = z.object({
  title: z.string().trim().min(4, "Title is required."),
  propertyType: z.string().trim().min(2, "Property type is required."),
  price: z.coerce.number().int().positive("Price must be a positive number."),
  summary: z.string().trim().min(12, "Short summary is required."),
  description: z.string().trim().min(40, "Full description is required."),
  address: z.string().trim().min(4, "Location is required."),
  mapUrl: z.url("Enter a valid Google Maps link or map URL."),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().int().positive("Area must be a positive number."),
  areaUnit: z.string().trim().min(2, "Area unit is required."),
  listingStatus: listingStatusSchema,
  visibility: visibilitySchema,
  contactName: z.string().trim().min(2, "Contact name is required."),
  contactEmail: z.email().trim().toLowerCase(),
  contactPhone: z.string().trim().min(7, "Phone number is required."),
  contactWhatsapp: z.string().trim().optional().or(z.literal("")),
  officeAddress: z.string().trim().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  coverSelection: z.string().trim().min(1, "Choose a cover image."),
  imagePlan: z.string().trim().min(2),
  removedImageIds: z.string().trim().optional().default("[]"),
});

export type ListingFormValues = z.infer<typeof listingSchema>;
