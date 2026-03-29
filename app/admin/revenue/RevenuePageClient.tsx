"use client";

import { useState } from "react";
import type { RevenueStats, Purchase, Sponsorship } from "@/lib/revenue/types";
import type { Tool } from "@/data/schemas/tool";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface AffiliateToolRow {
  slug:         string;
  name:         string;
  category:     string;
  websiteUrl:   string;
  affiliateUrl: string | null;
  pricingLabel: string;
  status:       string;
}

interface Props {
  stats:          RevenueStats;
  allPurchases:   Purchase[];
  sponsorships:   Sponsorship[];
  toolNames:      Record<string, string>;
  affiliateTools: AffiliateToolRow[];
}

type Tab = "overview" | "purchases" | "affiliates" | "affiliate-tools" | "sponsorships";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const USD = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);

const DATE = (s: string) =>
  new Date(s).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });

const DATETIME = (s: string) =>
  new Date(s).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const TYPE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  "one-time":     { bg: "#eff6ff", color: "#1d4ed8", label: "Tek Seferlik" },
  "subscription": { bg: "#f0fdf4", color: "#166534", label: "Abonelik" },
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  completed: { bg: "#f0fdf4", color: "#166534" },
  refunded:  { bg: "#fef2f2", color: "#991b1b" },
  failed:    { bg: "#fff1f2", color: "#9f1239" },
  pending:   { bg: "#fffbeb", color: "#92400e" },
};

const SPONSOR_TIER_LABEL: Record<string, string> = {
  "featured":        "Öne Çıkan",
  "top-placement":   "Üst Yerleşim",
  "category-leader": "Kategori Lideri",
  "badge-only":      "Rozet",
};

const SPONSOR_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:  { bg: "#f0fdf4", color: "#166534" },
  paused:  { bg: "#fffbeb", color: "#92400e" },
  expired: { bg: "#f8fafc", color: "#94a3b8" },
  pending: { bg: "#eff6ff", color: "#1d4ed8" },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

export function RevenuePageClient({ stats, allPurchases, sponsorships, toolNames, affiliateTools }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  /* Sponsorship form state */
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [sponsorList, setSponsorList] = useState<Sponsorship[]>(sponsorships);
  const [sponsorForm, setSponsorForm] = useState({
    toolSlug: "", toolName: "", tier: "featured" as Sponsorship["tier"],
    amountUsd: 0, billingType: "monthly" as "monthly"|"one-time",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "", notes: "",
  });
  const [sponsorSaving, setSponsorSaving] = useState(false);

  async function handleCreateSponsor(e: React.FormEvent) {
    e.preventDefault();
    setSponsorSaving(true);
    const res  = await fetch("/api/admin/revenue/sponsorships", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sponsorForm, endDate: sponsorForm.endDate || null }),
    });
    const data = await res.json() as { sponsorship: Sponsorship };
    setSponsorList(prev => [data.sponsorship, ...prev]);
    setShowSponsorForm(false);
    setSponsorSaving(false);
  }

  async function handleSponsorStatus(id: string, status: Sponsorship["status"]) {
    const res  = await fetch("/api/admin/revenue/sponsorships", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json() as { sponsorship: Sponsorship };
    setSponsorList(prev => prev.map(s => s.id === id ? data.sponsorship : s));
  }

  async function handleSponsorDelete(id: string) {
    if (!confirm("Sponsorluğu kalıcı olarak sil?")) return;
    await fetch(`/api/admin/revenue/sponsorships?id=${id}`, { method: "DELETE" });
    setSponsorList(prev => prev.filter(s => s.id !== id));
  }

  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: "overview",        label: "Genel Bakış"           },
    { key: "purchases",       label: "Satın Alımlar",        badge: allPurchases.length },
    { key: "affiliates",      label: "Affiliate Tıklamalar", badge: stats.totalAffClicks },
    { key: "affiliate-tools", label: "Affiliate Araçlar",    badge: affiliateTools.length },
    { key: "sponsorships",    label: "Sponsorlar",           badge: stats.activeSponsorships },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>Gelir Yönetimi</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Satın alımlar · Affiliate tıklamalar · Sponsorlu ürünler
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b" style={{ borderColor: "#e2e8f0" }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={{
              borderColor: tab === t.key ? "#2563eb" : "transparent",
              color:       tab === t.key ? "#2563eb" : "#64748b",
            }}
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: tab === t.key ? "#dbeafe" : "#f1f5f9", color: tab === t.key ? "#1d4ed8" : "#64748b" }}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="flex flex-col gap-6">

          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KpiCard label="Toplam Gelir"    value={USD(stats.totalRevenueUsd)}   sub="tüm zamanlar"  color="#16a34a" />
            <KpiCard label="Aylık Tekrarlayan" value={USD(stats.monthlyRecurring)} sub="MRR tahmin"  color="#2563eb" />
            <KpiCard label="Aktif Abone"     value={String(stats.activeSubscriptions)} sub="abonelik" color="#7c3aed" />
            <KpiCard label="Affiliate Tıklama" value={String(stats.totalAffClicks)} sub="toplam"    color="#0891b2" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <KpiCard label="Tek Seferlik Satış" value={String(stats.oneTimePurchases)}  sub={USD(stats.oneTimePurchases * 2.99)} color="#1d4ed8" />
            <KpiCard label="Sponsorlu Alan"     value={String(stats.activeSponsorships)} sub="aktif"  color="#d97706" />
            <KpiCard label="Sponsorluk Geliri"  value={USD(stats.sponsorshipRevenue)}   sub="aktif planlar" color="#d97706" />
          </div>

          {/* Top affiliate tools */}
          {stats.topClickedTools.length > 0 && (
            <div className="rounded-xl border p-5" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
              <p className="font-semibold text-sm mb-4" style={{ color: "#0f172a" }}>En Çok Tıklanan Araçlar</p>
              <div className="flex flex-col gap-2">
                {stats.topClickedTools.map((t, i) => {
                  const max = stats.topClickedTools[0]?.clicks ?? 1;
                  return (
                    <div key={t.slug} className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-right flex-shrink-0" style={{ color: "#94a3b8" }}>
                        {i + 1}
                      </span>
                      <span className="text-sm min-w-[140px]" style={{ color: "#334155" }}>{t.name}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(t.clicks / max) * 100}%`, background: "#2563eb" }}
                        />
                      </div>
                      <span className="text-sm font-mono flex-shrink-0" style={{ color: "#334155" }}>
                        {t.clicks}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent purchases */}
          {stats.recentPurchases.length > 0 && (
            <div className="rounded-xl border p-5" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
              <p className="font-semibold text-sm mb-4" style={{ color: "#0f172a" }}>Son Satın Alımlar</p>
              <PurchaseTable purchases={stats.recentPurchases} />
            </div>
          )}

          {stats.recentPurchases.length === 0 && stats.totalAffClicks === 0 && (
            <EmptyState
              icon="$"
              title="Henüz gelir verisi yok"
              description="Kullanıcılar satın alım yaptıkça veya araç linklerine tıkladıkça burada görünecek."
            />
          )}
        </div>
      )}

      {/* ── Purchases ── */}
      {tab === "purchases" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Tamamlanan"  value={allPurchases.filter(p => p.status === "completed").length}  color="#16a34a" />
            <MiniStat label="Tek Seferlik" value={allPurchases.filter(p => p.type === "one-time").length}    color="#2563eb" />
            <MiniStat label="Abonelik"     value={allPurchases.filter(p => p.type === "subscription").length} color="#7c3aed" />
          </div>

          {allPurchases.length === 0 ? (
            <EmptyState icon="🛒" title="Satın alım yok" description="Kullanıcılar Pro plan aldığında burada görünecek." />
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Tarih", "E-posta", "Tür", "Plan", "Tutar", "Durum", "Sağlayıcı"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#64748b" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allPurchases.map((p, i) => {
                      const ts = TYPE_STYLE[p.type]  ?? TYPE_STYLE["one-time"];
                      const ss = STATUS_STYLE[p.status] ?? STATUS_STYLE.pending;
                      return (
                        <tr key={p.id} style={{ borderBottom: i < allPurchases.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                          <td className="px-4 py-3 text-xs" style={{ color: "#64748b" }}>{DATETIME(p.createdAt)}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: "#334155" }}>{p.userEmail}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.color }}>{ts.label}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono" style={{ color: "#475569" }}>{p.planId}</td>
                          <td className="px-4 py-3 font-semibold" style={{ color: "#0f172a" }}>{USD(p.amountUsd)}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: ss.bg, color: ss.color }}>{p.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: "#94a3b8" }}>{p.provider}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Affiliates ── */}
      {tab === "affiliates" && (
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl border p-4 text-sm"
            style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}
          >
            <p className="font-semibold mb-1" style={{ color: "#1d4ed8" }}>Affiliate Takip Nasıl Çalışıyor?</p>
            <p style={{ color: "#3b82f6" }}>
              Kullanıcı bir aracın "Siteye git" linkine tıkladığında <code className="font-mono text-xs px-1 bg-blue-100 rounded">/api/track/outbound</code> üzerinden geçer, 
              tıklama loglanır ve kullanıcı yönlendirilir. Gelecekte her araç için gerçek komisyon oranları eklenebilir.
            </p>
          </div>

          {stats.totalAffClicks === 0 ? (
            <EmptyState icon="⇗" title="Henüz tıklama yok" description="Kullanıcılar araç linklerine tıkladığında burada görünecek." />
          ) : (
            <div className="rounded-xl border p-5" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
              <p className="font-semibold text-sm mb-4" style={{ color: "#0f172a" }}>
                Tıklama Sıralaması — Toplam {stats.totalAffClicks}
              </p>
              <div className="flex flex-col gap-3">
                {stats.topClickedTools.map((t, i) => {
                  const max = stats.topClickedTools[0]?.clicks ?? 1;
                  const toolName = toolNames[t.slug] ?? t.name;
                  return (
                    <div key={t.slug} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: i < 3 ? "#eff6ff" : "#f8fafc", color: i < 3 ? "#1d4ed8" : "#94a3b8" }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium min-w-[160px]" style={{ color: "#334155" }}>{toolName}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                        <div className="h-full rounded-full" style={{ width: `${(t.clicks / max) * 100}%`, background: "#2563eb" }} />
                      </div>
                      <span className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: "#0f172a" }}>
                        {t.clicks}
                      </span>
                      <span className="text-xs flex-shrink-0" style={{ color: "#94a3b8" }}>tıklama</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Affiliate Tools Catalog ── */}
      {tab === "affiliate-tools" && (
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl border p-4 text-sm"
            style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
          >
            <p className="font-semibold mb-1" style={{ color: "#166534" }}>
              Affiliate Ortaklığı Olan Araçlar — {affiliateTools.length} araç
            </p>
            <p style={{ color: "#16a34a" }}>
              Bunların affiliate URL'leri <code className="font-mono text-xs px-1 bg-green-100 rounded">/api/track/outbound</code> üzerinden takip edilir.
              Araç sayfasındaki "Siteye git" butonu affiliate linkine yönlenir.
            </p>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "#374151" }}>Araç</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "#374151" }}>Kategori</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "#374151" }}>Fiyatlama</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "#374151" }}>Durum</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "#374151" }}>Affiliate URL</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "#374151" }}>Site</th>
                </tr>
              </thead>
              <tbody>
                {affiliateTools.map((t, i) => (
                  <tr
                    key={t.slug}
                    style={{
                      borderBottom: i < affiliateTools.length - 1 ? "1px solid #f1f5f9" : "none",
                      background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: "#2563eb" }}
                        >
                          {t.name[0]}
                        </div>
                        <span className="font-medium" style={{ color: "#0f172a" }}>{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#64748b" }}>{t.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "#f0fdf4", color: "#166534" }}
                      >
                        {t.pricingLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: t.status === "active" ? "#f0fdf4" : "#fff7ed",
                          color:      t.status === "active" ? "#166534" : "#c2410c",
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {t.affiliateUrl ? (
                        <a
                          href={t.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono underline truncate block"
                          style={{ color: "#2563eb" }}
                        >
                          {t.affiliateUrl.replace(/^https?:\/\//, "").slice(0, 35)}…
                        </a>
                      ) : (
                        <span className="text-xs" style={{ color: "#94a3b8" }}>URL yok — genel site</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={t.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline"
                        style={{ color: "#64748b" }}
                      >
                        ↗ Siteyi gör
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs" style={{ color: "#94a3b8" }}>
            Yeni araç eklemek için <code className="font-mono px-1 bg-slate-100 rounded">data/seed/tools.ts</code> dosyasındaki
            ilgili araçta <code className="font-mono px-1 bg-slate-100 rounded">hasAffiliate: true</code> ve{" "}
            <code className="font-mono px-1 bg-slate-100 rounded">affiliateUrl: &quot;...&quot;</code> alanlarını doldur.
          </p>
        </div>
      )}

      {/* ── Sponsorships ── */}
      {tab === "sponsorships" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "#64748b" }}>
              {sponsorList.filter(s => s.status === "active").length} aktif sponsorluk
            </p>
            <button
              onClick={() => setShowSponsorForm(!showSponsorForm)}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "#2563eb", color: "#ffffff" }}
            >
              + Yeni Sponsorluk
            </button>
          </div>

          {/* Create form */}
          {showSponsorForm && (
            <form
              onSubmit={handleCreateSponsor}
              className="rounded-xl border p-5 flex flex-col gap-4"
              style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
            >
              <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>Yeni Sponsorluk Ekle</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Tool Slug" name="toolSlug" value={sponsorForm.toolSlug}
                  onChange={v => setSponsorForm(p => ({ ...p, toolSlug: v, toolName: v }))} required />
                <FormField label="Tool Adı" name="toolName" value={sponsorForm.toolName}
                  onChange={v => setSponsorForm(p => ({ ...p, toolName: v }))} required />
                <SelectField label="Tier" value={sponsorForm.tier}
                  options={[["featured","Öne Çıkan"],["top-placement","Üst Yerleşim"],["category-leader","Kategori Lideri"],["badge-only","Rozet"]]}
                  onChange={v => setSponsorForm(p => ({ ...p, tier: v as Sponsorship["tier"] }))} />
                <SelectField label="Fatura Tipi" value={sponsorForm.billingType}
                  options={[["monthly","Aylık"],["one-time","Tek Seferlik"]]}
                  onChange={v => setSponsorForm(p => ({ ...p, billingType: v as "monthly"|"one-time" }))} />
                <FormField label="Tutar (USD/ay)" name="amount" type="number" value={String(sponsorForm.amountUsd)}
                  onChange={v => setSponsorForm(p => ({ ...p, amountUsd: Number(v) }))} required />
                <FormField label="Başlangıç Tarihi" name="startDate" type="date" value={sponsorForm.startDate}
                  onChange={v => setSponsorForm(p => ({ ...p, startDate: v }))} required />
                <FormField label="Bitiş Tarihi (boş = süresiz)" name="endDate" type="date" value={sponsorForm.endDate}
                  onChange={v => setSponsorForm(p => ({ ...p, endDate: v }))} />
                <FormField label="Notlar" name="notes" value={sponsorForm.notes}
                  onChange={v => setSponsorForm(p => ({ ...p, notes: v }))} />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={sponsorSaving}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#16a34a", color: "#ffffff", opacity: sponsorSaving ? 0.6 : 1 }}>
                  {sponsorSaving ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button type="button" onClick={() => setShowSponsorForm(false)}
                  className="px-4 py-2 rounded-lg text-sm border"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                  İptal
                </button>
              </div>
            </form>
          )}

          {/* Sponsorship list */}
          {sponsorList.length === 0 ? (
            <EmptyState icon="◎" title="Sponsorluk yok" description="Araç şirketleriyle anlaşma yaptığında buraya ekle." />
          ) : (
            <div className="flex flex-col gap-3">
              {sponsorList.map(s => {
                const ss = SPONSOR_STATUS_STYLE[s.status] ?? SPONSOR_STATUS_STYLE.active;
                return (
                  <div key={s.id} className="rounded-xl border p-5" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold" style={{ color: "#0f172a" }}>{s.toolName}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: ss.bg, color: ss.color }}>{s.status}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#475569" }}>{SPONSOR_TIER_LABEL[s.tier] ?? s.tier}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: "#64748b" }}>
                          <span><strong style={{ color: "#0f172a" }}>{USD(s.amountUsd)}</strong> / {s.billingType === "monthly" ? "ay" : "tek seferlik"}</span>
                          <span>{DATE(s.startDate)} → {s.endDate ? DATE(s.endDate) : "Süresiz"}</span>
                        </div>
                        {s.notes && <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>{s.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {s.status === "active" && (
                          <button onClick={() => handleSponsorStatus(s.id, "paused")}
                            className="text-xs px-3 py-1.5 rounded-lg border"
                            style={{ borderColor: "#e2e8f0", color: "#f59e0b" }}>
                            Duraklat
                          </button>
                        )}
                        {s.status === "paused" && (
                          <button onClick={() => handleSponsorStatus(s.id, "active")}
                            className="text-xs px-3 py-1.5 rounded-lg border"
                            style={{ borderColor: "#bbf7d0", color: "#16a34a" }}>
                            Aktif Et
                          </button>
                        )}
                        <button onClick={() => handleSponsorDelete(s.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border"
                          style={{ borderColor: "#fecdd3", color: "#ef4444" }}>
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
      <p className="text-xs" style={{ color: "#64748b" }}>{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{sub}</p>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border p-3 text-center" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
      <p className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{label}</p>
    </div>
  );
}

function PurchaseTable({ purchases }: { purchases: Purchase[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
            {["Tarih", "E-posta", "Tür", "Tutar", "Durum"].map(h => (
              <th key={h} className="pb-2 text-left text-xs font-semibold" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {purchases.map((p, i) => {
            const ts = TYPE_STYLE[p.type]     ?? TYPE_STYLE["one-time"];
            const ss = STATUS_STYLE[p.status] ?? STATUS_STYLE.pending;
            return (
              <tr key={p.id} style={{ borderBottom: i < purchases.length - 1 ? "1px solid #f8fafc" : "none" }}>
                <td className="py-2 text-xs" style={{ color: "#64748b" }}>{DATETIME(p.createdAt)}</td>
                <td className="py-2 text-sm" style={{ color: "#334155" }}>{p.userEmail}</td>
                <td className="py-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.color }}>{ts.label}</span>
                </td>
                <td className="py-2 font-semibold" style={{ color: "#0f172a" }}>{USD(p.amountUsd)}</td>
                <td className="py-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize" style={{ background: ss.bg, color: ss.color }}>{p.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border p-10 text-center" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-semibold" style={{ color: "#0f172a" }}>{title}</p>
      <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>{description}</p>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = "text", required }: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: "#475569" }}>{label}</label>
      <input
        type={type} name={name} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border text-sm outline-none"
        style={{ borderColor: "#e2e8f0", color: "#334155", background: "#ffffff" }}
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: [string, string][]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: "#475569" }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border text-sm outline-none"
        style={{ borderColor: "#e2e8f0", color: "#334155", background: "#ffffff" }}
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
