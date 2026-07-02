import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { closeBrackets } from '@codemirror/autocomplete'
import { tags } from '@lezer/highlight'

const spaceHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#C4B0FF', fontWeight: 'bold' },
  { tag: tags.comment, color: '#6B78C8', fontStyle: 'italic' },
  { tag: tags.string, color: '#FFD23F' },
  { tag: tags.number, color: '#7DEFFB' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#5CE8A4' },
  { tag: tags.variableName, color: '#FF8A9B' },
  { tag: tags.operator, color: '#3EDDF2' },
])

const spaceTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#0B1035',
      color: '#E9E4FF',
      fontSize: '15px',
      height: '100%',
    },
    '.cm-content': { fontFamily: '"Cascadia Code", Menlo, Consolas, monospace', padding: '12px 0' },
    '.cm-gutters': { backgroundColor: '#0B1035', color: '#4A55AC', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(139, 99, 247, 0.10)' },
    '.cm-activeLineGutter': { backgroundColor: 'rgba(139, 99, 247, 0.15)' },
    '&.cm-focused': { outline: 'none' },
    '.cm-cursor': { borderLeftColor: '#3EDDF2', borderLeftWidth: '2px' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(23, 195, 222, 0.25) !important',
    },
  },
  { dark: true },
)

/** L'éditeur de vrai code, aux couleurs de la galaxie. */
export default function CodeEditor({
  initialCode,
  onView,
}: {
  initialCode: string
  onView: (view: EditorView) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const view = new EditorView({
      state: EditorState.create({
        doc: initialCode,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          bracketMatching(),
          closeBrackets(),
          javascript(),
          syntaxHighlighting(spaceHighlight),
          spaceTheme,
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        ],
      }),
      parent: ref.current,
    })
    onView(view)
    return () => view.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={ref} className="h-full w-full overflow-hidden" />
}
