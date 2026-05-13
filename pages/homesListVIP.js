import React, { useState, useEffect } from 'react'
import CardHouseVIP from '@/components/CardHouseVIP'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import jwt from 'jsonwebtoken'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

export default function VipList() {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading]             = useState(true)

  const token  = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/api_fetch_all_biens_vip')
        const data     = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleInterestedClick = async (bienId, proprietaireId) => {
    try {
      const res = await fetch('/api/api_create_like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decodedToken: token, bien_id: bienId, proprietaire_id: proprietaireId }),
      })
      if (res.ok) {
        const like = await res.json()
        router.push(`/negotiation?id_likes=${like.id_likes}&bien_id=${bienId}&proprietaire_id=${proprietaireId}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleBackClick = () => {
    try {
      const decodedToken = jwt.decode(token)
      const userType     = decodedToken ? decodedToken.userType : null
      if (userType) router.push('/panel')
    } catch (error) {
      console.error('Failed to decode token:', error)
    }
  }

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />

      {/* ── Hero banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1713 0%, #2E2118 60%, #3D2B1A 100%)',
          borderBottom: `1px solid ${BORDER}`,
          padding: '56px 40px 48px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* back link */}
          <button
            onClick={handleBackClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Raleway', sans-serif", fontSize: 10,
              letterSpacing: 3, color: 'rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: 0, marginBottom: 32, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            ← RETOUR
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 12 }}>
                ★ COLLECTION EXCLUSIVE
              </div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 48, fontWeight: 300, color: '#F5F0E8',
                  margin: 0, lineHeight: 1.1,
                }}
              >
                Biens <span style={{ fontStyle: 'italic', color: GOLD }}>prestige</span>
              </h1>
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif", fontSize: 11,
                  letterSpacing: 3, color: 'rgba(255,255,255,0.35)',
                  marginTop: 16, marginBottom: 0,
                }}
              >
                UNE SÉLECTION RIGOUREUSEMENT TRIÉE POUR VOUS
              </p>
            </div>

            {/* stat */}
            <div
              style={{
                border: `1px solid rgba(184,137,42,0.3)`,
                padding: '18px 28px',
                background: 'rgba(237,233,225,0.06)',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32, fontWeight: 300, color: GOLD, lineHeight: 1,
                }}
              >
                {loading ? '—' : searchResults.length}
              </div>
              <div
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 9, letterSpacing: 4,
                  color: 'rgba(255,255,255,0.35)', marginTop: 4,
                }}
              >
                BIENS VIP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gold rule ── */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />

      {/* ── Grid ── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 40px 96px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 380, background: BG2, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
            {searchResults.map(result => (
              <CardHouseVIP
                key={result.id_biens}
                {...result}
                token={token}
                onInterestedClick={handleInterestedClick}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 12 }}>
              Aucun bien VIP disponible
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT }}>
              Revenez bientôt pour découvrir notre sélection prestige
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}