import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getRuntimeDatabaseUrl() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DIRECT_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!connectionString) {
    throw new Error(
      "Missing Postgres connection string. Set DATABASE_URL, POSTGRES_URL, DIRECT_URL, POSTGRES_URL_NON_POOLING, or POSTGRES_PRISMA_URL in your local environment.",
    );
  }

  return connectionString;
}

const rawConnectionString = getRuntimeDatabaseUrl();
const connectionString = rawConnectionString.includes("uselibpqcompat=true")
  ? rawConnectionString
  : `${rawConnectionString}${rawConnectionString.includes("?") ? "&" : "?"}uselibpqcompat=true`;

const adapter = new PrismaNeon({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
