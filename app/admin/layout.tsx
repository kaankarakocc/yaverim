import Link           from "next/link";
import { headers }    from "next/headers";
import { auth }        from "@/auth";
import { adminEnvLabel } from "@/lib/admin/guard";

interface AdminLayoutProps { children: React.ReactNode }

const NAV_LINKS = [
  { href: "/admin",               label: "Genel Bakış"    },
  { href: "/admin/discovery",     label: "Keşif Kuyruğu"  },
  { href: "/admin/tools",         label: "Araçlar"        },
  { href: "/admin/revenue",       label: "Gelir"          },
  { href: "/admin/rankings",      label: "Sıralamalar"    },
  { href: "/admin/debug",         label: "Debug"          },
];

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();
  const userEmail = session?.user?.email ?? null;
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? hdrs.get("x-invoke-path") ?? "";

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-20 border-b"
        style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

          {/* Brand + Nav */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#2563eb" }}
              >
                Y
              </div>
              <span className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                Yaverim
              </span>
              <span className="text-sm" style={{ color: "#94a3b8" }}>/</span>
              <span className="text-sm font-medium" style={{ color: "#64748b" }}>Admin</span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={isActive
                      ? { backgroundColor: "#eff6ff", color: "#2563eb" }
                      : { color: "#64748b" }
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {userEmail && (
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: "#2563eb" }}
                >
                  {userEmail[0].toUpperCase()}
                </div>
                <span className="text-xs" style={{ color: "#64748b" }}>{userEmail}</span>
              </div>
            )}
            <span
              className="text-xs font-mono px-2 py-1 rounded-md"
              style={{ background: "#f1f5f9", color: "#64748b" }}
            >
              {adminEnvLabel()}
            </span>
            <Link
              href="/"
              className="text-sm transition-colors"
              style={{ color: "#64748b" }}
            >
              ← Siteye dön
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
