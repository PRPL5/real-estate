import { redirectIfAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/forms/login-form";

export default async function AdminLoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="min-h-screen bg-[#f3efe9]">
      <div className="page-section grid min-h-screen items-center py-16 lg:grid-cols-[1fr_0.8fr]">
        <div className="max-w-2xl space-y-6">
          <p className="eyebrow">Secure Admin Access</p>
          <h1 className="display-title text-6xl leading-none text-[#171717]">One dashboard for one agent.</h1>
          <p className="max-w-xl text-lg leading-8 text-[#5e5851]">
            This admin area is reserved for the independent real estate agent only. Public visitors do not have accounts, logins, or dashboards.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
