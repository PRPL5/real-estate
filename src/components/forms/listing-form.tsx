"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";
import type { Listing, ListingImage } from "@prisma/client";
import { propertyTypes } from "@/lib/constants";
import { SubmitButton } from "@/components/shared/submit-button";

type ListingWithImages = Listing & { images: ListingImage[] };

type ImageItem = {
  id: string;
  previewUrl: string;
  label: string;
  existing: boolean;
  removed?: boolean;
};

type ActionState = {
  error?: string;
};

export function ListingForm({
  listing,
  action,
}: {
  listing?: ListingWithImages;
  action: (state: ActionState | void, formData: FormData) => Promise<ActionState | void>;
}) {
  const [state, formAction] = useActionState(action, {});
  const currentState = state ?? {};
  const [existingImages, setExistingImages] = useState<ImageItem[]>(
    () =>
      listing?.images.map((image) => ({
        id: `existing:${image.id}`,
        previewUrl: image.url,
        label: image.altText ?? listing.title,
        existing: true,
      })) ?? [],
  );
  const [newImages, setNewImages] = useState<ImageItem[]>([]);
  const [coverSelection, setCoverSelection] = useState<string>(
    () =>
      listing?.images.find((image) => image.isCover)?.id
        ? `existing:${listing.images.find((image) => image.isCover)!.id}`
        : "",
  );
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [fileInputIds, setFileInputIds] = useState<number[]>([0]);

  const activeImages = useMemo(
    () => [...existingImages.filter((image) => !image.removed), ...newImages],
    [existingImages, newImages],
  );

  const effectiveCoverSelection = coverSelection || activeImages[0]?.id || "";

  function moveImage(id: string, direction: "left" | "right") {
    const index = activeImages.findIndex((image) => image.id === id);
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= activeImages.length) return;

    const reordered = [...activeImages];
    const [item] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, item);

    setExistingImages(reordered.filter((image) => image.existing));
    setNewImages(reordered.filter((image) => !image.existing));
  }

  function removeImage(id: string) {
    if (id.startsWith("existing:")) {
      const dbId = id.replace("existing:", "");
      setRemovedImageIds((current) => [...new Set([...current, dbId])]);
      setExistingImages((current) =>
        current.map((image) => (image.id === id ? { ...image, removed: true } : image)),
      );
    } else {
      setNewImages((current) => current.filter((image) => image.id !== id));
    }

    if (coverSelection === id) {
      const nextImage = activeImages.find((image) => image.id !== id);
      setCoverSelection(nextImage?.id ?? "");
    }
  }

  return (
    <form action={formAction} className="space-y-8 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(18,18,18,0.06)] md:p-8">
      <input
        type="hidden"
        name="imagePlan"
        value={JSON.stringify(activeImages.map((image) => image.id))}
        readOnly
      />
      <input type="hidden" name="coverSelection" value={effectiveCoverSelection} readOnly />
      <input type="hidden" name="removedImageIds" value={JSON.stringify(removedImageIds)} readOnly />

      <section className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={listing?.title} required />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#171717]" htmlFor="propertyType">
            Property type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            defaultValue={listing?.propertyType ?? propertyTypes[0]}
            className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Field label="Price (USD)" name="price" type="number" defaultValue={listing?.price} required />
        <Field label="Location" name="address" defaultValue={listing?.address} required />
        <Field label="Google Maps Link" name="mapUrl" type="url" defaultValue={listing?.mapUrl} required />
        <Field label="Area Unit" name="areaUnit" defaultValue={listing?.areaUnit ?? "sq ft"} required />
        <Field label="Bedrooms" name="bedrooms" type="number" defaultValue={listing?.bedrooms} required />
        <Field label="Bathrooms" name="bathrooms" type="number" step="0.5" defaultValue={listing?.bathrooms} required />
        <Field label="Area" name="area" type="number" defaultValue={listing?.area} required />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#171717]" htmlFor="listingStatus">
            Listing status
          </label>
          <select
            id="listingStatus"
            name="listingStatus"
            defaultValue={listing?.listingStatus ?? "AVAILABLE"}
            className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none"
          >
            <option value="AVAILABLE">Available</option>
            <option value="PENDING">Pending</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#171717]" htmlFor="visibility">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            defaultValue={listing?.visibility ?? "DRAFT"}
            className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none"
          >
            <option value="DRAFT">Save as draft</option>
            <option value="PUBLISHED">Publish listing</option>
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <Textarea label="Short Summary" name="summary" defaultValue={listing?.summary} rows={3} required />
        <Textarea label="Full Description" name="description" defaultValue={listing?.description} rows={7} required />
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#171717]">Listing Gallery</h2>
            <p className="text-sm text-[#655d56]">
              Upload multiple images, choose a cover image, and arrange the order shown on the public page.
            </p>
          </div>
          <label
            className="inline-flex cursor-pointer items-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
            htmlFor={`newImages-${fileInputIds[fileInputIds.length - 1]}`}
          >
            <span>Add Images</span>
          </label>
          <div className="hidden">
            {fileInputIds.map((fileInputId) => (
              <input
                key={fileInputId}
                id={`newImages-${fileInputId}`}
                name="newImages"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  if (!files.length) return;
                  setNewImages((current) => {
                    const startIndex = current.length;
                    const mapped = files.map((file, index) => ({
                      id: `new:${startIndex + index}`,
                      previewUrl: URL.createObjectURL(file),
                      label: file.name,
                      existing: false,
                    }));
                    return [...current, ...mapped];
                  });
                  setFileInputIds((current) => [...current, current.length]);
                }}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeImages.map((image, index) => (
            <div key={image.id} className="overflow-hidden rounded-[26px] border border-black/8 bg-[#fbf7f3]">
              <div className="relative aspect-[4/3]">
                <Image src={image.previewUrl} alt={image.label} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-[#171717]">
                    <input
                      type="radio"
                      name="coverSelector"
                      checked={effectiveCoverSelection === image.id}
                      onChange={() => setCoverSelection(image.id)}
                    />
                    Main image
                  </label>
                  <span className="text-xs uppercase tracking-[0.24em] text-[#8d7f73]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs"
                    onClick={() => moveImage(image.id, "left")}
                  >
                    Move Left
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs"
                    onClick={() => moveImage(image.id, "right")}
                  >
                    Move Right
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[#b46c54]/20 bg-[#b46c54]/8 px-3 py-1.5 text-xs text-[#8d4f3d]"
                    onClick={() => removeImage(image.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <Field label="Contact Name" name="contactName" defaultValue={listing?.contactName} required />
        <Field label="Contact Email" name="contactEmail" type="email" defaultValue={listing?.contactEmail} required />
        <Field label="Contact Phone" name="contactPhone" defaultValue={listing?.contactPhone} required />
        <Field label="WhatsApp" name="contactWhatsapp" defaultValue={listing?.contactWhatsapp ?? ""} />
        <Field label="Office Address" name="officeAddress" defaultValue={listing?.officeAddress ?? ""} />
        <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 py-3 text-sm text-[#171717]">
          <input type="checkbox" name="featured" defaultChecked={listing?.featured ?? false} value="true" />
          Feature this listing on the homepage
        </label>
      </section>

      {currentState.error ? <p className="text-sm text-red-600">{currentState.error}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[#655d56]">
          Draft saves keep the listing private. Published listings appear on the public site immediately.
        </p>
        <SubmitButton>{listing ? "Update Listing" : "Create Listing"}</SubmitButton>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#171717]" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none transition focus:border-[#a47b5a]"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows: number;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#171717]" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-[24px] border border-black/10 bg-[#f6f1eb] px-4 py-3 outline-none transition focus:border-[#a47b5a]"
      />
    </div>
  );
}
