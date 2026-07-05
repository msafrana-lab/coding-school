export default function Logo({ className = 'h-9' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className="grid place-items-center rounded-xl bg-nebula-500 shadow-glow aspect-square h-full text-[1.2em]">
        🚀
      </span>
      <span className="font-display font-bold text-[1.35em] leading-none">
        Astro<span className="text-comet-400">Code</span>
      </span>
    </span>
  )
}
