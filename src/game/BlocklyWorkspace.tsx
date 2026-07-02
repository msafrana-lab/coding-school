import { useEffect, useRef } from 'react'
import * as Blockly from 'blockly/core'
import { installBlocks, astroTheme, buildToolbox } from './blocks'

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
      zoom: { controls: false, wheel: false, startScale: 0.8, pinch: true },
      move: { drag: true, wheel: false },
      grid: { spacing: 24, length: 2, colour: 'rgba(255,255,255,0.08)', snap: false },
    })
    const xml = starterXml ?? DEFAULT_START_XML
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), ws)
    wsRef.current = ws
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
      wsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={divRef} className="h-full w-full" />
}
