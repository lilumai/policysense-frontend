// components/ui/Ring.tsx
"use client";

interface RingProps {
  pct: number;
}

export default function Ring({ pct }: RingProps) {
  const size = 88;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct === 0 ? "#D9E2DF" : pct >= 80 ? "var(--ok)" : "#EF9F27";

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#E9E3F7"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={16}
        fontWeight={600}
        fill="var(--deep)"
      >
        {pct}%
      </text>
    </svg>
  );
}
