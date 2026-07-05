import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'star'

const variants: Record<Variant, string> = {
  primary:
    'bg-nebula-500 border-nebula-700 text-white hover:brightness-110 shadow-glow',
  secondary:
    'bg-space-700 border-space-900 text-white hover:bg-space-600',
  success:
    'bg-mint-500 border-mint-600 text-space-950 hover:brightness-110',
  danger:
    'bg-coral-500 border-coral-600 text-white hover:brightness-110',
  ghost:
    'bg-white/10 border-white/5 text-white hover:bg-white/20 backdrop-blur',
  star:
    'bg-star-400 border-star-600 text-space-950 hover:brightness-105',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}) {
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl border-b-[3px]',
    md: 'px-6 py-3 text-base rounded-2xl border-b-4',
    lg: 'px-8 py-4 text-lg rounded-2xl border-b-4',
  }
  return (
    <button
      className={`font-display font-semibold tracking-wide transition
        active:translate-y-[3px] active:border-b-0 disabled:opacity-40 disabled:pointer-events-none
        ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Card({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`rounded-3xl bg-space-800/80 border border-white/10 shadow-card backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}

export function Pill({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${className}`}
    >
      {children}
    </span>
  )
}

/** Bulle de dialogue de la mascotte */
export function SpeechBubble({
  children,
  className = '',
  tail = 'left',
}: {
  children: ReactNode
  className?: string
  tail?: 'left' | 'bottom' | 'none'
}) {
  return (
    <div className={`relative rounded-2xl bg-white text-space-900 px-4 py-3 font-semibold shadow-card ${className}`}>
      {tail === 'left' && (
        <span className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-4 rotate-45 bg-white" aria-hidden />
      )}
      {tail === 'bottom' && (
        <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 h-4 w-4 rotate-45 bg-white" aria-hidden />
      )}
      {children}
    </div>
  )
}
