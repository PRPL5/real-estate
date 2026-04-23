import { notFound } from "next/navigation";
import { updateListingAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { ListingForm } from "@/components/forms/listing-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminListingById } from "@/lib/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const listing = await getAdminListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit Listing"
      description="Update listing details, revise the image order, and control whether the property is live."
    >
      <ListingForm listing={listing} action={updateListingAction.bind(null, listing.id)} />
    </AdminShell>
  );
}
