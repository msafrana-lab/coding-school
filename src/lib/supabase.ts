import { createClient } from '@supabase/supabase-js'

// La clé « publishable » est faite pour être visible côté navigateur :
// toutes les données sont protégées par Row Level Security côté serveur.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://jccxdwtekvamrpqkdepl.supabase.co'
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_nG-IWNtmGhQv3u4387bBAA_iwuVGcGD'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
