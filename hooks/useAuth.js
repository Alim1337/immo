// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'

export function useAuth() {
  const [user,  setUser]  = useState(null)
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('token')
    if (raw) {
      try {
        const decoded = jwt.decode(raw)
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setToken(raw)
          setUser(decoded)
        } else {
          localStorage.removeItem('token') // expired
        }
      } catch {
        localStorage.removeItem('token')
      }
    }
    setReady(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    router.push('/')
  }, [router])

  return {
    user,
    token,
    ready,                              // true once localStorage has been read
    isLoggedIn:     !!user,
    isClient:       user?.role === 'CLIENT',
    isProprietaire: user?.role === 'PROPRIETAIRE',
    isAgence:       user?.role === 'AGENCE',
    canPublish:     user?.role === 'PROPRIETAIRE' || user?.role === 'AGENCE',
    logout,
    
  }
}