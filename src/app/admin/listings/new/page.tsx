import { AdminShell } from "@/components/admin/admin-shell";
import { ListingForm } from "@/components/forms/listing-form";
import { createListingAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { siteConfig } from "@/lib/constants";

export default async function NewListingPage() {
  await requireAdmin();

  return (
    <AdminShell
      title="Create Listing"
      description="Add a new property, upload images, choose a cover image, and save as draft or publish."
      currentPath="/admin/listings/new"
    >
      <ListingForm
        action={createListingAction}
        listing={{
          id: "",
          slug: "",
          title: "",
          propertyType: "Villa",
          price: 0,
          summary: "",
          description: "",
          address: "",
          mapUrl: "",
          bedrooms: 0,
          bathrooms: 0,
          area: 0,
          areaUnit: "sq ft",
          listingStatus: "AVAILABLE",
          visibility: "DRAFT",
          contactName: siteConfig.agent.name,
          contactEmail: siteConfig.agent.email,
          contactPhone: siteConfig.agent.phone,
          contactWhatsapp: siteConfig.agent.whatsapp,
          officeAddress: siteConfig.agent.officeAddress,
          featured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          images: [],
        }}
      />
    </AdminShell>
  );
}
