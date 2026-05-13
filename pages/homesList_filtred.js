import React, { useState, useEffect, useCallback } from 'react'
import CardHouse from '../components/CardHouse'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import jwt from 'jsonwebtoken'

/* ─── Tokens ─────────────────────────────────────────────── */
const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BG3    = '#D8D2C6'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.22)'

const R = (s) => ({ fontFamily: "'Raleway', sans-serif", ...s })
const C = (s) => ({ fontFamily: "'Cormorant Garamond', serif", ...s })

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const ICONS = {
  grid:    'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  list:    'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  x:       'M18 6L6 18M6 6l12 12',
  search:  'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  heart:   'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  share:   'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  phone:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2.6h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z',
  bed:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  mappin:  'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  chevD:   'M6 9l6 6 6-6',
  arrow:   'M19 12H5M12 5l-7 7 7 7',
  home:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
}

const PLACEHOLDERS = ['toutes les willaya','toutes les villes','type de bien','taille','']
const isPlaceholder = (v) => !v || PLACEHOLDERS.includes(v.toLowerCase().trim())
const PRICE_MAX = 100_000_000

const TYPE_IMAGES = {
  villa:       'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  appartement: 'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
}
const getImg = (type) => TYPE_IMAGES[type?.toLowerCase()] || TYPE_IMAGES.appartement

/* ═══════════════════════════════════════════════════════════ */
export default function HomesListFiltred() {
  const [results, setResults]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [viewMode, setViewMode]       = useState('list')   // 'list' | 'grid'
  const [sortBy, setSortBy]           = useState('recent')
  const [sortOpen, setSortOpen]       = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Local sidebar filter state
  const [priceMin, setPriceMin]       = useState(0)
  const [priceMax, setPriceMax]       = useState(PRICE_MAX)
  const [typeFilter, setTypeFilter]   = useState([])
  const [roomFilter, setRoomFilter]   = useState(null)
  const [savedIds, setSavedIds]       = useState([])

  const token  = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const router = useRouter()

  /* ── Fetch ── */
  useEffect(() => {
    if (!router.isReady) return
    async function fetchData() {
      setLoading(true); setError(null)
      try {
        const { address, location, propertyType } = router.query
        const res = await fetch('/api/api_rechercher_filtre', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, location, propertyType }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Erreur serveur')
        const data = await res.json()
        setResults(data.searchResults || [])
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [router.isReady, router.query])

  /* ── Interested click ── */
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
    } catch (e) { console.error(e) }
  }

  /* ── Active query filters (from URL) ── */
  const { address, location, propertyType } = router.query || {}
  const urlFilters = [
    !isPlaceholder(location)     && { key: 'location',     label: location },
    !isPlaceholder(address)      && { key: 'address',      label: address },
    !isPlaceholder(propertyType) && { key: 'propertyType', label: propertyType },
  ].filter(Boolean)

  const removeUrlFilter = (key) => {
    const q = { ...router.query }
    delete q[key]
    router.push({ pathname: router.pathname, query: q })
  }

  /* ── Apply sidebar filters + sort ── */
  const filtered = results
    .filter(r => {
      const p = Number(r.prix_estime) || 0
      if (p < priceMin || p > priceMax) return false
      if (typeFilter.length && !typeFilter.includes(r.type_bien?.toLowerCase())) return false
      if (roomFilter && Number(r.nbrChambre) !== roomFilter) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc')  return (Number(a.prix_estime) || 0) - (Number(b.prix_estime) || 0)
      if (sortBy === 'price_desc') return (Number(b.prix_estime) || 0) - (Number(a.prix_estime) || 0)
      return 0
    })

  const SORTS = [
    { key: 'recent',     label: 'Plus récents' },
    { key: 'price_asc',  label: 'Prix croissant' },
    { key: 'price_desc', label: 'Prix décroissant' },
  ]
  const TYPES = ['appartement', 'villa', 'terrain', 'local']
  const ROOMS = [1, 2, 3, 4, 5]

  const toggleType = (t) => setTypeFilter(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t])
  const toggleSave = (id) => setSavedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* ── Top bar ── */}
      <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: '0 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Breadcrumb + title */}
          <div style={{ padding: '28px 0 0' }}>
            <button
              onClick={() => router.back()}
              style={{ ...R({ fontSize: 9, letterSpacing: 3, color: MUTED }), background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 14, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = MUTED}
            >
              <Icon d={ICONS.arrow} size={12} /> RETOUR
            </button>
            <div style={{ ...R({ fontSize: 9, letterSpacing: 5, color: GOLD }), marginBottom: 8 }}>RÉSULTATS DE RECHERCHE</div>
            <h1 style={{ ...C({ fontSize: 32, fontWeight: 300, color: TEXT }), margin: 0 }}>
              {urlFilters.length ? urlFilters.map(f => f.label).join(' · ') : 'Tous les biens'}
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12 }} />
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', gap: 12, flexWrap: 'wrap' }}>

            {/* Left: filter chips + count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(o => !o)}
                style={{ ...R({ fontSize: 9, letterSpacing: 2, color: sidebarOpen ? GOLD : MUTED }), background: 'none', border: `1px solid ${sidebarOpen ? GOLD : BORDER}`, padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
              >
                <Icon d={ICONS.sliders} size={12} /> FILTRES
              </button>

              {/* URL filter chips */}
              {urlFilters.map(f => (
                <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid rgba(184,137,42,0.4)`, background: 'rgba(184,137,42,0.06)', padding: '4px 10px' }}>
                  <span style={{ ...R({ fontSize: 9, letterSpacing: 1, color: GOLD }) }}>{f.label.toUpperCase()}</span>
                  <button onClick={() => removeUrlFilter(f.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, padding: 0, display: 'flex', lineHeight: 1 }}>
                    <Icon d={ICONS.x} size={10} />
                  </button>
                </div>
              ))}

              {/* Sidebar filter chips */}
              {typeFilter.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid rgba(184,137,42,0.4)`, background: 'rgba(184,137,42,0.06)', padding: '4px 10px' }}>
                  <span style={{ ...R({ fontSize: 9, letterSpacing: 1, color: GOLD }) }}>{t.toUpperCase()}</span>
                  <button onClick={() => toggleType(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, padding: 0, display: 'flex' }}>
                    <Icon d={ICONS.x} size={10} />
                  </button>
                </div>
              ))}
              {roomFilter && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid rgba(184,137,42,0.4)`, background: 'rgba(184,137,42,0.06)', padding: '4px 10px' }}>
                  <span style={{ ...R({ fontSize: 9, letterSpacing: 1, color: GOLD }) }}>{roomFilter} CH.</span>
                  <button onClick={() => setRoomFilter(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, padding: 0, display: 'flex' }}>
                    <Icon d={ICONS.x} size={10} />
                  </button>
                </div>
              )}

              {!loading && (
                <span style={{ ...R({ fontSize: 10, color: FAINT, letterSpacing: 1 }) }}>
                  {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Right: sort + view toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

              {/* Sort dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setSortOpen(o => !o)}
                  style={{ ...R({ fontSize: 9, letterSpacing: 2, color: MUTED }), background: 'none', border: `1px solid ${BORDER}`, padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                  onMouseLeave={e => { if (!sortOpen) e.currentTarget.style.borderColor = BORDER }}
                >
                  {SORTS.find(s => s.key === sortBy)?.label.toUpperCase()}
                  <Icon d={ICONS.chevD} size={10} />
                </button>
                {sortOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: BG, border: `1px solid ${BORDER}`, zIndex: 20, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    {SORTS.map(s => (
                      <button key={s.key} onClick={() => { setSortBy(s.key); setSortOpen(false) }}
                        style={{ ...R({ fontSize: 9, letterSpacing: 2, color: s.key === sortBy ? GOLD : MUTED }), display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer' }}>
                        {s.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View toggle */}
              <div style={{ display: 'flex', border: `1px solid ${BORDER}` }}>
                {[{ mode: 'list', icon: ICONS.list }, { mode: 'grid', icon: ICONS.grid }].map(({ mode, icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    style={{ background: viewMode === mode ? DARK : 'transparent', border: 'none', padding: '7px 10px', cursor: 'pointer', color: viewMode === mode ? BG : MUTED, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}>
                    <Icon d={icon} size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + results ── */}
      <div style={{ display: 'flex', flex: 1, maxWidth: 1400, margin: '0 auto', width: '100%', padding: '32px 40px 72px', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside style={{ width: 240, flexShrink: 0, background: BG, border: `1px solid ${BORDER}`, padding: '24px 20px', position: 'sticky', top: 80 }}>

            <div style={{ ...R({ fontSize: 9, letterSpacing: 4, color: GOLD }), marginBottom: 20 }}>AFFINER</div>

            {/* Price range */}
            <FilterBlock title="PRIX (DZD)">
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <PriceInput label="Min" value={priceMin} onChange={setPriceMin} />
                <PriceInput label="Max" value={priceMax === PRICE_MAX ? '' : priceMax} onChange={(v) => setPriceMax(v || PRICE_MAX)} placeholder="Max" />
              </div>
              <input type="range" min={0} max={PRICE_MAX} step={500000} value={priceMax === PRICE_MAX ? PRICE_MAX : priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: GOLD }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', ...R({ fontSize: 8, letterSpacing: 1, color: FAINT, marginTop: 4 }) }}>
                <span>0</span><span>{priceMax === PRICE_MAX ? '100M+' : `${(priceMax / 1_000_000).toFixed(0)}M`}</span>
              </div>
            </FilterBlock>

            <div style={{ height: 1, background: BORDER, margin: '18px 0' }} />

            {/* Type */}
            <FilterBlock title="TYPE DE BIEN">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {TYPES.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <div onClick={() => toggleType(t)} style={{
                      width: 14, height: 14, border: `1px solid ${typeFilter.includes(t) ? GOLD : BG3}`,
                      background: typeFilter.includes(t) ? GOLD : 'transparent',
                      flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {typeFilter.includes(t) && <span style={{ color: BG, fontSize: 9, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ ...R({ fontSize: 10, letterSpacing: 1, color: typeFilter.includes(t) ? TEXT : MUTED }) }}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                  </label>
                ))}
              </div>
            </FilterBlock>

            <div style={{ height: 1, background: BORDER, margin: '18px 0' }} />

            {/* Rooms */}
            <FilterBlock title="CHAMBRES">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ROOMS.map(r => (
                  <button key={r} onClick={() => setRoomFilter(roomFilter === r ? null : r)}
                    style={{ ...R({ fontSize: 10, color: roomFilter === r ? BG : MUTED }), width: 32, height: 32, border: `1px solid ${roomFilter === r ? GOLD : BORDER}`, background: roomFilter === r ? GOLD : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {r}
                  </button>
                ))}
                <button onClick={() => setRoomFilter(6)}
                  style={{ ...R({ fontSize: 9, color: roomFilter === 6 ? BG : MUTED }), padding: '0 8px', height: 32, border: `1px solid ${roomFilter === 6 ? GOLD : BORDER}`, background: roomFilter === 6 ? GOLD : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                  6+
                </button>
              </div>
            </FilterBlock>

            <div style={{ height: 1, background: BORDER, margin: '18px 0' }} />

            {/* Reset */}
            <button
              onClick={() => { setPriceMin(0); setPriceMax(PRICE_MAX); setTypeFilter([]); setRoomFilter(null) }}
              style={{ ...R({ fontSize: 9, letterSpacing: 2, color: FAINT }), background: 'none', border: `1px solid ${BORDER}`, width: '100%', padding: '9px 0', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = MUTED; e.currentTarget.style.color = MUTED }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = FAINT }}
            >
              RÉINITIALISER
            </button>
          </aside>
        )}

        {/* ── Results ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px,1fr))' : '1fr', gap: viewMode === 'grid' ? 3 : 8 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: viewMode === 'grid' ? 340 : 140, background: BG2, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>

          ) : error ? (
            <EmptyState
              title="Une erreur est survenue"
              body={error}
              cta="RETOUR"
              onCta={() => router.back()}
            />

          ) : filtered.length === 0 ? (
            <EmptyState
              title="Aucun bien trouvé"
              body="Aucun bien ne correspond à vos critères. Essayez d'élargir votre recherche ou de modifier les filtres."
              cta="VOIR TOUS LES BIENS"
              onCta={() => router.push('/homesList')}
              ctaSecondary="MODIFIER LES FILTRES"
              onCtaSecondary={() => router.back()}
            />

          ) : viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 3 }}>
              {filtered.map(r => (
                <GridCard key={r.id_biens} result={r} token={token} saved={savedIds.includes(r.id_biens)}
                  onSave={() => toggleSave(r.id_biens)}
                  onInterested={() => handleInterestedClick(r.id_biens, r.Proprietaire?.id_proprietaire)} />
              ))}
            </div>

          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {filtered.map(r => (
                <ListCard key={r.id_biens} result={r} token={token} saved={savedIds.includes(r.id_biens)}
                  onSave={() => toggleSave(r.id_biens)}
                  onInterested={() => handleInterestedClick(r.id_biens, r.Proprietaire?.id_proprietaire)} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}

/* ── List card (default view) ──────────────────────────────── */
function ListCard({ result, token, saved, onSave, onInterested }) {
  const [hover, setHover]       = useState(false)
  const [actionsVis, setActionsVis] = useState(false)

  const { id_biens, description, type_bien, adresse, ville, prix_estime, etat, nbrChambre, Proprietaire } = result

  return (
    <div
      onMouseEnter={() => { setHover(true); setActionsVis(true) }}
      onMouseLeave={() => { setHover(false); setActionsVis(false) }}
      style={{
        background: hover ? '#F5F1EA' : BG,
        border: `1px solid ${hover ? GOLD : BORDER}`,
        display: 'flex', gap: 0, overflow: 'hidden',
        transition: 'all 0.2s',
        boxShadow: hover ? '0 6px 24px rgba(0,0,0,0.07)' : 'none',
        transform: hover ? 'translateY(-1px)' : 'none',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div style={{ width: 200, height: 148, flexShrink: 0, position: 'relative', overflow: 'hidden', background: BG2 }}>
        <img src={getImg(type_bien)} alt={description || 'Bien'} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hover ? 'scale(1.05)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(20,15,10,0.3))' }} />
        {type_bien && (
          <div style={{ position: 'absolute', bottom: 10, left: 10, ...R({ fontSize: 7, letterSpacing: 2, color: '#F5F0E8' }), background: 'rgba(20,15,10,0.6)', padding: '3px 8px', backdropFilter: 'blur(4px)' }}>
            {type_bien.toUpperCase()}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ ...C({ fontSize: 18, fontWeight: 400, color: TEXT, lineHeight: 1.2 }), flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {description || '—'}
            </div>
            <div style={{ ...C({ fontSize: 20, fontWeight: 400, color: DARK }), flexShrink: 0 }}>
              {prix_estime ? `${Number(prix_estime).toLocaleString('fr-DZ')}` : 'Sur dem.'}
              <span style={{ ...R({ fontSize: 9, color: FAINT, marginLeft: 4 }) }}>DZD</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <Icon d={ICONS.mappin} size={10} />
            <span style={{ ...R({ fontSize: 10, letterSpacing: 0.5, color: FAINT }) }}>
              {[adresse, ville].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          {/* Meta chips */}
          <div style={{ display: 'flex', gap: 8 }}>
            {nbrChambre && <MetaChip icon={ICONS.bed} label={`${nbrChambre} ch.`} />}
            {etat        && <MetaChip label={etat} />}
            {Proprietaire?.nom && <MetaChip label={Proprietaire.nom} />}
          </div>

          {/* Quick actions — fade in on hover */}
          <div style={{ display: 'flex', gap: 6, opacity: actionsVis ? 1 : 0, transition: 'opacity 0.2s' }}>
            <QuickBtn icon={ICONS.heart} filled={saved} gold={saved} onClick={onSave} title="Sauvegarder" />
            <QuickBtn icon={ICONS.share} onClick={() => {}} title="Partager" />
            {token && <QuickBtn icon={ICONS.phone} primary onClick={onInterested} title="Contacter" />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Grid card ──────────────────────────────────────────────── */
function GridCard({ result, token, saved, onSave, onInterested }) {
  const [hover, setHover] = useState(false)
  const { id_biens, description, type_bien, adresse, ville, prix_estime, etat, nbrChambre, Proprietaire } = result

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#F5F1EA', border: `1px solid ${hover ? GOLD : BORDER}`,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'all 0.2s',
        boxShadow: hover ? '0 12px 32px rgba(0,0,0,0.1)' : 'none',
        transform: hover ? 'translateY(-3px)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: BG2 }}>
        <img src={getImg(type_bien)} alt={description || 'Bien'} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hover ? 'scale(1.06)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,10,0.65) 0%, transparent 55%)', pointerEvents: 'none' }} />
        {type_bien && (
          <div style={{ position: 'absolute', top: 10, left: 10, ...R({ fontSize: 7, letterSpacing: 2, color: '#F5F0E8' }), background: 'rgba(20,15,10,0.55)', padding: '3px 8px' }}>
            {type_bien.toUpperCase()}
          </div>
        )}
        {/* Hover action bar */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6, opacity: hover ? 1 : 0, transition: 'opacity 0.2s' }}>
          <QuickBtn icon={ICONS.heart} filled={saved} gold={saved} onClick={onSave} title="Sauvegarder" small />
          <QuickBtn icon={ICONS.share} onClick={() => {}} title="Partager" small />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px' }}>
          <div style={{ ...C({ fontSize: 19, fontWeight: 400, color: '#F5F0E8' }) }}>
            {prix_estime ? `${Number(prix_estime).toLocaleString('fr-DZ')} DZD` : 'Sur demande'}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...C({ fontSize: 15, fontWeight: 400, color: TEXT, lineHeight: 1.2 }) }}>{description || '—'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon d={ICONS.mappin} size={10} />
          <span style={{ ...R({ fontSize: 10, color: FAINT }) }}>{[adresse, ville].filter(Boolean).join(', ')}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
          {nbrChambre && <MetaChip icon={ICONS.bed} label={`${nbrChambre} ch.`} />}
          {etat        && <MetaChip label={etat} />}
        </div>
        {token && (
          <button
            onClick={onInterested}
            style={{ ...R({ fontSize: 8, letterSpacing: 3, color: hover ? BG : GOLD }), background: hover ? GOLD : 'transparent', border: `1px solid ${GOLD}`, padding: '9px 0', cursor: 'pointer', marginTop: 4, transition: 'all 0.2s' }}
          >
            CONTACTER
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Empty state ────────────────────────────────────────────── */
function EmptyState({ title, body, cta, onCta, ctaSecondary, onCtaSecondary }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 40px' }}>
      {/* SVG illustration */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 24, opacity: 0.35 }}>
        <rect x="10" y="30" width="60" height="40" rx="2" stroke={GOLD} strokeWidth="1.5" />
        <path d="M10 42h60" stroke={GOLD} strokeWidth="1" strokeDasharray="4 3" />
        <path d="M40 10L10 30h60L40 10z" stroke={GOLD} strokeWidth="1.5" />
        <circle cx="58" cy="58" r="12" fill={BG2} stroke={GOLD} strokeWidth="1.5" />
        <path d="M54 58h8M58 54v8" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div style={{ ...C({ fontSize: 28, fontWeight: 300, color: TEXT }), marginBottom: 12 }}>{title}</div>
      <div style={{ width: 36, height: 1, background: GOLD, margin: '0 auto 20px' }} />
      <p style={{ ...R({ fontSize: 12, color: FAINT, lineHeight: 1.8, fontWeight: 300 }), maxWidth: 400, margin: '0 auto 32px' }}>{body}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {ctaSecondary && (
          <button onClick={onCtaSecondary}
            style={{ ...R({ fontSize: 9, letterSpacing: 3, color: MUTED }), background: 'transparent', border: `1px solid ${BORDER}`, padding: '12px 24px', cursor: 'pointer' }}>
            {ctaSecondary}
          </button>
        )}
        <button onClick={onCta}
          style={{ ...R({ fontSize: 9, letterSpacing: 3, color: BG }), background: GOLD, border: 'none', padding: '12px 24px', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
          onMouseLeave={e => e.currentTarget.style.background = GOLD}>
          {cta}
        </button>
      </div>
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────────── */
function FilterBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ ...R({ fontSize: 8, letterSpacing: 3, color: FAINT }), marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  )
}

function PriceInput({ label, value, onChange, placeholder }) {
  return (
    <input
      type="number" value={value} placeholder={placeholder || label}
      onChange={e => onChange(Number(e.target.value))}
      style={{ ...R({ fontSize: 10, color: TEXT }), flex: 1, background: BG2, border: `1px solid ${BORDER}`, padding: '6px 8px', outline: 'none', width: 0 }}
      onFocus={e => e.currentTarget.style.borderColor = GOLD}
      onBlur={e => e.currentTarget.style.borderColor = BORDER}
    />
  )
}

function MetaChip({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: `1px solid ${BORDER}`, padding: '2px 7px', ...R({ fontSize: 9, letterSpacing: 0.5, color: MUTED }) }}>
      {icon && <Icon d={icon} size={10} />} {label}
    </div>
  )
}

function QuickBtn({ icon, onClick, title, primary, gold, filled, small }) {
  const [h, setH] = useState(false)
  const sz = small ? 28 : 30
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: sz, height: sz, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
        background: primary ? (h ? '#9A7020' : GOLD) : (small ? 'rgba(20,15,10,0.5)' : (h ? BG2 : BG)),
        color: primary ? BG : (gold || h ? GOLD : MUTED),
      }}
    >
      <svg width={12} height={12} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
    </button>
  )
}