export type CosmoPose = 'hello' | 'happy' | 'think' | 'cheer' | 'oops' | 'point'

/**
 * Cosmo, la mascotte d'AstroCode : un petit alien astronaute.
 * Dessiné en SVG pour rester net à toutes les tailles.
 */
export default function Cosmo({
  pose = 'hello',
  className = 'w-32 h-32',
  float = false,
}: {
  pose?: CosmoPose
  className?: string
  float?: boolean
}) {
  const sad = pose === 'oops'
  const thinking = pose === 'think'
  const cheer = pose === 'cheer'
  const leftUp = cheer || pose === 'hello'
  const rightUp = cheer || pose === 'point'

  return (
    <svg
      viewBox="0 0 200 210"
      className={`${className} ${float ? 'animate-float' : ''}`}
      role="img"
      aria-label="Cosmo la mascotte"
    >
      {/* Antenne */}
      <g className={cheer ? 'animate-wiggle' : ''} style={{ transformOrigin: '100px 40px' }}>
        <path d="M100 38 Q 100 18 112 12" stroke="#8B63F7" strokeWidth="5" fill="none" strokeLinecap="round" transform={sad ? 'rotate(18 100 38)' : undefined} />
        <circle cx={sad ? 118 : 114} cy={sad ? 18 : 10} r="8" fill="#FFD23F" />
        <circle cx={sad ? 118 : 114} cy={sad ? 18 : 10} r="12" fill="#FFD23F" opacity="0.25" className="animate-twinkle" />
      </g>

      {/* Bras gauche */}
      <path
        d={leftUp ? 'M45 118 Q 22 100 20 74' : 'M45 118 Q 24 130 22 150'}
        stroke="#8B63F7"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bras droit */}
      <path
        d={rightUp ? 'M155 118 Q 178 100 180 74' : thinking ? 'M155 118 Q 172 110 160 88' : 'M155 118 Q 176 130 178 150'}
        stroke="#8B63F7"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      {/* Mains */}
      <circle cx={leftUp ? 20 : 22} cy={leftUp ? 72 : 152} r="11" fill="#A88BFF" />
      <circle cx={rightUp ? 180 : thinking ? 158 : 178} cy={rightUp ? 72 : thinking ? 86 : 152} r="11" fill="#A88BFF" />

      {/* Corps (combinaison) */}
      <ellipse cx="100" cy="150" rx="52" ry="48" fill="#F2EFFF" />
      <ellipse cx="100" cy="150" rx="52" ry="48" fill="url(#suitShade)" />
      {/* Ceinture */}
      <rect x="58" y="160" width="84" height="12" rx="6" fill="#17C3DE" />
      <circle cx="100" cy="166" r="9" fill="#FFD23F" />
      {/* Badge fusée */}
      <circle cx="72" cy="140" r="10" fill="#8B63F7" opacity="0.9" />
      <text x="72" y="145" textAnchor="middle" fontSize="12">🚀</text>

      {/* Tête */}
      <circle cx="100" cy="88" r="52" fill="#B79CFF" />
      {/* Visage */}
      <g>
        {/* Yeux */}
        {thinking ? (
          <>
            <circle cx="80" cy="84" r="9" fill="#241A4A" />
            <circle cx="122" cy="80" r="9" fill="#241A4A" />
            <circle cx="83" cy="81" r="3" fill="white" />
            <circle cx="125" cy="77" r="3" fill="white" />
          </>
        ) : sad ? (
          <>
            <path d="M70 82 Q 80 76 90 82" stroke="#241A4A" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M110 82 Q 120 76 130 82" stroke="#241A4A" strokeWidth="5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="80" cy="84" r="11" fill="#241A4A" />
            <circle cx="120" cy="84" r="11" fill="#241A4A" />
            <circle cx="84" cy="80" r="4" fill="white" />
            <circle cx="124" cy="80" r="4" fill="white" />
            <circle cx="77" cy="87" r="2" fill="white" opacity="0.7" />
            <circle cx="117" cy="87" r="2" fill="white" opacity="0.7" />
          </>
        )}
        {/* Joues */}
        <circle cx="68" cy="100" r="7" fill="#FF8A9B" opacity="0.55" />
        <circle cx="132" cy="100" r="7" fill="#FF8A9B" opacity="0.55" />
        {/* Bouche */}
        {cheer ? (
          <path d="M84 104 Q 100 122 116 104 Z" fill="#241A4A" />
        ) : sad ? (
          <path d="M88 112 Q 100 104 112 112" stroke="#241A4A" strokeWidth="5" fill="none" strokeLinecap="round" />
        ) : thinking ? (
          <circle cx="102" cy="108" r="5" fill="#241A4A" />
        ) : (
          <path d="M86 104 Q 100 116 114 104" stroke="#241A4A" strokeWidth="5" fill="none" strokeLinecap="round" />
        )}
      </g>

      {/* Casque (dôme en verre) */}
      <circle cx="100" cy="88" r="58" fill="url(#glass)" stroke="#DDD4FF" strokeWidth="3" />
      <path d="M60 60 Q 75 42 96 40" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />

      <defs>
        <radialGradient id="glass" cx="0.35" cy="0.3" r="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="60%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#8B63F7" stopOpacity="0.12" />
        </radialGradient>
        <linearGradient id="suitShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="#8B63F7" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  )
}
