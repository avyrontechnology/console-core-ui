import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/partners", label: "Partners" },
  { href: "/roles", label: "Roles" },
  { href: "/plans", label: "Plans" },
  { href: "/orders", label: "Orders" },
  { href: "/wallet", label: "Wallet" },
  { href: "/entitlements", label: "Entitlements" },
  { href: "/grace", label: "Grace" },
  { href: "/payments", label: "Payments" },
  { href: "/partner-meta", label: "Partner Meta" },
  { href: "/api-keys", label: "API Keys" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r p-4">
        <p className="mb-4 font-semibold">Console Core</p>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-2 py-1 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
