interface WhatIsExpectedProps {
  items: string[];
}

/* Inline styles throughout — avoids CSS variable arbitrary Tailwind class issues. */
export function WhatIsExpected({ items }: WhatIsExpectedProps) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 px-4 py-3 rounded-xl border"
          style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
        >
          <span
            className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full mt-0.5 text-white"
            style={{ backgroundColor: "#2563eb", fontSize: "10px", fontWeight: 700 }}
            aria-hidden
          >
            {i + 1}
          </span>
          <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
