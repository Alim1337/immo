// pages/biens/index.js
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const TYPES        = ['APPARTEMENT','VILLA','MAISON','BUREAU','LOCAL_COMMERCIAL','TERRAIN','STUDIO']
const TRANSACTIONS = ['LOCATION','VENTE','LOCATION_VACANCES']
const WILAYAS      = ['Alger','Oran','Constantine','Annaba','Blida','Tizi Ouzou','Sétif','Béjaïa','Batna','Sidi Bel Abbès','Tlemcen','Biskra','Médéa','Boumerdès','Tipaza']
const SORTS        = ['Plus récents','Prix croissant','Prix décroissant']

const TYPE_IMAGES = {
  VILLA:            'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  APPARTEMENT:      'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
  MAISON:           'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  TERRAIN:          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
  BUREAU:           'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
  LOCAL_COMMERCIAL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
  STUDIO:           'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
}

const iStyle = (focus) => ({
  background: 'transparent', border: 'none',
  borderBottom: `1px solid ${focus ? GOLD : BORDER}`,
  color: TEXT, fontFamily: "'Raleway', sans-serif",
  fontSize: 11, padding: '8px 0', outline: 'none',
  width: '100%', transition: 'border-color 0.2s',
  appearance: 'none',
})

function BienCard({ bien, token, onFav, favIds }) {
  const router  = useRouter()
  const isFav   = favIds.includes(bien.id)
  const imgSrc  = bien.images?.[0] || TYPE_IMAGES[bien.type_bien] || TYPE_IMAGES.APPARTEMENT

  return (
    <article
      onClick={() => router.push(`/biens/${bien.id}`)}
      style={{
        background: '#F5F1EA', border: `1px solid ${BORDER}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        cursor: 'pointer', transition: 'box-shadow 0.3s, transform 0.3s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden' }}>
        <Image src={imgSrc} alt={bien.titre} fill style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,10,0.5) 0%, transparent 55%)', pointerEvents: 'none' }} />
        {/* type badge */}
        <div style={{ position: 'absolute', top: 10, left: 10, fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: '#F5F0E8', background: 'rgba(20,15,10,0.6)', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
          {bien.type_bien}
        </div>
        {/* transaction badge */}
        <div style={{ position: 'absolute', top: 10, right: 42, fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: GOLD, background: 'rgba(20,15,10,0.7)', padding: '4px 10px' }}>
          {bien.type_transaction.replace('_', ' ')}
        </div>
        {/* fav button */}
        {token && (
          <button onClick={e => { e.stopPropagation(); onFav(bien.id, isFav) }}
            style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(237,233,225,0.9)', border: 'none', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? GOLD : 'none'} stroke={GOLD} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        )}
        {/* price */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#F5F0E8' }}>
            {Number(bien.prix).toLocaleString('fr-DZ')} DZD
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 18px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: TEXT, marginBottom: 4, lineHeight: 1.3 }}>
          {bien.titre}
        </div>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 1, color: FAINT, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {[bien.ville, bien.wilaya].filter(Boolean).join(', ')}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 12, borderTop: `1px solid ${BORDER}`, marginTop: 'auto' }}>
          {bien.nbr_chambres && <Chip label={`${bien.nbr_chambres} ch.`} />}
          {bien.superficie    && <Chip label={`${bien.superficie} m²`} />}
          {bien.est_meuble    && <Chip label="Meublé" gold />}
          {bien.etat !== 'DISPONIBLE' && <Chip label={bien.etat} />}
        </div>
      </div>
    </article>
  )
}

function Chip({ label, gold }) {
  return (
    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: gold ? GOLD : MUTED, border: `1px solid ${gold ? GOLD : BORDER}`, padding: '3px 8px' }}>
      {label}
    </div>
  )
}

export default function BiensIndex() {
  const router = useRouter()
  const { token, isLoggedIn, canPublish } = useAuth()

  const [biens,    setBiens]    = useState([])
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState(1)
  const [page,     setPage]     = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [favIds,   setFavIds]   = useState([])
  const [sortOpen, setSortOpen] = useState(false)

  const [filters, setFilters] = useState({
    wilaya: '', type_bien: '', type_transaction: '',
    prix_min: '', prix_max: '', nbr_chambres: '',
    sort: 'Plus récents',
  })
  const [focused, setFocused] = useState({})
  const setF = k => v => setFilters(f => ({ ...f, [k]: v }))

  useEffect(() => { fetchBiens(1) }, [filters])
  useEffect(() => { if (isLoggedIn) fetchFavs() }, [isLoggedIn])

  const fetchBiens = async (p = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 12 })
      if (filters.wilaya)           params.set('wilaya',           filters.wilaya)
      if (filters.type_bien)        params.set('type_bien',        filters.type_bien)
      if (filters.type_transaction) params.set('type_transaction', filters.type_transaction)
      if (filters.prix_min)         params.set('prix_min',         filters.prix_min)
      if (filters.prix_max)         params.set('prix_max',         filters.prix_max)
      if (filters.nbr_chambres)     params.set('nbr_chambres',     filters.nbr_chambres)
      if (filters.sort === 'Prix croissant')   params.set('sort', 'prix_asc')
      if (filters.sort === 'Prix décroissant') params.set('sort', 'prix_desc')

      const res  = await fetch(`/api/biens?${params}`)
      const data = await res.json()
      setBiens(data.biens || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
      setPage(p)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchFavs = async () => {
    try {
      const res  = await fetch('/api/favoris', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setFavIds((data || []).map(f => f.bien_id))
    } catch {}
  }

  const handleFav = async (bienId, isFav) => {
    if (!token) return router.push('/login')
    const method = isFav ? 'DELETE' : 'POST'
    await fetch('/api/favoris', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ bien_id: bienId }) })
    setFavIds(ids => isFav ? ids.filter(i => i !== bienId) : [...ids, bienId])
  }

  const resetFilters = () => setFilters({ wilaya: '', type_bien: '', type_transaction: '', prix_min: '', prix_max: '', nbr_chambres: '', sort: 'Plus récents' })

  const hasFilters = filters.wilaya || filters.type_bien || filters.type_transaction || filters.prix_min || filters.prix_max || filters.nbr_chambres

  return (
    <>
      <Head><title>Biens disponibles — E-Krili</title></Head>
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <style jsx global>{`body { background: #EDE9E1 !important; }`}</style>
        <Header />

        {/* ── Page header ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, background: BG }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
                ← RETOUR
              </button>
              <span style={{ color: BORDER }}>|</span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>CATALOGUE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>CATALOGUE COMPLET</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: TEXT, margin: 0 }}>Tous les biens disponibles</h1>
                <div style={{ width: 40, height: 1, background: GOLD, marginTop: 14 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {canPublish && (
                  <button onClick={() => router.push('/biens/nouveau')}
                    style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '12px 24px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    + PUBLIER UN BIEN
                  </button>
                )}
                {/* Sort dropdown */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setSortOpen(o => !o)}
                    style={{ background: 'transparent', border: `1px solid ${BORDER}`, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: MUTED, padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = GOLD} onMouseLeave={e => { if (!sortOpen) e.currentTarget.style.borderColor = BORDER }}>
                    {filters.sort.toUpperCase()} <span style={{ fontSize: 8, color: GOLD }}>▼</span>
                  </button>
                  {sortOpen && (
                    <div className="lux-menu-items" style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', minWidth: 200, zIndex: 20, padding: '6px 0' }}>
                      {SORTS.map(s => (
                        <button key={s} className="lux-menu-item" onClick={() => { setF('sort')(s); setSortOpen(false) }}
                          style={{ display: 'block', width: '100%', background: 'none', border: 'none', textAlign: 'left', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: s === filters.sort ? GOLD : MUTED, padding: '10px 20px', cursor: 'pointer' }}>
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Filters ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, paddingBottom: 24 }}>
              {/* Wilaya */}
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 4 }}>WILAYA</div>
                <select value={filters.wilaya} onChange={e => setF('wilaya')(e.target.value)} style={iStyle(focused.wilaya)}
                  onFocus={() => setFocused(f => ({...f, wilaya: true}))} onBlur={() => setFocused(f => ({...f, wilaya: false}))}>
                  <option value="">Toutes</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              {/* Type bien */}
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 4 }}>TYPE DE BIEN</div>
                <select value={filters.type_bien} onChange={e => setF('type_bien')(e.target.value)} style={iStyle(focused.type_bien)}
                  onFocus={() => setFocused(f => ({...f, type_bien: true}))} onBlur={() => setFocused(f => ({...f, type_bien: false}))}>
                  <option value="">Tous</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {/* Transaction */}
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 4 }}>TRANSACTION</div>
                <select value={filters.type_transaction} onChange={e => setF('type_transaction')(e.target.value)} style={iStyle(focused.type_transaction)}
                  onFocus={() => setFocused(f => ({...f, type_transaction: true}))} onBlur={() => setFocused(f => ({...f, type_transaction: false}))}>
                  <option value="">Toutes</option>
                  {TRANSACTIONS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              {/* Prix min */}
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 4 }}>PRIX MIN (DZD)</div>
                <input type="number" placeholder="0" value={filters.prix_min} onChange={e => setF('prix_min')(e.target.value)} style={iStyle(focused.prix_min)}
                  onFocus={() => setFocused(f => ({...f, prix_min: true}))} onBlur={() => setFocused(f => ({...f, prix_min: false}))} />
              </div>
              {/* Prix max */}
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 4 }}>PRIX MAX (DZD)</div>
                <input type="number" placeholder="∞" value={filters.prix_max} onChange={e => setF('prix_max')(e.target.value)} style={iStyle(focused.prix_max)}
                  onFocus={() => setFocused(f => ({...f, prix_max: true}))} onBlur={() => setFocused(f => ({...f, prix_max: false}))} />
              </div>
              {/* Chambres */}
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 4 }}>CHAMBRES MIN</div>
                <select value={filters.nbr_chambres} onChange={e => setF('nbr_chambres')(e.target.value)} style={iStyle(focused.nbr_chambres)}
                  onFocus={() => setFocused(f => ({...f, nbr_chambres: true}))} onBlur={() => setFocused(f => ({...f, nbr_chambres: false}))}>
                  <option value="">Tous</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
            </div>

            {/* Reset filters */}
            {hasFilters && (
              <div style={{ paddingBottom: 16 }}>
                <button onClick={resetFilters} style={{ background: 'none', border: 'none', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: GOLD, cursor: 'pointer', padding: 0 }}>
                  ✕ RÉINITIALISER LES FILTRES
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Results ── */}
        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT, marginBottom: 32 }}>
            {loading ? 'CHARGEMENT…' : `${total} BIEN${total !== 1 ? 'S' : ''} TROUVÉ${total !== 1 ? 'S' : ''}`}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: 360, background: BG2, animationName: 'pulse', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
              ))}
            </div>
          ) : biens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 12 }}>Aucun bien trouvé</div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT }}>Essayez d'autres filtres</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
                {biens.map(b => <BienCard key={b.id} bien={b} token={token} onFav={handleFav} favIds={favIds} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 56 }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => fetchBiens(p)}
                      style={{ width: 36, height: 36, background: p === page ? GOLD : 'transparent', border: `1px solid ${p === page ? GOLD : BORDER}`, color: p === page ? BG : MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
        <style jsx>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    </>
  )
}