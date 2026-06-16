"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeModules, business } from "@/lib/business";

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function AgendaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  );
}

function CobrosIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" />
      <circle cx="7" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ClientesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M15.5 14c2.9.4 5 2.6 5 6" />
    </svg>
  );
}

function ReportesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
      <path d="M2 20h20" />
    </svg>
  );
}

const MODULE_ICONS: Record<string, (props: { className?: string }) => React.JSX.Element> = {
  dashboard: DashboardIcon,
  agenda: AgendaIcon,
  cobros: CobrosIcon,
  clientes: ClientesIcon,
  reportes: ReportesIcon,
};

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:h-screen md:sticky md:top-0 border-r border-black/5 bg-white">
        <div className="px-5 py-6">
          <p className="text-lg font-semibold text-[var(--color-primary)]">{business.nombre}</p>
          <p className="text-xs text-gray-400 capitalize">{business.giro}</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {activeModules.map((mod) => {
            const Icon = MODULE_ICONS[mod.key];
            const active = isActive(mod.href);
            return (
              <Link
                key={mod.key}
                href={mod.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-gray-600 hover:bg-[var(--color-secondary)]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {mod.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 text-xs text-gray-400 border-t border-black/5">
          Construido con Cero Stack
        </div>
      </aside>

      {/* Barra de navegación móvil */}
      <nav className="md:hidden sticky top-0 z-10 flex items-center gap-1 overflow-x-auto border-b border-black/5 bg-white px-3 py-2">
        {activeModules.map((mod) => {
          const Icon = MODULE_ICONS[mod.key];
          const active = isActive(mod.href);
          return (
            <Link
              key={mod.key}
              href={mod.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-600 hover:bg-[var(--color-secondary)]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {mod.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
