import type { LessonContent } from '../types'
import { lune } from './lune'
import { boucla } from './boucla'
import { choizix } from './choizix'
import { memora } from './memora'
import { fabrika } from './fabrika'
import { studio } from './studio'

const ALL: Record<string, LessonContent> = {
  ...lune,
  ...boucla,
  ...choizix,
  ...memora,
  ...fabrika,
  ...studio,
}

export function getContent(lessonId: string): LessonContent | undefined {
  return ALL[lessonId]
}
