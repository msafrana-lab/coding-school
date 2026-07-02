import { useMemo } from 'react'
import type { PuzzleContent, Direction } from '../curriculum/types'

/** État visuel piloté par le lecteur de mission. */
export interface GridVisual {
  x: number
  y: number
  angle: number
  collected: Set<string>
  visited: string[]
  crash: { x: number; y: number } | null
  won: boolean
}

export function angleFor(dir: Direction): number {
  // L'emoji 🚀 pointe naturellement vers le haut-droite (45°)
  return { N: -45, E: 45, S: 135, O: 225 }[dir]
}

export function initialVisual(def: Pick<PuzzleContent, 'start'>): GridVisual {
  return {
    x: def.start.x,
    y: def.start.y,
    angle: angleFor(def.start.dir),
    collected: new Set(),
    visited: [`${def.start.x},${def.start.y}`],
    crash: null,
    won: false,
  }
}

/** La grille spatiale : SVG pour les cases, HTML par-dessus pour la fusée et les effets. */
export default function GridView({
  def,
  visual,
}: {
  def: Pick<PuzzleContent, 'map' | 'start'>
  visual: GridVisual
}) {
  const rows = def.map
  const H = rows.length
  const W = Math.max(...rows.map((r) => r.length))

  const cells = useMemo(() => {
    const list: { x: number; y: number; c: string }[] = []
    rows.forEach((row, y) => {
      row.split('').forEach((c, x) => {
        if (c !== '.') list.push({ x, y, c })
      })
    })
    return list
  }, [rows])

  const pct = (v: number, total: number) => `${(v / total) * 100}%`
  const cellW = 100 / W
  const cellH = 100 / H

  return (
    <div
      className="relative mx-auto w-full max-w-full select-none"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {/* Cases */}
      <svg viewBox={`0 0 ${W * 100} ${H * 100}`} className="absolute inset-0 h-full w-full">
        {cells.map(({ x, y, c }) => (
          <g key={`${x},${y}`}>
            <rect
              x={x * 100 + 4}
              y={y * 100 + 4}
              width={92}
              height={92}
              rx={18}
              fill={
                c === 'A'
                  ? '#1A2152'
                  : c === 'G'
                    ? 'rgba(247, 185, 16, 0.25)'
                    : (x + y) % 2 === 0
                      ? '#3A4699'
                      : '#313C86'
              }
              stroke={c === 'G' ? 'rgba(255, 210, 63, 0.7)' : 'rgba(139, 99, 247, 0.35)'}
              strokeWidth={c === 'G' ? 3 : 2}
            />
          </g>
        ))}
      </svg>

      {/* Traînée */}
      {visual.visited.slice(0, -1).map((key) => {
        const [x, y] = key.split(',').map(Number)
        return (
          <span
            key={`t${key}`}
            className="absolute rounded-full bg-white/25"
            style={{
              width: '6%',
              height: `${(6 * W) / H}%`,
              maxWidth: 14,
              maxHeight: 14,
              left: `calc(${pct(x * cellW + cellW / 2, 100)} - 4px)`,
              top: `calc(${pct(y * cellH + cellH / 2, 100)} - 4px)`,
            }}
          />
        )
      })}

      {/* Objets */}
      {cells.map(({ x, y, c }) => {
        if (c === 'C' && !visual.collected.has(`${x},${y}`))
          return (
            <div
              key={`c${x},${y}`}
              className="absolute grid place-items-center animate-twinkle"
              style={{ left: pct(x * cellW, 100), top: pct(y * cellH, 100), width: pct(cellW, 100), height: pct(cellH, 100) }}
            >
              <span style={{ fontSize: 'min(5.5vh, 2rem)' }}>💎</span>
            </div>
          )
        if (c === 'A')
          return (
            <div
              key={`a${x},${y}`}
              className="absolute grid place-items-center"
              style={{ left: pct(x * cellW, 100), top: pct(y * cellH, 100), width: pct(cellW, 100), height: pct(cellH, 100) }}
            >
              <span style={{ fontSize: 'min(6vh, 2.2rem)' }}>🪨</span>
            </div>
          )
        if (c === 'G')
          return (
            <div
              key={`g${x},${y}`}
              className="absolute grid place-items-center"
              style={{ left: pct(x * cellW, 100), top: pct(y * cellH, 100), width: pct(cellW, 100), height: pct(cellH, 100) }}
            >
              <span className={visual.won ? 'animate-pop-in' : 'animate-float'} style={{ fontSize: 'min(6.5vh, 2.4rem)' }}>
                🪐
              </span>
            </div>
          )
        return null
      })}

      {/* Explosion */}
      {visual.crash && (
        <div
          className="absolute z-20 grid place-items-center animate-pop-in"
          style={{
            left: pct(visual.crash.x * cellW, 100),
            top: pct(visual.crash.y * cellH, 100),
            width: pct(cellW, 100),
            height: pct(cellH, 100),
          }}
        >
          <span style={{ fontSize: 'min(7vh, 2.6rem)' }}>💥</span>
        </div>
      )}

      {/* La fusée */}
      <div
        className="absolute z-10 grid place-items-center"
        style={{
          left: pct(visual.x * cellW, 100),
          top: pct(visual.y * cellH, 100),
          width: pct(cellW, 100),
          height: pct(cellH, 100),
          transition: 'left 240ms ease, top 240ms ease',
        }}
      >
        <span
          className={visual.crash ? 'animate-wiggle' : ''}
          style={{
            fontSize: 'min(6.5vh, 2.4rem)',
            transform: `rotate(${visual.angle}deg)`,
            transition: 'transform 200ms ease',
            display: 'inline-block',
            filter: visual.won ? 'drop-shadow(0 0 12px rgba(255,210,63,0.9))' : undefined,
          }}
        >
          🚀
        </span>
      </div>
    </div>
  )
}
