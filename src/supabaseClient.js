import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkkmyjspddpieefamyem.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJra215anNwZGRwaWVlZmFteWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDc2MDQsImV4cCI6MjA4NDk4MzYwNH0.mL2e9cSd-BEeT4-4aOeBH_YAW5jWyfFqH0sj_jD4mTY'

export const supabase = createClient(supabaseUrl, supabaseKey)
