import { useEffect, useRef, useState } from 'react'
import * as Blockly from 'blockly/core'
import { astroTheme } from '../game/blocks'
import { FlyoutHint } from '../game/BlocklyWorkspace'
import { installStudioBlocks, STUDIO_TOOLBOX } from './blocks'

/** L'atelier de règles du Studio. */
export default function StudioWorkspace({
  initialXml,
  horizontal = false,
  onWorkspace,
  onChange,
}: {
  initialXml?: string
  horizontal?: boolean
  onWorkspace: (ws: Blockly.WorkspaceSvg) => void
  onChange?: () => void
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    installStudioBlocks()
    if (!divRef.current) return
    const ws = Blockly.inject(divRef.current, {
      renderer: 'zelos',
      theme: astroTheme,
      media: '/blockly-media/',
      toolbox: STUDIO_TOOLBOX as Blockly.utils.toolbox.ToolboxDefinition,
      horizontalLayout: horizontal,
      toolboxPosition: 'start',
      trashcan: false,
      sounds: false,
      scrollbars: true,
      zoom: { controls: false, wheel: false, startScale: horizontal ? 0.65 : 0.75, pinch: true },
      move: { drag: true, wheel: false },
      grid: { spacing: 24, length: 2, colour: 'rgba(255,255,255,0.08)', snap: false },
    })

    // Beaucoup de blocs dans le Studio : montre la flèche « ça défile » sur mobile
    if (horizontal) {
      setTimeout(() => {
        const flyout = ws.getFlyout()
        const box = divRef.current
        if (!flyout || !box) return
        const fw = flyout.getWorkspace()
        if (fw.getBlocksBoundingBox().right * fw.scale + 16 > box.clientWidth) {
          setShowHint(true)
          setTimeout(() => setShowHint(false), 10000)
        }
      }, 500)
    }
    if (initialXml) {
      try {
        Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(initialXml), ws)
      } catch {
        // XML invalide : on repart d'un atelier vide
      }
    }
    ws.addChangeListener((e: Blockly.Events.Abstract) => {
      if (e.isUiEvent) return
      onChange?.()
    })
    onWorkspace(ws)

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
