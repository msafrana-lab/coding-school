import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Profile } from './types'

type ProgressMap = Record<string, { stars: number; completed: boolean; attempts: number }>

type State = {
  ready: boolean
  session: Session | null
  profile: Profile | null
  progress: ProgressMap
  init: () => void
  reloadData: () => Promise<void>
  signOut: () => Promise<void>
  saveProfile: (patch: Partial<Profile>) => Promise<void>
  recordLessonResult: (lessonId: string, stars: number) => Promise<{ xpGained: number; newBest: boolean }>
  addMinutes: (minutes: number) => Promise<void>
}

function today(): string {
  const d = new Date()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function yesterday(): string {
  const d = new Date(Date.now() - 24 * 3600 * 1000)
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

let initialized = false

export const useStore = create<State>((set, get) => ({
  ready: false,
  session: null,
  profile: null,
  progress: {},

  init: () => {
    if (initialized) return
    initialized = true
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session })
      if (data.session) get().reloadData().then(() => set({ ready: true }))
      else set({ ready: true })
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      const hadSession = !!get().session
      set({ session })
      if (session && !hadSession) {
        get().reloadData()
      }
      if (!session) set({ profile: null, progress: {} })
    })
  },

  reloadData: async () => {
    const session = get().session ?? (await supabase.auth.getSession()).data.session
    if (!session) return
    const uid = session.user.id

    let { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
    if (!profile) {
      // Filet de sécurité si le trigger n'a pas encore créé le profil
      const { data: created } = await supabase
        .from('profiles')
        .upsert({ id: uid }, { onConflict: 'id' })
        .select()
        .maybeSingle()
      profile = created
    }

    const { data: rows } = await supabase
      .from('lesson_progress')
      .select('lesson_id, stars, completed, attempts')
      .eq('user_id', uid)

    const progress: ProgressMap = {}
    for (const r of rows ?? []) {
      progress[r.lesson_id] = { stars: r.stars, completed: r.completed, attempts: r.attempts }
    }
    set({ profile: profile as Profile | null, progress })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ profile: null, progress: {}, session: null })
  },

  saveProfile: async (patch) => {
    const { profile, session } = get()
    if (!session) return
    const next = { ...(profile as Profile), ...patch, id: session.user.id }
    set({ profile: next })
    await supabase.from('profiles').upsert(
      {
        id: session.user.id,
        display_name: next.display_name,
        avatar: next.avatar,
        xp: next.xp ?? 0,
        streak_count: next.streak_count ?? 0,
        last_active_date: next.last_active_date,
        sound_on: next.sound_on ?? true,
      },
      { onConflict: 'id' },
    )
  },

  recordLessonResult: async (lessonId, stars) => {
    const { session, progress, profile } = get()
    if (!session || !profile) return { xpGained: 0, newBest: false }
    const uid = session.user.id
    const prev = progress[lessonId]
    const firstTime = !prev?.completed
    const newBest = !prev || stars > prev.stars

    // XP : première réussite = 20 + 10/étoile ; amélioration = 10 ; sinon 2
    const xpGained = firstTime ? 20 + stars * 10 : newBest ? 10 : 2

    const entry = {
      user_id: uid,
      lesson_id: lessonId,
      stars: Math.max(stars, prev?.stars ?? 0),
      completed: true,
      attempts: (prev?.attempts ?? 0) + 1,
      updated_at: new Date().toISOString(),
    }
    set({ progress: { ...progress, [lessonId]: { stars: entry.stars, completed: true, attempts: entry.attempts } } })
    await supabase.from('lesson_progress').upsert(entry, { onConflict: 'user_id,lesson_id' })

    // Série de jours : +1 si dernière activité hier, inchangée si aujourd'hui, sinon repart à 1
    const t = today()
    let streak = profile.streak_count
    if (profile.last_active_date === t) {
      // déjà comptée aujourd'hui
    } else if (profile.last_active_date === yesterday()) {
      streak = streak + 1
    } else {
      streak = 1
    }
    await get().saveProfile({ xp: profile.xp + xpGained, streak_count: streak, last_active_date: t })

    // Journal d'activité (leçons du jour)
    if (firstTime) {
      const { data: row } = await supabase
        .from('activity_log')
        .select('lessons_done, minutes')
        .eq('user_id', uid)
        .eq('day', t)
        .maybeSingle()
      await supabase.from('activity_log').upsert(
        { user_id: uid, day: t, minutes: row?.minutes ?? 0, lessons_done: (row?.lessons_done ?? 0) + 1 },
        { onConflict: 'user_id,day' },
      )
    }

    return { xpGained, newBest }
  },

  addMinutes: async (minutes) => {
    const { session } = get()
    if (!session) return
    const uid = session.user.id
    const t = today()
    const { data: row } = await supabase
      .from('activity_log')
      .select('minutes, lessons_done')
      .eq('user_id', uid)
      .eq('day', t)
      .maybeSingle()
    await supabase.from('activity_log').upsert(
      { user_id: uid, day: t, minutes: (row?.minutes ?? 0) + minutes, lessons_done: row?.lessons_done ?? 0 },
      { onConflict: 'user_id,day' },
    )
  },
}))
