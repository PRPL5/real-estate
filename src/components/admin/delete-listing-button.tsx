"use client";

import { useRef } from "react";
import { deleteListingAction } from "@/app/admin/actions";

export function DeleteListingButton({ listingId }: { listingId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-full border border-[#b46c54]/20 bg-[#b46c54]/8 px-4 py-2 text-sm font-medium text-[#8d4f3d]"
      >
        Delete
      </button>
      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-[28px] border border-black/10 p-0 backdrop:bg-black/40"
      >
        <div className="space-y-5 bg-white p-6">
          <div>
            <p className="eyebrow">Delete Listing</p>
            <h3 className="mt-3 text-2xl font-semibold text-[#171717]">Remove this property?</h3>
            <p className="mt-3 text-sm leading-7 text-[#5f5953]">
              This permanently deletes the listing and any uploaded local images connected to it.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
            >
              Cancel
            </button>
            <form action={deleteListingAction}>
              <input type="hidden" name="listingId" value={listingId} />
              <button
                type="submit"
                className="rounded-full bg-[#b46c54] px-4 py-2 text-sm font-medium text-white"
              >
                Delete Listing
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
