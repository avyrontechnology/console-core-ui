import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-950 via-brand-900 to-slate-900 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-surface/95 p-8 shadow-raised backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            CC
          </span>
          <div>
            <p className="text-base font-semibold text-slate-900">Console Core</p>
            <p className="text-xs text-slate-500">Sign in to continue</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
