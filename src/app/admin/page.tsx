import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  redirect(session ? "/admin/dashboard" : "/admin/login");
}
