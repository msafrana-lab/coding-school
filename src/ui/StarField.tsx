import { useMemo } from 'react'

/** Générateur pseudo-aléatoire déterministe pour un ciel stable entre rendus. */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Star = { x: number; y: number; r: number; o: number; delay: number; twinkles: boolean }

export default function StarField({ density = 90, seed = 7 }: { density?: number; seed?: number }) {
  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: density }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.6 + rand() * 1.6,
      o: 0.3 + rand() * 0.7,
      delay: rand() * 4,
      twinkles: rand() > 0.55,
    }))
  }, [density, seed])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="h-full w-full" preserveAspectRatio="none">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#E9E4FF"
            opacity={s.o}
            className={s.twinkles ? 'animate-twinkle' : undefined}
            style={s.twinkles ? { animationDelay: `${s.delay}s` } : undefined}
          />
        ))}
      </svg>
      {/* Nébuleuses douces */}
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-nebula-600/20 blur-3xl" />
      <div className="absolute -right-24 top-2/3 h-80 w-80 rounded-full bg-comet-600/15 blur-3xl" />
    </div>
  )
}
