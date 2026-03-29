import { Button } from "@/components/common/Button";

/* ─── Tool chips floating in the background ─────────────────────────────────
   Vary opacity for visual depth. dot = category color accent.                */

interface EcoChip {
  label: string;
  top: string;
  left?: string;
  right?: string;
  dur: string;
  delay: string;
  opacity: number;
  dot: string;       // category color
  drift?: boolean;   // use sideways drift animation
  size?: "sm" | "md"; // sm = slightly smaller font
}

const ECO_CHIPS: EcoChip[] = [
  // ── Left column ────────────────────────────────────────────────
  { label: "ChatGPT",        top: "12%",  left: "3%",   dur: "7s",    delay: "0s",    opacity: 0.85, dot: "#2563eb" },
  { label: "Notion AI",      top: "32%",  left: "1%",   dur: "9s",    delay: "0.8s",  opacity: 0.55, dot: "#475569", drift: true },
  { label: "Zapier",         top: "52%",  left: "4%",   dur: "8.5s",  delay: "1.6s",  opacity: 0.60, dot: "#f97316" },
  { label: "SEMrush",        top: "69%",  left: "2%",   dur: "10s",   delay: "0.4s",  opacity: 0.45, dot: "#16a34a", size: "sm" },
  { label: "ElevenLabs",     top: "84%",  left: "6%",   dur: "7.5s",  delay: "2.2s",  opacity: 0.40, dot: "#7c3aed", size: "sm" },

  // ── Left-center ────────────────────────────────────────────────
  { label: "Midjourney",     top: "22%",  left: "13%",  dur: "8s",    delay: "1.2s",  opacity: 0.50, dot: "#db2777", drift: true },
  { label: "Perplexity",     top: "78%",  left: "14%",  dur: "6.5s",  delay: "2.8s",  opacity: 0.40, dot: "#0d9488", size: "sm" },

  // ── Right column ────────────────────────────────────────────────
  { label: "Claude",         top: "10%",  right: "4%",  dur: "8.5s",  delay: "1s",    opacity: 0.80, dot: "#d97706" },
  { label: "GitHub Copilot", top: "28%",  right: "2%",  dur: "10s",   delay: "0.2s",  opacity: 0.55, dot: "#7c3aed", size: "sm" },
  { label: "Canva",          top: "48%",  right: "3%",  dur: "7.5s",  delay: "1.8s",  opacity: 0.60, dot: "#db2777", drift: true },
  { label: "Cursor",         top: "65%",  right: "5%",  dur: "9s",    delay: "0.6s",  opacity: 0.45, dot: "#7c3aed", size: "sm" },
  { label: "Make",           top: "80%",  right: "8%",  dur: "8s",    delay: "2.4s",  opacity: 0.38, dot: "#f97316", size: "sm" },

  // ── Right-center ────────────────────────────────────────────────
  { label: "Gemini",         top: "18%",  right: "14%", dur: "9.5s",  delay: "0.9s",  opacity: 0.50, dot: "#2563eb" },
  { label: "Surfer SEO",     top: "72%",  right: "15%", dur: "7s",    delay: "3s",    opacity: 0.38, dot: "#16a34a", size: "sm", drift: true },
  { label: "Runway",         top: "42%",  right: "12%", dur: "11s",   delay: "1.4s",  opacity: 0.42, dot: "#0d9488", size: "sm" },
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36"
      style={{ backgroundColor: "#ffffff" }}
      aria-label="Hero"
    >
      {/* Dot grid */}
      <div className="hero-dot-grid pointer-events-none absolute inset-0 opacity-[0.28]" aria-hidden />

      {/* Multi-tone radial glow: blue center + subtle violet right */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 55% at 50% 40%, #dbeafe 0%, transparent 70%)",
            opacity: 0.9,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 35% 40% at 80% 30%, #ede9fe 0%, transparent 65%)",
            opacity: 0.6,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 30% 35% at 20% 65%, #dcfce7 0%, transparent 60%)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Floating ecosystem chips */}
      <div className="pointer-events-none absolute inset-0 hidden md:block select-none" aria-hidden>
        {ECO_CHIPS.map((chip) => (
          <span
            key={chip.label}
            className={chip.drift ? "eco-chip-drift" : "eco-chip"}
            style={{
              position: "absolute",
              top: chip.top,
              ...(chip.left  ? { left:  chip.left  } : {}),
              ...(chip.right ? { right: chip.right } : {}),
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "9999px",
              border: "1px solid #e2e8f0",
              backgroundColor: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(8px)",
              paddingInline: chip.size === "sm" ? "10px" : "12px",
              paddingBlock: chip.size === "sm" ? "3px" : "5px",
              fontSize: chip.size === "sm" ? "11px" : "12px",
              fontWeight: 500,
              color: "#475569",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              opacity: chip.opacity,
              "--float-dur":   chip.dur,
              "--float-delay": chip.delay,
            } as React.CSSProperties}
          >
            {/* Category color dot */}
            <span
              className="pulse-dot"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "9999px",
                backgroundColor: chip.dot,
                flexShrink: 0,
                "--float-delay": chip.delay,
              } as React.CSSProperties}
              aria-hidden
            />
            {chip.label}
          </span>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative container-page flex flex-col items-center text-center gap-8">

        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
          style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#2563eb" }}
            aria-hidden
          />
          Sana yarayanı bulur
        </div>

        {/* Headline */}
        <h1
          className="max-w-[760px] text-balance font-bold leading-[1.1] tracking-tight"
          style={{ color: "#0f172a" }}
        >
          İhtiyacına{" "}
          <span
            className="relative inline-block"
            style={{ color: "#2563eb" }}
          >
            en uygun
          </span>{" "}
          yapay zekâ araçlarını bul.
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-[520px] text-balance text-lg leading-relaxed -mt-1"
          style={{ color: "#475569" }}
        >
          Hedefini, bütçeni ve çalışma düzenini anlıyoruz. Sana özel
          araç önerileri ve uygulanabilir planı dakikalar içinde oluşturuyoruz.
        </p>

        {/* CTA cluster */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button variant="primary" size="lg" href="/analyze">
            Analizi Başlat
          </Button>
          <a
            href="#nasil-calisir"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-base font-medium transition-colors"
            style={{ backgroundColor: "#f1f5f9", color: "#334155" }}
          >
            Nasıl çalışır?
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {[
            { text: "Ücretsiz başla", icon: "✓" },
            { text: "Kayıt gerekmez", icon: "✓" },
            { text: "Dakikalar içinde sonuç", icon: "✓" },
          ].map((item, i) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "#64748b" }}
            >
              {i > 0 && (
                <span
                  className="h-1 w-1 rounded-full mx-1"
                  style={{ backgroundColor: "#cbd5e1" }}
                  aria-hidden
                />
              )}
              <span style={{ color: "#16a34a", fontWeight: 600 }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>

        {/* Ecosystem tag row — mobile only alternative to floating chips */}
        <div className="flex items-center gap-2 flex-wrap justify-center md:hidden mt-2" aria-hidden>
          {["ChatGPT", "Claude", "Midjourney", "Canva", "Zapier", "Gemini"].map((name) => (
            <span
              key={name}
              className="text-xs px-2.5 py-1 rounded-full border"
              style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0", color: "#64748b" }}
            >
              {name}
            </span>
          ))}
          <span className="text-xs text-slate-400">ve çok daha fazlası →</span>
        </div>
      </div>

      {/* Bottom fade — blends into OnboardingEntry below */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: "linear-gradient(to bottom, transparent, #f8fafc)" }}
        aria-hidden
      />
    </section>
  );
}
