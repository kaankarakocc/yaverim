import Link          from "next/link";
import type { Metadata } from "next";
import { getTools }     from "@/lib/tools/store";
import { getQueueStats, getPendingItems } from "@/lib/discovery/queue-store";

export const metadata: Metadata = {
  title: "Admin — Yaverim",
  robots: { index: false, follow: false },
};

export default function AdminDashboard() {
  const tools = getTools();
  const qstats  = getQueueStats();
  const pending = getPendingItems().slice(0, 5);

  const core      = getTools().filter(t => t.status === "core"     ).length;
  const priority  = getTools().filter(t => t.status === "priority" ).length;
  const affiliate = getTools().filter(t => t.hasAffiliate          ).length;
  const freeTool  = getTools().filter(t => t.hasFree               ).length;

  return (
    <div className="flex flex-col gap-8">

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>Genel Bakış</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Sistem durumu, keşif kuyruğu ve hızlı eylemler
        </p>
      </div>

      {/* Alert — pending reviews */}
      {qstats.pending > 0 && (
        <div
          className="flex items-center justify-between rounded-xl px-5 py-4 border"
          style={{ background: "#fffbeb", borderColor: "#fcd34d" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: "#fef3c7" }}
            >
              ◈
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#92400e" }}>
                {qstats.pending} yeni araç inceleme bekliyor
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#b45309" }}>
                Sistem otomatik tarama yaptı — onaylaman veya reddetmen gerekiyor.
              </p>
            </div>
          </div>
          <Link
            href="/admin/discovery"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: "#f59e0b", color: "#ffffff" }}
          >
            Kuyruğa git →
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Toplam Araç"      value={getTools().length}     icon="⊞" color="#2563eb" />
        <StatCard label="Core / Priority"  value={core + priority}  icon="★" color="#16a34a" />
        <StatCard label="Affiliate Araç"   value={affiliate}        icon="⇗" color="#7c3aed" />
        <StatCard label="Ücretsiz Plan"    value={freeTool}         icon="◎" color="#0891b2" />
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Discovery queue summary */}
        <div
          className="rounded-xl border p-5 flex flex-col gap-4"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Keşif Kuyruğu</h2>
            <Link href="/admin/discovery" className="text-xs font-medium" style={{ color: "#2563eb" }}>
              Tümünü gör →
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Bekliyor", value: qstats.pending,  bg: "#fffbeb", color: "#92400e" },
              { label: "Onaylandı", value: qstats.approved, bg: "#f0fdf4", color: "#166534" },
              { label: "Reddedildi", value: qstats.rejected, bg: "#fef2f2", color: "#991b1b" },
              { label: "Bilgi Lazım", value: qstats.needsInfo, bg: "#f8fafc", color: "#475569" },
            ].map(s => (
              <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: s.bg }}>
                <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.label}</p>
              </div>
            ))}
          </div>

          {qstats.lastScanAt ? (
            <p className="text-xs" style={{ color: "#94a3b8" }}>
              Son tarama: {new Date(qstats.lastScanAt).toLocaleString("tr-TR")}
            </p>
          ) : (
            <p className="text-xs" style={{ color: "#94a3b8" }}>
              Henüz tarama yapılmadı — kuyruğa git ve "Şimdi Tara" butonunu kullan.
            </p>
          )}

          {/* Latest pending items */}
          {pending.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: "#f1f5f9" }}>
              <p className="text-xs font-medium" style={{ color: "#64748b" }}>Son bulunanlar</p>
              {pending.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#0f172a" }}>{item.name}</p>
                    <p className="text-xs truncate" style={{ color: "#94a3b8" }}>
                      {item.source} · {item.suggestedCategory}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#fffbeb", color: "#92400e" }}
                  >
                    Bekliyor
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div
          className="rounded-xl border p-5 flex flex-col gap-3"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
        >
          <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Hızlı Eylemler</h2>

          <QuickLink
            href="/admin/discovery"
            label="Keşif Kuyruğunu Aç"
            description="Bekleyen araçları incele, onayla veya reddet"
            badge={qstats.pending > 0 ? String(qstats.pending) : undefined}
            badgeColor="#f59e0b"
          />
          <QuickLink
            href="/admin/tools"
            label="Araç Kataloğunu Yönet"
            description="Aktif araçları görüntüle, düzenle veya kaldır"
          />
          <QuickLink
            href="/admin/rankings"
            label="Sıralamaları Yenile"
            description="Haftalık / aylık top listelerini güncelle"
          />
          <QuickLink
            href="/admin/debug"
            label="Öneri Motoru Debug"
            description="Senaryo bazlı öneri kalitesini test et"
          />

          <div
            className="rounded-lg p-3 border mt-1"
            style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
          >
            <p className="text-xs font-semibold" style={{ color: "#0f172a" }}>Otomasyon Durumu</p>
            <div className="flex flex-col gap-1.5 mt-2">
              <AutoRow label="Günlük Keşif Taraması" schedule="Her gün 08:00 UTC" active />
              <AutoRow label="Haftalık Sıralama Güncelleme" schedule="Her Pazartesi 03:00 UTC" active />
            </div>
          </div>
        </div>
      </div>

      {/* Tool lifecycle breakdown */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Araç Lifecycle Dağılımı</h2>
          <Link href="/admin/tools" className="text-xs font-medium" style={{ color: "#2563eb" }}>
            Tüm araçlar →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["priority","core","tracked","candidate","deprecated"] as const).map(status => {
            const count = getTools().filter(t => t.status === status).length;
            const meta = STATUS_META[status];
            return (
              <div
                key={status}
                className="rounded-lg p-3 border text-center"
                style={{ background: meta.bg, borderColor: meta.border }}
              >
                <p className="text-2xl font-bold tabular-nums" style={{ color: meta.color }}>{count}</p>
                <p className="text-xs mt-1 font-medium capitalize" style={{ color: meta.color }}>{status}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const STATUS_META = {
  priority:   { bg: "#f0fdf4", border: "#bbf7d0", color: "#166534" },
  core:       { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
  tracked:    { bg: "#f8fafc", border: "#e2e8f0", color: "#475569" },
  candidate:  { bg: "#fffbeb", border: "#fde68a", color: "#92400e" },
  deprecated: { bg: "#fff1f2", border: "#fecdd3", color: "#9f1239" },
};

function StatCard({ label, value, icon, color }: {
  label: string; value: number; icon: string; color: string;
}) {
  return (
    <div
      className="rounded-xl border p-4 transition-shadow hover:shadow-sm"
      style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3"
        style={{ background: color + "15" }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums" style={{ color: "#0f172a" }}>{value}</p>
      <p className="text-xs mt-1 font-medium" style={{ color: "#64748b" }}>{label}</p>
    </div>
  );
}

function QuickLink({ href, label, description, badge, badgeColor }: {
  href: string; label: string; description: string; badge?: string; badgeColor?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-4 py-3 border transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm group"
      style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium group-hover:text-blue-700 transition-colors" style={{ color: "#0f172a" }}>
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{description}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {badge && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: badgeColor! + "22", color: badgeColor }}
          >
            {badge}
          </span>
        )}
        <span className="transition-transform group-hover:translate-x-0.5" style={{ color: "#94a3b8" }}>→</span>
      </div>
    </Link>
  );
}

function AutoRow({ label, schedule, active }: { label: string; schedule: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: active ? "#22c55e" : "#d1d5db" }}
        />
        <span style={{ color: "#334155" }}>{label}</span>
      </div>
      <span style={{ color: "#94a3b8" }}>{schedule}</span>
    </div>
  );
}




