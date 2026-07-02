import type { LessonContent } from '../types'
import { lune } from './lune'
import { boucla } from './boucla'
import { choizix } from './choizix'

const ALL: Record<string, LessonContent> = {
  ...lune,
  ...boucla,
  ...choizix,
}

export function getContent(lessonId: string): LessonContent | undefined {
  return ALL[lessonId]
}
