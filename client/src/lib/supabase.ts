import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type User = {
  id: string
  email: string
  role: 'admin' | 'analyst' | 'viewer'
  created_at: string
  last_login?: string
  updated_at: string
}

export type Metric = {
  id: string
  metric_name: string
  value: number
  category: string
  recorded_at: string
}

export type DashboardView = {
  id: string
  user_id: string
  view_name: string
  configuration: any
  created_at: string
  updated_at: string
}

export type Report = {
  id: string
  user_id: string
  report_type: string
  data: any
  generated_at: string
}

// Authentication functions
export const signUp = async (email: string, password: string, role: string = 'viewer') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role }
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database functions
export const getMetrics = async (category?: string) => {
  let query = supabase.from('metrics').select('*')
  if (category) {
    query = query.eq('category', category)
  }
  const { data, error } = await query.order('recorded_at', { ascending: false })
  return { data, error }
}

export const getDashboardViews = async (userId: string) => {
  const { data, error } = await supabase
    .from('dashboard_views')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export const createDashboardView = async (userId: string, viewName: string, configuration: any) => {
  const { data, error } = await supabase
    .from('dashboard_views')
    .insert([{ user_id: userId, view_name: viewName, configuration }])
  return { data, error }
}

export const getReports = async (userId: string) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
  return { data, error }
}

export const createReport = async (userId: string, reportType: string, data: any) => {
  const { data: report, error } = await supabase
    .from('reports')
    .insert([{ user_id: userId, report_type: reportType, data }])
  return { data: report, error }
}