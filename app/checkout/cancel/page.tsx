import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-900 shadow-sm">
      <h1 className="text-2xl font-bold">Checkout canceled</h1>
      <p className="mt-2 text-sm">
        Feel free to keep browsing and try again when you are ready.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-white shadow hover:bg-brand-700"
      >
        Back to home
      </Link>
    </div>
  );
}
