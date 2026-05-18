// pages/favoris.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import BienCard from '@/components/BienCard'
import { useAuth } from '@/hooks/useAuth'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

export default function Favoris() {
  const router = useRouter()
  const { user, token, ready, isLoggedIn } = useAuth()
  const [favoris,  setFavoris]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!ready) return
    if (!isLoggedIn) { router.push('/login'); return }
    fetch('/api/favoris', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setFavoris(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [ready, isLoggedIn])

  const removeFavori = async (bienId) => {
    await fetch('/api/favoris', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ bien_id: bienId }),
    })
    setFavoris(f => f.filter(fav => fav.bien_id !== bienId))
  }

  return (
    <>
      <Head><title>Mes favoris — E-Krili</title></Head>
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '36px 40px 28px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>ESPACE PERSONNEL</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: TEXT, margin: 0 }}>
              Mes favoris
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12 }} />
          </div>
        </div>

        <main style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '40px 40px 80px', flex: 1, boxSizing: 'border-box' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 3 }}>
              {Array.from({length: 4}).map((_,i) => <div key={i} style={{ height: 320, background: BG2, animation: 'pulse 1.5s ease-in-out infinite' }} />)}
            </div>
          ) : favoris.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 10 }}>
                Aucun favori
              </div>
              <div style={{ width: 36, height: 1, background: GOLD, margin: '0 auto 20px' }} />
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, lineHeight: 1.8 }}>
                Sauvegardez vos biens préférés en cliquant sur le cœur.
              </p>
              <button onClick={() => router.push('/biens')}
                style={{ marginTop: 24, background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '12px 28px', cursor: 'pointer' }}>
                PARCOURIR LES BIENS
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT, marginBottom: 24 }}>
                {favoris.length} bien{favoris.length !== 1 ? 's' : ''} sauvegardé{favoris.length !== 1 ? 's' : ''}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 3 }}>
                {favoris.map(f => (
                  <BienCard
                    key={f.bien_id}
                    bien={f.bien}
                    isFavorite
                    onRemoveFavorite={() => removeFavori(f.bien_id)}
                    onClick={() => router.push(`/biens/${f.bien_id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </>
  )
}