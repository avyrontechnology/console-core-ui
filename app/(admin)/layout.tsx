export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r p-4">
        <p className="font-semibold">Console Core</p>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
