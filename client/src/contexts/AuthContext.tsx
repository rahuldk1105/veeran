'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/lib/supabase'
import { supabase, signIn, signUp, signOut, getCurrentUser } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          // Get additional user data from users table
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single()
          
          if (data) {
            setUser(data as User)
          }
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (data) {
          setUser(data as User)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    if (error) throw error
  }

  const handleSignUp = async (email: string, password: string, role: string = 'viewer') => {
    const { error } = await signUp(email, password, role)
    if (error) throw error
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) throw error
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}