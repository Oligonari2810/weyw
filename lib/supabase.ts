import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Log para debug
console.log('📡 SUPABASE_URL:', supabaseUrl ? '✓ Definido' : '❌ Vacío')
console.log('📡 SUPABASE_ANON_KEY:', supabaseKey ? '✓ Definido' : '❌ Vacío')

export const supabase = createClient(supabaseUrl, supabaseKey)
