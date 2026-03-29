import Link          from "next/link";
import type { Metadata } from "next";
import { getTools }     from "@/lib/tools/store";
import { ToolLogo }  from "@/components/common/ToolLogo";
import type { ToolLifecycleStatus } from "@/data/schemas/tool";

export const metadata: Metadata = {
  title: "Araç Kataloğu — Admin",
  robots: { index: false, follow: false },
};

const STATUS_STYLE: Record<ToolLifecycleStatus, { bg: string; color: string }> = {
  priority:   { bg: "#f0fdf4", color: "#166534" },
  core:       { bg: "#eff6ff", color: "#1d4ed8" },
  tracked:    { bg: "#f8fafc", color: "#475569" },
  candidate:  { bg: "#fffbeb", color: "#92400e" },
  deprecated: { bg: "#fff1f2", color: "#9f1239" },
};

export default function AdminToolsPage() {
  const sorted = [...getTools()].sort((a, b) => {
    const ORDER: ToolLifecycleStatus[] = ["priority","core","tracked","candidate","deprecated"];
    const diff = ORDER.indexOf(a.status) - ORDER.indexOf(b.status);
    if (diff !== 0) return diff;
    return b.editorialScore - a.editorialScore;
  });

  const byStatus = getTools().reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>Araç Kataloğu</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {getTools().length} aktif araç · Lifecycle yönetimi ve skor takibi
          </p>
        </div>
        <Link
          href="/admin/tools/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "#2563eb", color: "#ffffff" }}
        >
          + Yeni Araç Ekle
        </Link>
      </div>

      {/* Lifecycle summary */}
      <div className="grid grid-cols-5 gap-3">
        {(["priority","core","tracked","candidate","deprecated"] as ToolLifecycleStatus[]).map(s => (
          <div
            key={s}
            className="rounded-xl border p-3 text-center"
            style={{ background: STATUS_STYLE[s].bg, borderColor: STATUS_STYLE[s].color + "33" }}
          >
            <p className="text-2xl font-bold tabular-nums" style={{ color: STATUS_STYLE[s].color }}>
              {byStatus[s] ?? 0}
            </p>
            <p className="text-xs mt-0.5 capitalize font-medium" style={{ color: STATUS_STYLE[s].color }}>
              {s}
            </p>
          </div>
        ))}
      </div>

      {/* Tool table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {["Araç", "Kategori", "Status", "Skor", "Türkçe", "Ücretsiz", "Affiliate", "Eylem"].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#64748b" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((tool, i) => {
                const ss = STATUS_STYLE[tool.status];
                return (
                  <tr
                    key={tool.slug}
                    style={{ borderBottom: i < sorted.length - 1 ? "1px solid #f1f5f9" : "none" }}
                  >
                    {/* Tool name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <ToolLogo name={tool.name} websiteUrl={tool.websiteUrl} size={28} />
                        <div>
                          <p className="font-semibold" style={{ color: "#0f172a" }}>{tool.name}</p>
                          <p className="text-[10px] font-mono" style={{ color: "#94a3b8" }}>{tool.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-xs" style={{ color: "#64748b" }}>{tool.category}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                        style={{ background: ss.bg, color: ss.color }}
                      >
                        {tool.status}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: 40,
                            background: "#e2e8f0",
                          }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(tool.editorialScore / 10) * 100}%`,
                              background: tool.editorialScore >= 8.5 ? "#16a34a"
                                        : tool.editorialScore >= 7   ? "#2563eb"
                                        : "#f59e0b",
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono" style={{ color: "#334155" }}>
                          {tool.editorialScore.toFixed(1)}
                        </span>
                      </div>
                    </td>

                    {/* Turkish */}
                    <td className="px-4 py-3">
                      <TurkishBadge level={tool.turkishSupport} />
                    </td>

                    {/* Free */}
                    <td className="px-4 py-3">
                      <BoolDot value={tool.hasFree} />
                    </td>

                    {/* Affiliate */}
                    <td className="px-4 py-3">
                      <BoolDot value={tool.hasAffiliate} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/getTools()/${tool.slug}`}
                          target="_blank"
                          className="text-xs px-2 py-1 rounded border"
                          style={{ borderColor: "#e2e8f0", color: "#64748b" }}
                        >
                          Görüntüle
                        </Link>
                        <Link
                          href={`/admin/debug?slug=${tool.slug}`}
                          className="text-xs px-2 py-1 rounded border"
                          style={{ borderColor: "#bfdbfe", color: "#2563eb", background: "#eff6ff" }}
                        >
                          Debug
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ background: "#fffbeb", borderColor: "#fde68a" }}
      >
        <p className="font-semibold mb-1" style={{ color: "#92400e" }}>Araç Düzenleme</p>
        <p style={{ color: "#b45309" }}>
          Araçları doğrudan <code className="font-mono">data/seed/getTools().ts</code> dosyasından düzenle.
          Yeni araç eklemek için "Yeni Araç Ekle" butonunu kullan — seed snippet otomatik üretilir.
          Lifecycle durumu değiştirmek için <code className="font-mono">status</code> alanını güncelle.
        </p>
      </div>

    </div>
  );
}

function BoolDot({ value }: { value: boolean }) {
  return (
    <div
      className="w-2 h-2 rounded-full"
      style={{ background: value ? "#22c55e" : "#e2e8f0" }}
    />
  );
}

function TurkishBadge({ level }: { level: string }) {
  const meta: Record<string, { bg: string; color: string; label: string }> = {
    full:    { bg: "#f0fdf4", color: "#166534", label: "Tam" },
    partial: { bg: "#fffbeb", color: "#92400e", label: "Kısmi" },
    none:    { bg: "#f8fafc", color: "#94a3b8", label: "Yok" },
  };
  const m = meta[level] ?? meta.none;
  return (
    <span
      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
      style={{ background: m.bg, color: m.color }}
    >
      {m.label}
    </span>
  );
}





