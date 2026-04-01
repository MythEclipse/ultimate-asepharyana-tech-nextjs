import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background text-foreground">
      <div className="max-w-lg w-full rounded-3xl border border-border/20 bg-card/40 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">404</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight">Page Not Found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The requested page could not be located. Please verify the URL or return to the main page.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
