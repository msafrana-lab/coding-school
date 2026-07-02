export type Profile = {
  id: string
  display_name: string | null
  avatar: string
  xp: number
  streak_count: number
  last_active_date: string | null
  sound_on: boolean
}

export type LessonProgress = {
  lesson_id: string
  stars: number
  completed: boolean
  attempts: number
}

export type SavedProject = {
  id: string
  title: string
  kind: string
  data: Record<string, unknown>
  updated_at: string
}
