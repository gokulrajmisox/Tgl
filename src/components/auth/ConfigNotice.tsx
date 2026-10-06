/**
 * Clearly marked configuration state shown whenever Supabase credentials
 * are missing. Never fakes authentication — the forms stay disabled.
 */
export function ConfigNotice({ context = "sign in" }: { context?: string }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-sm text-amber-900"
    >
      <p className="font-medium">Authentication isn&apos;t configured yet</p>
      <p className="mt-1 text-[13px] leading-relaxed text-amber-800">
        You can&apos;t {context} until Supabase credentials are added. Copy{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[12px]">
          .env.example
        </code>{" "}
        to{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[12px]">
          .env.local
        </code>{" "}
        and fill in <code className="font-mono text-[12px]">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
        and <code className="font-mono text-[12px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
        then run the SQL in{" "}
        <code className="font-mono text-[12px]">supabase/migrations</code>.
      </p>
    </div>
  );
}
