import type { LessonContent } from '../types'
import { lune } from './lune'
import { boucla } from './boucla'
import { choizix } from './choizix'
import { memora } from './memora'
import { fabrika } from './fabrika'

const ALL: Record<string, LessonContent> = {
  ...lune,
  ...boucla,
  ...choizix,
  ...memora,
  ...fabrika,
}

export function getContent(lessonId: string): LessonContent | undefined {
  return ALL[lessonId]
}
