import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { UploaderClient } from "./uploader-client";

export default async function AdminUploadsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?next=/admin/uploads");
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Admin
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          Upload product images
        </h1>
        <p className="text-sm text-slate-600">
          Uploads use Cloudflare R2 via presigned URLs.
        </p>
      </div>
      <UploaderClient />
    </div>
  );
}
