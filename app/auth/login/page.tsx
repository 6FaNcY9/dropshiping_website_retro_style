import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-slate-600">Loading login...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
