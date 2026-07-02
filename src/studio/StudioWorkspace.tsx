import { useEffect, useRef } from 'react'
import * as Blockly from 'blockly/core'
import { astroTheme } from '../game/blocks'
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
      zoom: { controls: false, wheel: false, startScale: 0.75, pinch: true },
      move: { drag: true, wheel: false },
      grid: { spacing: 24, length: 2, colour: 'rgba(255,255,255,0.08)', snap: false },
    })
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

  return <div ref={divRef} className="h-full w-full" />
}
