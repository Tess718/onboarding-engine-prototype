import Link from "next/link";

export default function DocumentsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div className="border-b border-[var(--color-border)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
          Nothing to see here 
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/documents/vision"
          className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 hover:border-[var(--color-primary)] transition-all shadow-sm"
        >
          <span className="text-xl">📖</span>
          <h3 className="mt-3 font-semibold group-hover:text-[var(--color-primary)] transition-colors">
            Vision &amp; Mission
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Read about our core principles, mission statement, and long-term organizational direction.
          </p>
        </Link>
      </div>
    </main>
  );
}
