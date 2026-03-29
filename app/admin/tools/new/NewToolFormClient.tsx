"use client";

import { useState } from "react";

const CATEGORIES = [
  "Asistan", "Araştırma", "SEO", "Tasarım", "Video", "Ses",
  "Verimlilik", "Pazarlama", "Otomasyon", "Geliştirici", "E-Ticaret", "Diğer",
];

const SOLUTION_AREAS = [
  "content", "seo", "development", "design", "operations",
  "customer-support", "revenue", "ecommerce",
];

const USER_TYPES = ["individual", "freelancer", "founder", "team"];

interface FormState {
  slug: string;
  name: string;
  tagline: string;
  pricingLabel: string;
  websiteUrl: string;
  affiliateUrl: string;
  category: string;
  popularity: string;
  status: string;
  hasFree: boolean;
  hasTrial: boolean;
  hasAffiliate: boolean;
  pricingTier: string;
  turkishSupport: string;
  difficultyLevel: string;
  editorialScore: string;
  solutionAreas: string[];
  suitableForUserTypes: string[];
  subUseCases: string;
  strongSignals: string;
  strengths: string;
  weaknesses: string;
  whyRecommended: string;
  notSuitableFor: string;
  similarTools: string;
  freeAlternatives: string;
  sectorFit: string;
  scores: {
    fitToNeed: string;
    easeOfUse: string;
    priceValue: string;
    productivityImpact: string;
    growthImpact: string;
    integrationFit: string;
  };
}

const DEFAULTS: FormState = {
  slug: "", name: "", tagline: "", pricingLabel: "", websiteUrl: "", affiliateUrl: "",
  category: "Asistan", popularity: "known", status: "tracked",
  hasFree: false, hasTrial: false, hasAffiliate: false,
  pricingTier: "low", turkishSupport: "partial", difficultyLevel: "beginner",
  editorialScore: "7.5",
  solutionAreas: [], suitableForUserTypes: [],
  subUseCases: "", strongSignals: "", strengths: "", weaknesses: "",
  whyRecommended: "", notSuitableFor: "", similarTools: "", freeAlternatives: "", sectorFit: "",
  scores: { fitToNeed: "8", easeOfUse: "8", priceValue: "8", productivityImpact: "8", growthImpact: "7.5", integrationFit: "7.5" },
};

function lines(s: string): string[] {
  return s.split("\n").map(l => l.trim()).filter(Boolean);
}

export function NewToolFormClient() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  function set(field: keyof FormState, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleArr(field: "solutionAreas" | "suitableForUserTypes", val: string) {
    setForm(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  }

  function generate() {
    const arr = (s: string) => JSON.stringify(lines(s));
    const code = `  {
    slug: "${form.slug}",
    name: "${form.name}",
    tagline: "${form.tagline}",
    pricingLabel: "${form.pricingLabel}",
    websiteUrl: "${form.websiteUrl}",${form.affiliateUrl ? `\n    affiliateUrl: "${form.affiliateUrl}",` : ""}
    popularity: "${form.popularity}",
    category: "${form.category}",
    subUseCases: ${arr(form.subUseCases)},
    strongSignals: ${arr(form.strongSignals)},
    suitableForUserTypes: ${JSON.stringify(form.suitableForUserTypes)},
    sectorFit: ${arr(form.sectorFit)},
    solutionAreas: ${JSON.stringify(form.solutionAreas)},
    hasFree: ${form.hasFree},
    hasTrial: ${form.hasTrial},
    pricingTier: "${form.pricingTier}",
    hasAffiliate: ${form.hasAffiliate},
    hasPartnership: false,
    turkishSupport: "${form.turkishSupport}",
    difficultyLevel: "${form.difficultyLevel}",
    editorialScore: ${form.editorialScore},
    scores: { fitToNeed: ${form.scores.fitToNeed}, easeOfUse: ${form.scores.easeOfUse}, priceValue: ${form.scores.priceValue}, productivityImpact: ${form.scores.productivityImpact}, growthImpact: ${form.scores.growthImpact}, integrationFit: ${form.scores.integrationFit} },
    strengths: ${arr(form.strengths)},
    weaknesses: ${arr(form.weaknesses)},
    whyRecommended: "${form.whyRecommended.replace(/"/g, '\\"')}",
    notSuitableFor: ${arr(form.notSuitableFor)},
    similarTools: ${arr(form.similarTools)},
    freeAlternatives: ${arr(form.freeAlternatives)},
    status: "${form.status}",
  },`;
    setGenerated(code);
  }

  async function copy() {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide mb-1 block";
  const inputClass = "w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 text-sm outline-none focus:border-blue-500";
  const textareaClass = `${inputClass} resize-y min-h-[72px]`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Yeni Araç Ekle</h1>
        <p className="text-sm text-slate-500">
          Formu doldur → "Kod üret" → kopyala → <code className="text-slate-600">data/seed/tools.ts</code> dosyasına yapıştır.
          DB canlıya geçince bu form doğrudan veritabanına yazacak.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-700">Temel Bilgiler</h2>

          {[
            { field: "slug",         label: "Slug (URL-safe, küçük harf)",  ph: "örn: my-tool" },
            { field: "name",         label: "Araç Adı",                    ph: "örn: MyTool" },
            { field: "tagline",      label: "Tagline",                     ph: "Kısa açıklama" },
            { field: "pricingLabel", label: "Fiyat Etiketi",               ph: "Ücretsiz · Pro $20/ay" },
            { field: "websiteUrl",   label: "Resmi Site URL",              ph: "https://..." },
            { field: "affiliateUrl", label: "Affiliate URL (varsa)",       ph: "https://...?via=yaverim" },
          ].map(({ field, label, ph }) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                value={(form as never)[field] as string}
                onChange={e => set(field as keyof FormState, e.target.value)}
                placeholder={ph}
                className={inputClass}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Kategori</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Popülerlik</label>
              <select value={form.popularity} onChange={e => set("popularity", e.target.value)} className={inputClass}>
                {["mainstream", "known", "niche", "emerging"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Durum</label>
              <select value={form.status} onChange={e => set("status", e.target.value)} className={inputClass}>
                {["candidate", "tracked", "core", "priority", "deprecated"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fiyat Kademesi</label>
              <select value={form.pricingTier} onChange={e => set("pricingTier", e.target.value)} className={inputClass}>
                {["free", "low", "mid", "high", "enterprise"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Türkçe Destek</label>
              <select value={form.turkishSupport} onChange={e => set("turkishSupport", e.target.value)} className={inputClass}>
                {["full", "partial", "none"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Zorluk</label>
              <select value={form.difficultyLevel} onChange={e => set("difficultyLevel", e.target.value)} className={inputClass}>
                {["beginner", "intermediate", "advanced"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            {[
              { field: "hasFree",     label: "Ücretsiz plan" },
              { field: "hasTrial",    label: "Ücretsiz deneme" },
              { field: "hasAffiliate", label: "Affiliate var" },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form as never)[field] as boolean}
                  onChange={e => set(field as keyof FormState, e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <span className="text-xs text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-700">Çözüm Alanları & Kullanıcı Tipleri</h2>

          <div>
            <label className={labelClass}>Çözüm Alanları</label>
            <div className="flex flex-wrap gap-2">
              {SOLUTION_AREAS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleArr("solutionAreas", a)}
                  className="text-xs px-2.5 py-1 rounded-full border transition-colors"
                  style={{
                    backgroundColor: form.solutionAreas.includes(a) ? "#2563eb" : "transparent",
                    borderColor: form.solutionAreas.includes(a) ? "#2563eb" : "#3f3f46",
                    color: form.solutionAreas.includes(a) ? "#fff" : "#a1a1aa",
                  }}
                >{a}</button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Uygun Kullanıcı Tipleri</label>
            <div className="flex flex-wrap gap-2">
              {USER_TYPES.map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => toggleArr("suitableForUserTypes", u)}
                  className="text-xs px-2.5 py-1 rounded-full border transition-colors"
                  style={{
                    backgroundColor: form.suitableForUserTypes.includes(u) ? "#7c3aed" : "transparent",
                    borderColor: form.suitableForUserTypes.includes(u) ? "#7c3aed" : "#3f3f46",
                    color: form.suitableForUserTypes.includes(u) ? "#fff" : "#a1a1aa",
                  }}
                >{u}</button>
              ))}
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-700 mt-2">Skorlar (0–10)</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(form.scores).map(([key, val]) => (
              <div key={key}>
                <label className="text-[10px] text-slate-500 block mb-1">{key}</label>
                <input
                  type="number" min="0" max="10" step="0.1"
                  value={val}
                  onChange={e => setForm(prev => ({ ...prev, scores: { ...prev.scores, [key]: e.target.value } }))}
                  className={inputClass}
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">editorialScore</label>
              <input
                type="number" min="0" max="10" step="0.1"
                value={form.editorialScore}
                onChange={e => set("editorialScore", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { field: "subUseCases",    label: "Kullanım Alanları (her satır bir madde)" },
          { field: "strongSignals",  label: "Güçlü Sinyaller (her satır bir madde)" },
          { field: "strengths",      label: "Güçlü Yönler (her satır bir madde)" },
          { field: "weaknesses",     label: "Zayıf Yönler (her satır bir madde)" },
          { field: "notSuitableFor", label: "Kimler için uygun değil (her satır)" },
          { field: "sectorFit",      label: "Sektör Uyumu (her satır)" },
          { field: "similarTools",   label: "Benzer Araçlar (slug, her satır)" },
          { field: "freeAlternatives", label: "Ücretsiz Alternatifler (slug, her satır)" },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className={labelClass}>{label}</label>
            <textarea
              value={(form as never)[field] as string}
              onChange={e => set(field as keyof FormState, e.target.value)}
              className={textareaClass}
              placeholder={`Her satıra bir madde yaz`}
            />
          </div>
        ))}
      </div>

      <div>
        <label className={labelClass}>Neden Öneriyoruz? (tek paragraf, Türkçe)</label>
        <textarea
          value={form.whyRecommended}
          onChange={e => set("whyRecommended", e.target.value)}
          className={textareaClass}
          style={{ minHeight: 96 }}
          placeholder="Yaverim bu aracı şu nedenle öneriyor..."
        />
      </div>

      {/* Generate */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={generate}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2563eb" }}
        >
          Kod üret
        </button>
        {generated && (
          <button
            type="button"
            onClick={copy}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: copied ? "#16a34a" : "#18181b",
              color: copied ? "#fff" : "#a1a1aa",
              border: "1px solid #3f3f46",
            }}
          >
            {copied ? "✓ Kopyalandı!" : "Kopyala"}
          </button>
        )}
      </div>

      {generated && (
        <div>
          <p className="text-xs text-slate-500 mb-2">
            Aşağıdaki kodu <code className="text-slate-600">data/seed/tools.ts</code> dosyasındaki SEED dizisine ekle, ardından "Sıralamayı Yenile"yi çalıştır:
          </p>
          <pre
            className="text-xs overflow-x-auto p-4 rounded-xl"
            style={{ backgroundColor: "#0f0f0f", color: "#86efac", border: "1px solid #1f2937" }}
          >
            {generated}
          </pre>
        </div>
      )}
    </div>
  );
}
