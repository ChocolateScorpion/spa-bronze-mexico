"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeModules, business } from "@/lib/business";

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function AgendaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  );
}

function CobrosIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" />
      <circle cx="7" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ClientesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M15.5 14c2.9.4 5 2.6 5 6" />
    </svg>
  );
}

function ReportesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
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
      <aside
        className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:h-screen md:sticky md:top-0"
        style={{
          background: "var(--color-fondo, #fdfaf5)",
          borderRight: "1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)",
        }}
      >
        {/* Logo / Encabezado */}
        <div className="px-5 py-6">
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ background: "color-mix(in srgb, var(--color-primary) 08%, transparent)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[11px] tracking-tight flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-acento, #8B6914) 100%)" }}
            >
              SB
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold tracking-tight truncate" style={{ color: "var(--color-texto, #1a1208)" }}>
                {business.nombre}
              </p>
              {business.slogan && (
                <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--color-primary)" }}>
                  {business.slogan}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 30%, transparent)" }}>
            Módulos
          </p>
          {activeModules.map((mod) => {
            const Icon = MODULE_ICONS[mod.key];
            const active = isActive(mod.href);
            return (
              <Link
                key={mod.key}
                href={mod.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={
                  active
                    ? {
                        background: "var(--color-primary)",
                        color: "#fff",
                        fontWeight: 600,
                        boxShadow: "0 2px 12px color-mix(in srgb, var(--color-primary) 35%, transparent)",
                      }
                    : {
                        color: "color-mix(in srgb, var(--color-texto, #1a1208) 50%, transparent)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--color-primary) 08%, transparent)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-texto, #1a1208)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "";
                    (e.currentTarget as HTMLElement).style.color = "color-mix(in srgb, var(--color-texto, #1a1208) 50%, transparent)";
                  }
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{mod.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Pie */}
        <div
          className="px-5 py-4 flex items-center gap-2"
          style={{ borderTop: "1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ color: "var(--color-primary)" }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "color-mix(in srgb, var(--color-primary) 55%, transparent)" }}>
            Cero Stack Studio
          </span>
        </div>
      </aside>

      {/* Barra móvil */}
      <nav
        className="md:hidden sticky top-0 z-10 flex items-center gap-1 overflow-x-auto px-3 py-2.5"
        style={{
          background: "var(--color-fondo, #fdfaf5)",
          borderBottom: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
          backdropFilter: "blur(8px)",
        }}
      >
        {activeModules.map((mod) => {
          const Icon = MODULE_ICONS[mod.key];
          const active = isActive(mod.href);
          return (
            <Link
              key={mod.key}
              href={mod.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all"
              style={
                active
                  ? {
                      background: "var(--color-primary)",
                      color: "#fff",
                      fontWeight: 600,
                      boxShadow: "0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)",
                    }
                  : { color: "color-mix(in srgb, var(--color-texto, #1a1208) 50%, transparent)" }
              }
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
