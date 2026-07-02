// Petit simulateur de Supabase pour tester l'interface hors-ligne.
import fs from 'fs'

export const UID = '81433cbf-14fe-4b69-b778-4c8e9a7d987a'
export const REF = 'jccxdwtekvamrpqkdepl'

export function findChrome() {
  const base = '/opt/pw-browsers'
  for (const dir of fs.readdirSync(base)) {
    if (dir.startsWith('chromium-')) {
      const p = `${base}/${dir}/chrome-linux/chrome`
      if (fs.existsSync(p)) return p
    }
  }
  return `${base}/chromium`
}

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')

export function makeSession() {
  const jwt = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({
    sub: UID,
    role: 'authenticated',
    email: 'test.famille@astrocode.test',
    exp: Math.floor(Date.now() / 1000) + 3600,
  })}.sig`
  return {
    access_token: jwt,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh',
    user: { id: UID, aud: 'authenticated', email: 'test.famille@astrocode.test', role: 'authenticated' },
  }
}

/**
 * Installe le faux serveur et une session déjà ouverte.
 * state = { profile: {...}, progress: [{lesson_id, stars, completed, attempts}], projects: [] }
 */
export async function installStub(context, state) {
  const session = makeSession()
  await context.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [`sb-${REF}-auth-token`, JSON.stringify(session)],
  )

  await context.route(`**/${REF}.supabase.co/**`, async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    const path = url.pathname
    const method = req.method()
    const json = (body, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

    if (path.endsWith('/auth/v1/token')) return json(session)
    if (path.endsWith('/auth/v1/user')) return json(session.user)
    if (path.endsWith('/auth/v1/logout')) return json({}, 204)

    if (path.includes('/rest/v1/profiles')) {
      if (method === 'POST' || method === 'PATCH') {
        const body = JSON.parse(req.postData() || '{}')
        Object.assign(state.profile, Array.isArray(body) ? body[0] : body)
        return json(state.profile, 201)
      }
      return json(state.profile)
    }
    if (path.includes('/rest/v1/lesson_progress')) {
      if (method === 'POST' || method === 'PATCH') {
        const body = JSON.parse(req.postData() || '{}')
        const rows = Array.isArray(body) ? body : [body]
        for (const r of rows) {
          const i = state.progress.findIndex((p) => p.lesson_id === r.lesson_id)
          if (i >= 0) state.progress[i] = { ...state.progress[i], ...r }
          else state.progress.push(r)
        }
        return json(rows, 201)
      }
      return json(state.progress)
    }
    if (path.includes('/rest/v1/projects')) {
      if (method === 'POST' || method === 'PATCH') {
        const body = JSON.parse(req.postData() || '{}')
        const row = Array.isArray(body) ? body[0] : body
        row.id = row.id ?? 'proj-' + (state.projects.length + 1)
        row.updated_at = new Date().toISOString()
        const i = state.projects.findIndex((p) => p.id === row.id)
        if (i >= 0) state.projects[i] = { ...state.projects[i], ...row }
        else state.projects.push(row)
        return json(row, 201)
      }
      return json(state.projects)
    }
    if (path.includes('/rest/v1/activity_log')) {
      if (method === 'POST' || method === 'PATCH') return json([], 201)
      return json(state.activity ?? [])
    }
    return json([])
  })
}

export function baseState(overrides = {}) {
  return {
    profile: {
      id: UID,
      display_name: 'Luna',
      avatar: '🦄',
      xp: 130,
      streak_count: 3,
      last_active_date: null,
      sound_on: true,
    },
    progress: [],
    projects: [],
    activity: [],
    ...overrides,
  }
}
