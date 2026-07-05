/** Planète stylisée et colorable, avec anneau et cratères optionnels. */
export default function Planet({
  color = '#8B63F7',
  ring = false,
  craters = true,
  emoji,
  className = 'w-16 h-16',
}: {
  color?: string
  ring?: boolean
  craters?: boolean
  emoji?: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      {ring && (
        <ellipse cx="60" cy="64" rx="56" ry="16" fill="none" stroke={color} strokeOpacity="0.45" strokeWidth="7" />
      )}
      <circle cx="60" cy="60" r="38" fill={color} />
      <circle cx="60" cy="60" r="38" fill="url(#pShade)" />
      {craters && (
        <>
          <circle cx="48" cy="50" r="7" fill="black" opacity="0.12" />
          <circle cx="72" cy="68" r="5" fill="black" opacity="0.12" />
          <circle cx="60" cy="42" r="3.5" fill="black" opacity="0.1" />
        </>
      )}
      <path d="M34 44 Q 48 30 66 32" stroke="white" strokeWidth="5" fill="none" opacity="0.35" strokeLinecap="round" />
      {ring && (
        <path d="M4 64 A 56 16 0 0 0 116 64" fill="none" stroke={color} strokeOpacity="0.7" strokeWidth="7" />
      )}
      {emoji && (
        <text x="60" y="72" textAnchor="middle" fontSize="34">
          {emoji}
        </text>
      )}
      <defs>
        <radialGradient id="pShade" cx="0.3" cy="0.25" r="1.1">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="55%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.35" />
        </radialGradient>
      </defs>
    </svg>
  )
}
