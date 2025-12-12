import { Suspense } from "react";
import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-slate-600">Loading signup...</div>}
    >
      <SignupForm />
    </Suspense>
  );
}
