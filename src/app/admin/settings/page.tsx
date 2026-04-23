import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/forms/settings-form";
import { requireAdmin } from "@/lib/auth";
import { getAgentProfile } from "@/lib/queries";

type Props = {
  searchParams: Promise<{ success?: string }>;
};

export default async function AdminSettingsPage({ searchParams }: Props) {
  await requireAdmin();
  const [agent, params] = await Promise.all([getAgentProfile(), searchParams]);

  if (!agent) {
    throw new Error("Admin profile not found.");
  }

  return (
    <AdminShell
      title="Agent Settings"
      description="Manage the default contact information and biography used across listings and public pages."
      currentPath="/admin/settings"
      notice={
        params.success === "settings-saved" ? (
          <AdminNotice type="success" message="Agent settings updated successfully." />
        ) : undefined
      }
    >
      <SettingsForm agent={agent} />
    </AdminShell>
  );
}
