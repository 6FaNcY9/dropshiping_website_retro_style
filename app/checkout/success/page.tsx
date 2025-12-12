export default function CheckoutSuccess() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-900 shadow-sm">
      <h1 className="text-2xl font-bold">Payment successful</h1>
      <p className="mt-2 text-sm">
        Thanks for your order. We sent a confirmation email and will notify you
        when your items ship.
      </p>
    </div>
  );
}
