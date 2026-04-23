import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const prismaUrl =
  process.env.DIRECT_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: prismaUrl || env("DIRECT_URL"),
  },
});
