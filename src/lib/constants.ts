export const siteConfig = {
  name: "Northpoint Estates",
  tagline: "Independent real estate, presented with clarity.",
  description:
    "Modern real estate website for a single independent agent with a premium public showcase and private listing management dashboard.",
  location: "Los Angeles, California",
  agent: {
    name: "Olivia Carter",
    title: "Independent Real Estate Agent",
    email: "agent@northpoint.com",
    phone: "+1 (310) 555-0148",
    whatsapp: "+13105550148",
    officeAddress: "1450 Sunset Plaza Drive, Los Angeles, CA",
  },
};

export const listingStatuses = ["AVAILABLE", "PENDING", "SOLD"] as const;
export const listingVisibility = ["DRAFT", "PUBLISHED"] as const;
export const propertyTypes = [
  "Villa",
  "Single Family",
  "Condo",
  "Townhouse",
  "Penthouse",
  "Apartment",
] as const;
