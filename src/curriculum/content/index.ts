import type { LessonContent } from '../types'
import { lune } from './lune'
import { boucla } from './boucla'
import { choizix } from './choizix'
import { memora } from './memora'
import { fabrika } from './fabrika'
import { studio } from './studio'
import { nebula } from './nebula'
import { final } from './final'

const ALL: Record<string, LessonContent> = {
  ...lune,
  ...boucla,
  ...choizix,
  ...memora,
  ...fabrika,
  ...studio,
  ...nebula,
  ...final,
}

export function getContent(lessonId: string): LessonContent | undefined {
  return ALL[lessonId]
}
