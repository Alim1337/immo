import React, { useState, useEffect, useRef } from 'react'
import CardHouse from '../components/CardHouse'
import { useRouter } from 'next/router'
import Header from '@/components/Header'

const GOLD    = '#B8892A'
const GOLD_L  = '#D4A84B'
const GOLD_D  = '#8A6218'
const TEXT    = '#1A1713'
const MUTED   = '#5A5248'
const FAINT   = '#8A8278'
const BG      = '#EDE9E1'
const BG2     = '#E4DFD5'
// ── Key change: lighter warm charcoal instead of near-black ──
const HERO    = '#2C2820'
const HERO_2  = '#231F18'  // dropdown bg
const BORDER  = 'rgba(184,137,42,0.22)'
const BORDER2 = 'rgba(184,137,42,0.08)'

const TYPES = ['Tous', 'Villa', 'Appartement', 'Terrain', 'Local']
const SORTS = ['Plus récents', 'Prix croissant', 'Prix décroissant']

const GoldRule = ({ width = 48 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
    <div style={{ width, height: 1, background: GOLD }} />
    <div style={{ width: 5, height: 5, background: GOLD, transform: 'rotate(45deg)' }} />
  </div>
)

function SkeletonCard() {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      <div style={{
        height: 250,
        background: `linear-gradient(90deg, ${BG2} 25%, ${BG} 50%, ${BG2} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }} />
      <div style={{ padding: '20px 20px 18px' }}>
        <div style={{ height: 11, width: '65%', background: BG, marginBottom: 10, borderRadius: 1 }} />
        <div style={{ height: 9,  width: '45%', background: BG, marginBottom: 20, borderRadius: 1 }} />
        <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ height: 26, width: 66, background: BG, borderRadius: 1 }} />
          <div style={{ height: 26, width: 82, background: BG, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

export default function HomesList() {
  const [searchResults, setSearchResults] = useState([])
  const [activeType, setActiveType]       = useState('Tous')
  const [activeSort, setActiveSort]       = useState('Plus récents')
  const [sortOpen, setSortOpen]           = useState(false)
  const [loading, setLoading]             = useState(true)
  const sortRef = useRef(null)

  const token  = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/api_fetch_all_biens')
        const data = await response.json()
        setSearchResults(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
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
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = searchResults
    .filter(r => !r.biens_vip)
    .filter(r => activeType === 'Tous' || r.type_bien?.toLowerCase() === activeType.toLowerCase())
    .sort((a, b) => {
      if (activeSort === 'Prix croissant')   return (a.prix_estime || 0) - (b.prix_estime || 0)
      if (activeSort === 'Prix décroissant') return (b.prix_estime || 0) - (a.prix_estime || 0)
      return 0
    })

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />

      {/* ── Hero band ── */}
      <div style={{
        background: HERO,
        borderBottom: '1px solid rgba(184,137,42,0.2)',
        padding: '44px 0 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Diagonal texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `repeating-linear-gradient(
            -52deg,
            transparent,
            transparent 80px,
            rgba(184,137,42,0.025) 80px,
            rgba(184,137,42,0.025) 81px
          )`,
        }} />
        {/* Gold top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, ${GOLD}, rgba(184,137,42,0.3) 50%, transparent 100%)`,
        }} />

        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 48px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <button
              onClick={() => router.back()}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Raleway', sans-serif", fontSize: 10,
                letterSpacing: 3, color: 'rgba(255,255,255,0.35)',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: 0, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD_L}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              ← RETOUR
            </button>
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.22)' }}>
              CATALOGUE
            </span>
          </div>

          {/* Heading row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 32, gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 6, color: GOLD, marginBottom: 10 }}>
                CATALOGUE COMPLET
              </div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 52, fontWeight: 300, color: '#F5F0E8',
                margin: 0, lineHeight: 1,
              }}>
                Tous les biens
              </h1>
              <GoldRule width={48} />
            </div>

            {/* Count + Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
              {!loading && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: GOLD_L, lineHeight: 1 }}>
                    {filtered.length}
                  </div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>
                    BIEN{filtered.length !== 1 ? 'S' : ''} DISPONIBLE{filtered.length !== 1 ? 'S' : ''}
                  </div>
                </div>
              )}

              {/* Sort dropdown */}
              <div ref={sortRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setSortOpen(o => !o)}
                  style={{
                    background: sortOpen ? 'rgba(184,137,42,0.1)' : 'rgba(184,137,42,0.07)',
                    border: `1px solid ${sortOpen ? GOLD : BORDER}`,
                    fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2,
                    color: sortOpen ? GOLD_L : 'rgba(255,255,255,0.5)',
                    padding: '12px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'all 0.2s', minWidth: 210, justifyContent: 'space-between',
                  }}
                  onMouseEnter={e => { if (!sortOpen) { e.currentTarget.style.borderColor = GOLD_L; e.currentTarget.style.color = GOLD_L } }}
                  onMouseLeave={e => { if (!sortOpen) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
                >
                  <span>{activeSort.toUpperCase()}</span>
                  <span style={{
                    fontSize: 7, color: GOLD,
                    display: 'inline-block',
                    transition: 'transform 0.2s',
                    transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}>▼</span>
                </button>

                {sortOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 5px)',
                    minWidth: '100%', zIndex: 30,
                    background: HERO_2,
                    border: `1px solid ${BORDER}`,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  }}>
                    {SORTS.map(s => (
                      <button
                        key={s}
                        onClick={() => { setActiveSort(s); setSortOpen(false) }}
                        style={{
                          display: 'block', width: '100%',
                          background: s === activeSort ? 'rgba(184,137,42,0.1)' : 'none',
                          border: 'none', borderLeft: `2px solid ${s === activeSort ? GOLD : 'transparent'}`,
                          textAlign: 'left',
                          fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2,
                          color: s === activeSort ? GOLD_L : 'rgba(255,255,255,0.4)',
                          padding: '13px 18px', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,137,42,0.07)'; e.currentTarget.style.color = GOLD_L }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = s === activeSort ? 'rgba(184,137,42,0.1)' : 'none'
                          e.currentTarget.style.color = s === activeSort ? GOLD_L : 'rgba(255,255,255,0.4)'
                        }}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Type filter tabs */}
          <div style={{ display: 'flex', borderTop: '1px solid rgba(184,137,42,0.1)' }}>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: `2px solid ${activeType === t ? GOLD : 'transparent'}`,
                  fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                  color: activeType === t ? GOLD_L : 'rgba(255,255,255,0.28)',
                  padding: '15px 24px', cursor: 'pointer',
                  transition: 'all 0.2s', marginBottom: -1,
                }}
                onMouseEnter={e => { if (activeType !== t) e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                onMouseLeave={e => { if (activeType !== t) e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results grid ── */}
      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '56px 48px 100px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {filtered.map((result, i) => (
              <div
                key={result.id_biens}
                style={{
                  animation: 'fadeUp 0.42s ease both',
                  animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                }}
              >
                <CardHouse
                  {...result}
                  token={token}
                  onInterestedClick={handleInterestedClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: TEXT, marginBottom: 16 }}>
              Aucun bien trouvé
            </div>
            <div style={{ width: 32, height: 1, background: GOLD, margin: '0 auto 20px' }} />
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>
              ESSAYEZ UN AUTRE FILTRE
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}