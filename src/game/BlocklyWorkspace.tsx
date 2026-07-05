import { useEffect, useRef, useState } from 'react'
import * as Blockly from 'blockly/core'
import { installBlocks, astroTheme, buildToolbox } from './blocks'

/** Flèche animée « il y a d'autres blocs » quand la palette déborde de l'écran. */
export function FlyoutHint({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-20 flex h-[88px] items-center pr-1"
      aria-hidden
    >
      <div className="h-full w-16 bg-gradient-to-l from-space-900/90 to-transparent" />
      <span className="absolute right-1.5 animate-bounce-x rounded-full bg-star-400 px-2 py-0.5 font-display text-lg font-bold text-space-950 shadow-card">
        ⇢
      </span>
    </div>
  )
}

export const DEFAULT_START_XML =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '<block type="quand_demarre" deletable="false" x="16" y="16"></block></xml>'

/** L'atelier de blocs, prêt à l'emploi. */
export default function BlocklyWorkspace({
  blocks,
  starterXml,
  horizontal = false,
  maxInstances,
  onWorkspace,
}: {
  blocks: string[]
  starterXml?: string
  horizontal?: boolean
  maxInstances?: Record<string, number>
  onWorkspace: (ws: Blockly.WorkspaceSvg) => void
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<Blockly.WorkspaceSvg | null>(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    installBlocks()
    if (!divRef.current) return
    const ws = Blockly.inject(divRef.current, {
      renderer: 'zelos',
      theme: astroTheme,
      media: '/blockly-media/',
      toolbox: buildToolbox(blocks) as Blockly.utils.toolbox.ToolboxDefinition,
      horizontalLayout: horizontal,
      toolboxPosition: 'start',
      maxInstances,
      trashcan: false,
      sounds: false,
      scrollbars: true,
      zoom: { controls: false, wheel: false, startScale: horizontal ? 0.68 : 0.8, pinch: true },
      move: { drag: true, wheel: false },
      grid: { spacing: 24, length: 2, colour: 'rgba(255,255,255,0.08)', snap: false },
    })

    // La palette déborde-t-elle de l'écran ? Si oui, on montre la flèche.
    if (horizontal) {
      setTimeout(() => {
        const flyout = ws.getFlyout()
        const box = divRef.current
        if (!flyout || !box) return
        const fw = flyout.getWorkspace()
        const contentWidth = fw.getBlocksBoundingBox().right * fw.scale
        if (contentWidth + 16 > box.clientWidth) {
          setShowHint(true)
          setTimeout(() => setShowHint(false), 10000)
        }
      }, 500)
    }
    const xml = starterXml ?? DEFAULT_START_XML
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), ws)
    wsRef.current = ws
    onWorkspace(ws)

    // Toucher un bloc de la palette = l'ajouter au bout du programme.
    // (Le glisser-déposer classique reste possible.)
    const flyoutWs = ws.getFlyout()?.getWorkspace()
    flyoutWs?.addChangeListener((e: Blockly.Events.Abstract) => {
      if (e.type !== Blockly.Events.CLICK) return
      const ev = e as Blockly.Events.Click
      if (!ev.blockId) return
      const src = flyoutWs.getBlockById(ev.blockId)
      if (!src || !src.isEnabled()) return
      // Seuls les blocs « instruction » s'enchaînent d'un simple toucher
      if (!src.previousConnection && !src.type.startsWith('motif_def')) return
      try {
        const saved = Blockly.serialization.blocks.save(src)
        if (!saved) return
        delete (saved as { x?: number }).x
        delete (saved as { y?: number }).y
        const added = Blockly.serialization.blocks.append(saved, ws, { recordUndo: true })
        const start = ws.getTopBlocks(true).find((b) => b.type === 'quand_demarre')
        if (added.previousConnection && start) {
          let last: Blockly.Block = start
          while (last.getNextBlock()) last = last.getNextBlock() as Blockly.Block
          if (last.nextConnection) {
            last.nextConnection.connect(added.previousConnection)
          } else {
            added.moveBy(60, 60)
          }
        } else {
          const n = ws.getTopBlocks(false).length
          added.moveBy(240, 40 + n * 30)
        }
        ;(added as Blockly.BlockSvg).select()
        ws.centerOnBlock(added.id)
      } catch {
        // en cas de pépin, le glisser-déposer reste la voie normale
      }
    })

    // Porte d'entrée pour les tests automatiques
    ;(window as unknown as Record<string, unknown>).__astroLoadXml = (x: string) => {
      ws.clear()
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(x), ws)
    }

    const obs = new ResizeObserver(() => Blockly.svgResize(ws))
    obs.observe(divRef.current)
    return () => {
      obs.disconnect()
      ws.dispose()
      wsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-full w-full" onPointerDown={() => setShowHint(false)}>
      <div ref={divRef} className="h-full w-full" />
      <FlyoutHint visible={showHint} />
    </div>
  )
}
