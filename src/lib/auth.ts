import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "agent_session";
const ONE_WEEK = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  email: string;
  role: "agent";
};

function getJwtSecret() {
  return process.env.ADMIN_JWT_SECRET ?? "local-dev-secret-change-me";
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) return null;

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) return null;

  return admin;
}

export async function createAdminSession(userId: string, email: string) {
  const token = jwt.sign(
    {
      sub: userId,
      email,
      role: "agent",
    } satisfies SessionPayload,
    getJwtSecret(),
    { expiresIn: ONE_WEEK },
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session?.sub) {
    redirect("/admin/login");
  }

  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getAdminSession();
  if (session?.sub) {
    redirect("/admin/dashboard");
  }
}
