import bcrypt from "bcryptjs";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, ListingStatus, ListingVisibility } from "@prisma/client";
import ws from "ws";

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

// Add uselibpqcompat=true to fix SSL certificate issues with Prisma 7
const connectionString = process.env.POSTGRES_URL_NON_POOLING
  ? `${process.env.POSTGRES_URL_NON_POOLING}${process.env.POSTGRES_URL_NON_POOLING.includes("?") ? "&" : "?"}uselibpqcompat=true`
  : undefined;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "ChangeMe123!",
    12,
  );

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "agent@northpoint.com" },
    update: {
      passwordHash,
      name: "Olivia Carter",
      phone: "+1 (310) 555-0148",
      whatsapp: "+13105550148",
      officeAddress: "1450 Sunset Plaza Drive, Los Angeles, CA",
      bio: "Independent real estate advisor focused on refined homes, clear communication, and confident closings.",
    },
    create: {
      email: process.env.ADMIN_EMAIL ?? "agent@northpoint.com",
      passwordHash,
      name: "Olivia Carter",
      phone: "+1 (310) 555-0148",
      whatsapp: "+13105550148",
      officeAddress: "1450 Sunset Plaza Drive, Los Angeles, CA",
      bio: "Independent real estate advisor focused on refined homes, clear communication, and confident closings.",
    },
  });

  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();

  const listings = [
    {
      slug: "sunset-ridge-modern-villa",
      title: "Sunset Ridge Modern Villa",
      propertyType: "Villa",
      price: 2850000,
      summary: "Architectural hillside residence with panoramic city views and seamless indoor-outdoor living.",
      description:
        "Sunset Ridge Modern Villa combines bold architecture with warm natural finishes, offering expansive glazing, a sculpted pool terrace, and a chef-grade kitchen built for entertaining. The primary suite opens to a private balcony, while flexible guest rooms make the home equally strong for everyday living and weekend hosting.",
      address: "Sunset Plaza, Los Angeles, CA",
      mapUrl: "https://maps.google.com/?q=Sunset+Plaza+Los+Angeles+CA",
      bedrooms: 5,
      bathrooms: 4.5,
      area: 4820,
      areaUnit: "sq ft",
      listingStatus: ListingStatus.AVAILABLE,
      visibility: ListingVisibility.PUBLISHED,
      featured: true,
      images: [
        "/demo/villa-1.svg",
        "/demo/villa-2.svg",
        "/demo/villa-3.svg",
      ],
    },
    {
      slug: "brentwood-garden-residence",
      title: "Brentwood Garden Residence",
      propertyType: "Single Family",
      price: 1940000,
      summary: "A calm, light-filled family home with mature landscaping and a generous entertaining patio.",
      description:
        "This Brentwood residence is designed for easy California living, with a soft neutral palette, open-plan social spaces, and a landscaped backyard that feels both private and welcoming. Updated baths, elegant built-ins, and a detached studio add practical flexibility.",
      address: "Brentwood, Los Angeles, CA",
      mapUrl: "https://maps.google.com/?q=Brentwood+Los+Angeles+CA",
      bedrooms: 4,
      bathrooms: 3,
      area: 3260,
      areaUnit: "sq ft",
      listingStatus: ListingStatus.PENDING,
      visibility: ListingVisibility.PUBLISHED,
      featured: true,
      images: [
        "/demo/garden-1.svg",
        "/demo/garden-2.svg",
        "/demo/garden-3.svg",
      ],
    },
    {
      slug: "coastal-loft-hideaway",
      title: "Coastal Loft Hideaway",
      propertyType: "Condo",
      price: 1180000,
      summary: "Refined open-plan loft near the coast with curated finishes and sun-washed interiors.",
      description:
        "Coastal Loft Hideaway offers a boutique alternative to larger developments, pairing high ceilings and oversized windows with subtle oak detailing, a custom kitchen, and a spacious primary retreat. Ideal for buyers seeking style, simplicity, and walkable convenience.",
      address: "Santa Monica, CA",
      mapUrl: "https://maps.google.com/?q=Santa+Monica+CA",
      bedrooms: 2,
      bathrooms: 2,
      area: 1680,
      areaUnit: "sq ft",
      listingStatus: ListingStatus.SOLD,
      visibility: ListingVisibility.PUBLISHED,
      featured: false,
      images: [
        "/demo/loft-1.svg",
        "/demo/loft-2.svg",
        "/demo/loft-3.svg",
      ],
    },
  ];

  for (const listing of listings) {
    const { images, ...listingData } = listing;

    await prisma.listing.create({
      data: {
        ...listingData,
        contactName: "Olivia Carter",
        contactEmail: process.env.ADMIN_EMAIL ?? "agent@northpoint.com",
        contactPhone: "+1 (310) 555-0148",
        contactWhatsapp: "+13105550148",
        officeAddress: "1450 Sunset Plaza Drive, Los Angeles, CA",
        images: {
          create: images.map((url, index) => ({
            url,
            altText: listing.title,
            position: index,
            isCover: index === 0,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
