"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { SolutionArea } from "@/lib/recommendation/types";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Answers {
  userType?: string;
  business?: string;
  goals?: SolutionArea[];
  team?: string;
  budget?: string;
  freeText?: string;
}

type StepActions = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
};

/* ─── Step definitions ───────────────────────────────────────────────────── */

const USER_TYPE_OPTIONS = [
  { value: "birey",            label: "Birey",           description: "Kişisel projemi veya yan işimi geliştirmek istiyorum.",  emoji: "🙋" },
  { value: "freelancer",       label: "Freelancer",      description: "Serbest çalışıyorum, işimi hızlandırmak istiyorum.",      emoji: "💼" },
  { value: "isletme-sahibi",   label: "İşletme sahibi",  description: "Kendi markamı veya işletmemi büyütmek istiyorum.",       emoji: "🏢" },
  { value: "ekip",             label: "Ekip / şirket",   description: "Ekibimi daha verimli hale getirmek istiyorum.",           emoji: "👥" },
];

const BUSINESS_SECTORS = [
  "E-ticaret", "Yazılım / SaaS", "İçerik / Medya", "Tasarım / Ajans",
  "Eğitim / Kurs", "Hizmet sektörü", "Sağlık", "Gayrimenkul", "Finans", "Yeme-içme",
];

const GOAL_OPTIONS: { value: SolutionArea; label: string; emoji: string }[] = [
  { value: "content",           label: "İçerik Üretimi",   emoji: "✍️"  },
  { value: "advertising",       label: "Reklam",            emoji: "📣"  },
  { value: "seo",               label: "SEO",               emoji: "🔍"  },
  { value: "development",       label: "Yazılım",           emoji: "💻"  },
  { value: "design",            label: "Tasarım",           emoji: "🎨"  },
  { value: "operations",        label: "Operasyon",         emoji: "⚙️"  },
  { value: "ecommerce",         label: "E-Ticaret",         emoji: "🛒"  },
  { value: "customer-support",  label: "Müşteri Desteği",   emoji: "💬"  },
  { value: "revenue",           label: "Gelir Artırma",     emoji: "📈"  },
  { value: "cost-reduction",    label: "Maliyet Düşürme",   emoji: "💰"  },
];

const TEAM_OPTIONS = [
  { value: "solo",        label: "Tek başıma",      description: "Her şeyi kendim yönetiyorum."              },
  { value: "small",       label: "Küçük ekip",      description: "2–5 kişilik küçük bir ekibiz."             },
  { value: "growing",     label: "Büyüyen ekip",    description: "Hızla büyüyoruz, ekibimiz genişliyor."     },
  { value: "established", label: "Oturmuş ekip",    description: "Düzenli çalışan, yapılanmış bir ekibiz."   },
];

const BUDGET_OPTIONS = [
  { value: "free-only", label: "Önce ücretsiz",    description: "Ücretli araçlara şimdilik geçmek istemiyorum."      },
  { value: "low",       label: "Düşük bütçe",      description: "Ayda $10–30 civarı harcayabilirim."                 },
  { value: "mid",       label: "Orta bütçe",       description: "Ayda $30–100 arasında makul bir yatırım yapabilirim."},
  { value: "best",      label: "En iyi çözüm",     description: "Bütçeden önce doğru araç gelir."                    },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function OptionCard({
  selected, onClick, disabled, children,
}: {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:pointer-events-none"
      style={{
        borderColor: selected ? "#2563eb" : "#e2e8f0",
        backgroundColor: selected ? "#eff6ff" : "#ffffff",
        boxShadow: selected ? "0 0 0 1px #bfdbfe, 0 1px 4px rgba(37,99,235,0.12)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function GoalChip({
  label, emoji, selected, onClick,
}: {
  label: string;
  emoji: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
      style={{
        borderColor: selected ? "#2563eb" : "#e2e8f0",
        backgroundColor: selected ? "#eff6ff" : "#ffffff",
        color: selected ? "#1d4ed8" : "#64748b",
        fontWeight: selected ? 600 : 500,
        boxShadow: selected ? "0 0 0 1px #bfdbfe" : "none",
      }}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}

function PrimaryButton({
  onClick, disabled, children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      /* Inline style is mandatory: bg-[--color-brand-600] arbitrary Tailwind class
         does not reliably resolve in v4 JIT. This guarantees visibility. */
      style={{
        backgroundColor: "#2563eb",
        color: "#ffffff",
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      {children}
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

interface OnboardingFlowProps {
  initialType?: string;
}

const TOTAL_STEPS = 6;

export function OnboardingFlow({ initialType }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [answers, setAnswers] = useState<Answers>({
    userType: initialType,
    goals: [],
  });
  const [transitioning, setTransitioning] = useState(false);

  /* ── Navigation ── */

  const goNext = useCallback(() => setStep((s) => s + 1), []);
  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const autoAdvance = useCallback((updatedAnswers: Answers) => {
    setTransitioning(true);
    setTimeout(() => {
      setAnswers(updatedAnswers);
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 280);
  }, []);

  /* ── Submission ── */

  const submit = useCallback((finalAnswers: Answers) => {
    const p = new URLSearchParams();
    if (finalAnswers.userType)      p.set("type",   finalAnswers.userType);
    if (finalAnswers.business)      p.set("biz",    finalAnswers.business);
    if (finalAnswers.goals?.length) p.set("goals",  finalAnswers.goals.join(","));
    if (finalAnswers.team)          p.set("team",   finalAnswers.team);
    if (finalAnswers.budget)        p.set("budget", finalAnswers.budget);
    if (finalAnswers.freeText)      p.set("note",   finalAnswers.freeText);
    router.push(`/results?${p.toString()}`);
  }, [router]);

  /* ── Action state (centralized) ── */

  function getStepActions(): StepActions {
    switch (step) {
      case 0: return {
        onNext: goNext,
        nextDisabled: !answers.userType || transitioning,
      };
      case 1: return {
        onBack: goBack,
        onNext: goNext,
        nextDisabled: !answers.business?.trim(),
      };
      case 2: return {
        onBack: goBack,
        onNext: goNext,
        nextDisabled: (answers.goals?.length ?? 0) === 0,
      };
      case 3: return {
        onBack: goBack,
        onNext: goNext,
        nextDisabled: !answers.team || transitioning,
      };
      case 4: return {
        onBack: goBack,
        onNext: goNext,
        nextDisabled: !answers.budget || transitioning,
      };
      case 5: return {
        onBack: goBack,
        onNext: () => submit(answers),
        nextLabel: "Sonuçları Gör",
        skipLabel: "Atla",
        onSkip: () => submit(answers),
      };
      default: return { onNext: goNext };
    }
  }

  /* ── Step renderers (no inline NavRow) ── */

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-4">
            <StepHeader step={1} total={TOTAL_STEPS} title="Sen kimsin?" subtitle="Sana en uygun araçları seçebilmemiz için başlayalım." />
            <div className="flex flex-col gap-2">
              {USER_TYPE_OPTIONS.map((opt) => {
                const selected = answers.userType === opt.value;
                return (
                  <OptionCard
                    key={opt.value}
                    selected={selected}
                    disabled={transitioning}
                    onClick={() => autoAdvance({ ...answers, userType: opt.value })}
                  >
                    <span className="text-2xl flex-shrink-0" aria-hidden="true">{opt.emoji}</span>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className="font-semibold text-slate-900 text-sm">{opt.label}</span>
                      <span className="text-xs text-slate-600">{opt.description}</span>
                    </div>
                    {selected && (
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M2 5l2 2 4-4" />
                        </svg>
                      </span>
                    )}
                  </OptionCard>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col gap-4">
            <StepHeader step={2} total={TOTAL_STEPS} title="Ne iş yapıyorsun?" subtitle="Kısa bir açıklama yeterli. Spesifik olursan öneri daha iyi olur." />
            <textarea
              className={cn(
                "w-full resize-none rounded-xl border border-slate-200",
                "bg-white px-4 py-3 text-sm text-slate-900",
                "placeholder:text-slate-400",
                "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                "transition-colors duration-150"
              )}
              rows={3}
              placeholder="Örneğin: Grafik tasarım hizmetleri, e-ticaret giyim markası..."
              value={answers.business ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, business: e.target.value }))}
            />
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-400">Ya da bir sektör seç:</p>
              <div className="flex flex-wrap gap-1.5">
                {BUSINESS_SECTORS.map((sector) => {
                  const isSelected = answers.business === sector;
                  return (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, business: sector }))}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150"
                      style={{
                        borderColor: isSelected ? "#2563eb" : "#e2e8f0",
                        backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                        color: isSelected ? "#1d4ed8" : "#64748b",
                        fontWeight: isSelected ? 600 : 500,
                      }}
                    >
                      {sector}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-4">
            <StepHeader step={3} total={TOTAL_STEPS} title="En çok neyi geliştirmek istiyorsun?" subtitle="Birden fazla seçebilirsin. En önemli 1–3 tanesini seç." />
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((opt) => {
                const isSelected = answers.goals?.includes(opt.value) ?? false;
                return (
                  <GoalChip
                    key={opt.value}
                    label={opt.label}
                    emoji={opt.emoji}
                    selected={isSelected}
                    onClick={() =>
                      setAnswers((a) => {
                        const curr = a.goals ?? [];
                        const next = isSelected
                          ? curr.filter((g) => g !== opt.value)
                          : [...curr, opt.value];
                        return { ...a, goals: next };
                      })
                    }
                  />
                );
              })}
            </div>
            {(answers.goals?.length ?? 0) > 0 && (
              <p className="text-xs font-medium" style={{ color: "#2563eb" }}>
                {answers.goals!.length} alan seçildi ✓
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-4">
            <StepHeader step={4} total={TOTAL_STEPS} title="Nasıl çalışıyorsun?" subtitle="Ekip yapın öneri kalitesini etkiliyor." />
            <div className="flex flex-col gap-2">
              {TEAM_OPTIONS.map((opt) => {
                const selected = answers.team === opt.value;
                return (
                  <OptionCard
                    key={opt.value}
                    selected={selected}
                    disabled={transitioning}
                    onClick={() => autoAdvance({ ...answers, team: opt.value })}
                  >
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className="font-semibold text-slate-900 text-sm">{opt.label}</span>
                      <span className="text-xs text-slate-600">{opt.description}</span>
                    </div>
                    {selected && (
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M2 5l2 2 4-4" />
                        </svg>
                      </span>
                    )}
                  </OptionCard>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-4">
            <StepHeader step={5} total={TOTAL_STEPS} title="Bütçe yaklaşımın ne?" subtitle="Ücretsiz alternatifler her zaman dahil edilir — bu sadece önceliği belirler." />
            <div className="flex flex-col gap-2">
              {BUDGET_OPTIONS.map((opt) => {
                const selected = answers.budget === opt.value;
                return (
                  <OptionCard
                    key={opt.value}
                    selected={selected}
                    disabled={transitioning}
                    onClick={() => autoAdvance({ ...answers, budget: opt.value })}
                  >
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className="font-semibold text-slate-900 text-sm">{opt.label}</span>
                      <span className="text-xs text-slate-600">{opt.description}</span>
                    </div>
                    {selected && (
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M2 5l2 2 4-4" />
                        </svg>
                      </span>
                    )}
                  </OptionCard>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col gap-4">
            <StepHeader step={6} total={TOTAL_STEPS} title="Eklemek istediğin bir şey var mı?" subtitle="İsteğe bağlı. Spesifik bir sorun veya beklentin varsa belirt." />
            <textarea
              className={cn(
                "w-full resize-none rounded-xl border border-slate-200",
                "bg-white px-4 py-3 text-sm text-slate-900",
                "placeholder:text-slate-400",
                "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                "transition-colors duration-150"
              )}
              rows={4}
              placeholder="Örneğin: Instagram içeriği üretmek istiyorum, Türkçe içerik üretiyor mu bilmiyorum..."
              value={answers.freeText ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, freeText: e.target.value }))}
            />
          </div>
        );

      default:
        return null;
    }
  }

  /* ── Layout ── */

  const progress   = ((step + 1) / TOTAL_STEPS) * 100;
  const stepActions = getStepActions();

  /*
   * LAYOUT: simple scrollable page. Action buttons live INSIDE the step
   * card (at the bottom, after a divider). No floating bars, no `fixed`
   * positioning issues. The card expands as needed and users scroll to it.
   */
  return (
    <div
      className="min-h-[calc(100dvh-4rem)] flex flex-col items-center px-4 pt-10 pb-16"
      style={{ backgroundColor: "#f8fafc" }}
    >

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
            Adım {step + 1} / {TOTAL_STEPS}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === step ? "1.5rem" : "0.5rem",
                  height: "0.375rem",
                  backgroundColor:
                    i === step ? "#2563eb" :
                    i < step   ? "#93c5fd" :
                                 "#e2e8f0",
                }}
              />
            ))}
          </div>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#e2e8f0" }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: "#2563eb" }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-label="Analiz ilerleme durumu"
          />
        </div>
      </div>

      {/* Step card — actions live at the bottom inside the card */}
      <div
        key={step}
        className="animate-step-in w-full max-w-lg rounded-2xl border"
        style={{
          backgroundColor: "#ffffff",
          borderColor: "#e2e8f0",
          boxShadow: "0 4px 24px -4px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.05)",
        }}
      >
        {/* Content area */}
        <div className="p-7 md:p-8">
          {renderStep()}
        </div>

        {/* ── Action row — inside the card ── */}
        <div
          className="px-7 md:px-8 py-4 flex items-center justify-between gap-3 border-t rounded-b-2xl"
          style={{ borderColor: "#e2e8f0", backgroundColor: "#fafafa" }}
        >
          {/* Back */}
          <div className="w-16 flex-shrink-0">
            {stepActions.onBack ? (
              <button
                type="button"
                onClick={stepActions.onBack}
                className="text-sm font-medium px-2 py-1.5 rounded-lg transition-colors"
                style={{ color: "#475569" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
              >
                ← Geri
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Skip + Continue */}
          <div className="flex items-center gap-3">
            {stepActions.skipLabel && stepActions.onSkip && (
              <button
                type="button"
                onClick={stepActions.onSkip}
                className="text-sm transition-colors"
                style={{ color: "#94a3b8" }}
              >
                {stepActions.skipLabel}
              </button>
            )}
            {stepActions.onNext && (
              <PrimaryButton onClick={stepActions.onNext} disabled={stepActions.nextDisabled}>
                {stepActions.nextLabel ?? "Devam"} →
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-center max-w-xs" style={{ color: "#94a3b8" }}>
        Verdiğin bilgiler yalnızca analiz için kullanılır. Kayıt gerekmez.
      </p>

    </div>
  );
}

/* ─── Step header component ──────────────────────────────────────────────── */

function StepHeader({ step, total, title, subtitle }: {
  step: number;
  total: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-600 mb-2">
        Adım {step} / {total}
      </p>
      <h2 className="text-xl font-semibold tracking-tight mb-1">{title}</h2>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}
