"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", group: "Overview" },
  { href: "/users", label: "Users", group: "Access" },
  { href: "/partners", label: "Partners", group: "Access" },
  { href: "/roles", label: "Roles", group: "Access" },
  { href: "/user-configs", label: "User Configs", group: "Access" },
  { href: "/plans", label: "Plans", group: "Billing" },
  { href: "/orders", label: "Orders", group: "Billing" },
  { href: "/wallet", label: "Wallet", group: "Billing" },
  { href: "/payments", label: "Payments", group: "Billing" },
  { href: "/entitlements", label: "Entitlements", group: "Billing" },
  { href: "/grace", label: "Grace", group: "Billing" },
  { href: "/partner-meta", label: "Partner Meta", group: "Platform" },
  { href: "/api-keys", label: "API Keys", group: "Platform" },
  { href: "/notifications", label: "Notifications", group: "Platform" },
  { href: "/audit-logs", label: "Audit Logs", group: "Platform" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const groups = NAV.reduce<Record<string, typeof NAV>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-brand-950/40 bg-brand-950 text-slate-300">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
          CC
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Console Core</p>
          <p className="text-xs text-brand-300">Administration</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-300/80">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-brand-600 font-medium text-white shadow-sm"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-3 text-xs text-brand-300/80">
        Signed in as superadmin
      </div>
    </aside>
  );
}
