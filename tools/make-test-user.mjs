import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://jccxdwtekvamrpqkdepl.supabase.co',
  'sb_publishable_nG-IWNtmGhQv3u4387bBAA_iwuVGcGD'
)
const email = process.argv[2] ?? 'astrocode.test.famille@gmail.com'
const { data, error } = await supabase.auth.signUp({ email, password: 'AstroTest!2026' })
console.log(JSON.stringify({ user: data?.user?.id, session: !!data?.session, error: error?.message }, null, 2))
