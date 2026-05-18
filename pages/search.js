// pages/search.js
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import BienCard from '@/components/BienCard'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const Icon = ({ d, size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  search:  'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  filter:  'M4 6h16M7 12h10M10 18h4',
  x:       'M18 6L6 18M6 6l12 12',
  chevD:   'M6 9l6 6 6-6',
  home:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  arrow:   'M19 12H5M12 5l-7 7 7 7',
}

const TYPES      = ['APPARTEMENT','VILLA','MAISON','BUREAU','LOCAL_COMMERCIAL','TERRAIN','STUDIO']
const TRANS      = ['LOCATION','VENTE','LOCATION_VACANCES']
const TRANS_LABEL = { LOCATION: 'Location', VENTE: 'Vente', LOCATION_VACANCES: 'Vacances' }
const WILAYAS    = ['Alger','Oran','Constantine','Annaba','Blida','Batna','Sétif','Tlemcen','Béjaïa','Tizi Ouzou']

const SORTS = [
  { key: 'date_publication-desc', label: 'Plus récents' },
  { key: 'prix-asc',              label: 'Prix croissant' },
  { key: 'prix-desc',             label: 'Prix décroissant' },
  { key: 'superficie-desc',       label: 'Plus grands' },
]

export default function SearchPage() {
  const router = useRouter()

  const [query,     setQuery]     = useState('')
  const [results,   setResults]   = useState([])
  const [total,     setTotal]     = useState(0)
  const [pages,     setPages]     = useState(1)
  const [page,      setPage]      = useState(1)
  const [loading,   setLoading]   = useState(false)
  const [sortOpen,  setSortOpen]  = useState(false)
  const [sort,      setSort]      = useState('date_publication-desc')

  const [filters, setFilters] = useState({
    wilaya: '', type_bien: '', type_transaction: '',
    prix_min: '', prix_max: '', nbr_chambres: '',
  })

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const doSearch = useCallback(async (pg = 1) => {
    setLoading(true)
    const [tri, ordre] = sort.split('-')
    const params = new URLSearchParams({ q: query, page: pg, limite: 12, tri, ordre })
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })

    try {
      const res  = await fetch(`/api/search?${params}`)
      const data = await res.json()
      setResults(data.biens?.items || [])
      setTotal(data.biens?.total || 0)
      setPages(data.biens?.total_pages || 1)
      setPage(pg)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [query, filters, sort])

  // Init from URL query
  useEffect(() => {
    if (!router.isReady) return
    const q = router.query.q || ''
    setQuery(q)
  }, [router.isReady, router.query.q])

  // Search when query/filters/sort change
  useEffect(() => { doSearch(1) }, [query, filters, sort]) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    doSearch(1)
  }

  const resetFilters = () => setFilters({ wilaya: '', type_bien: '', type_transaction: '', prix_min: '', prix_max: '', nbr_chambres: '' })

  const currentSort = SORTS.find(s => s.key === sort)

  return (
    <>
      <Head><title>Recherche — E-Krili</title></Head>
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Search bar ── */}
        <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: '24px 40px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, border: `1px solid ${BORDER}`, maxWidth: 640 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', color: FAINT, flexShrink: 0 }}>
                <Icon d={ICONS.search} size={16} />
              </div>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Ville, wilaya, type de bien…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300, color: TEXT, padding: '12px 0' }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')}
                  style={{ background: 'none', border: 'none', padding: '0 12px', cursor: 'pointer', color: FAINT, display: 'flex', alignItems: 'center' }}>
                  <Icon d={ICONS.x} size={14} />
                </button>
              )}
              <button type="submit"
                style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '0 24px', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}
              >
                RECHERCHER
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '32px 40px 72px', gap: 24, alignItems: 'flex-start', boxSizing: 'border-box' }}>

          {/* ── Filters sidebar ── */}
          <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 90, background: BG, border: `1px solid ${BORDER}`, padding: '20px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: FAINT }}>FILTRES</span>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters}
                  style={{ background: 'none', border: 'none', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: GOLD, cursor: 'pointer', padding: 0 }}>
                  RÉINITIALISER
                </button>
              )}
            </div>

            <FilterSection title="WILAYA">
              <select value={filters.wilaya} onChange={e => setFilter('wilaya', e.target.value)}
                style={selStyle}>
                <option value="">Toutes</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </FilterSection>

            <FilterSection title="TYPE DE BIEN">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {TYPES.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <Checkbox checked={filters.type_bien === t} onChange={() => setFilter('type_bien', filters.type_bien === t ? '' : t)} />
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: filters.type_bien === t ? TEXT : MUTED }}>
                      {t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="TRANSACTION">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {TRANS.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <Checkbox checked={filters.type_transaction === t} onChange={() => setFilter('type_transaction', filters.type_transaction === t ? '' : t)} />
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: filters.type_transaction === t ? TEXT : MUTED }}>{TRANS_LABEL[t]}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="PRIX (DZD)">
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder="Min" value={filters.prix_min} onChange={e => setFilter('prix_min', e.target.value)}
                  style={{ ...numInput }} />
                <input type="number" placeholder="Max" value={filters.prix_max} onChange={e => setFilter('prix_max', e.target.value)}
                  style={{ ...numInput }} />
              </div>
            </FilterSection>

            <FilterSection title="CHAMBRES MIN.">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setFilter('nbr_chambres', filters.nbr_chambres == n ? '' : String(n))}
                    style={{ width: 32, height: 32, border: `1px solid ${filters.nbr_chambres == n ? GOLD : BORDER}`, background: filters.nbr_chambres == n ? GOLD : 'transparent', color: filters.nbr_chambres == n ? BG : MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 11, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {n}
                  </button>
                ))}
              </div>
            </FilterSection>
          </aside>

          {/* ── Results ── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Result bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 6 }}>RÉSULTATS</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: TEXT, margin: 0 }}>
                  {loading ? 'Recherche…' : `${total.toLocaleString('fr-DZ')} bien${total !== 1 ? 's' : ''} trouvé${total !== 1 ? 's' : ''}`}
                </h1>
              </div>

              {/* Sort */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setSortOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: `1px solid ${BORDER}`, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: MUTED, padding: '8px 14px', cursor: 'pointer' }}>
                  {currentSort?.label.toUpperCase()}
                  <Icon d={ICONS.chevD} size={10} />
                </button>
                {sortOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: BG, border: `1px solid ${BORDER}`, zIndex: 20, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    {SORTS.map(s => (
                      <button key={s.key} onClick={() => { setSort(s.key); setSortOpen(false) }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: s.key === sort ? GOLD : MUTED, padding: '10px 16px', cursor: 'pointer' }}>
                        {s.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {Object.entries(filters).filter(([,v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid rgba(184,137,42,0.35)`, background: 'rgba(184,137,42,0.05)', padding: '4px 10px' }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: GOLD }}>{v.toUpperCase()}</span>
                    <button onClick={() => setFilter(k, '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, padding: 0, display: 'flex' }}>
                      <Icon d={ICONS.x} size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Skeleton / grid / empty */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 3 }}>
                {Array.from({length: 6}).map((_,i) => (
                  <div key={i} style={{ height: 320, background: BG2, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 3 }}>
                  {results.map(b => <BienCard key={b.id} bien={b} onClick={() => router.push(`/biens/${b.id}`)} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 40 }}>
                    {Array.from({length: pages}, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => doSearch(p)}
                        style={{ width: 36, height: 36, border: `1px solid ${p === page ? GOLD : BORDER}`, background: p === page ? GOLD : 'transparent', color: p === page ? BG : MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 11, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 10 }}>
                  Aucun résultat
                </div>
                <div style={{ width: 36, height: 1, background: GOLD, margin: '0 auto 18px' }} />
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, lineHeight: 1.8 }}>
                  Essayez d&apos;élargir vos critères ou de modifier vos filtres.
                </p>
                <button onClick={resetFilters}
                  style={{ marginTop: 20, background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '12px 28px', cursor: 'pointer' }}>
                  RÉINITIALISER LES FILTRES
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>
    </>
  )
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: FAINT, marginBottom: 10 }}>{title}</div>
      {children}
      <div style={{ height: 1, background: BORDER, marginTop: 18 }} />
    </div>
  )
}

function Checkbox({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{ width: 14, height: 14, border: `1px solid ${checked ? GOLD : 'rgba(184,137,42,0.3)'}`, background: checked ? GOLD : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
      {checked && <span style={{ color: '#EDE9E1', fontSize: 9, lineHeight: 1 }}>✓</span>}
    </div>
  )
}

const selStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid rgba(184,137,42,0.25)`, color: '#5A5248', fontFamily: "'Raleway', sans-serif", fontSize: 11, padding: '6px 0', outline: 'none', appearance: 'none', cursor: 'pointer' }
const numInput = { flex: 1, background: '#E4DFD5', border: `1px solid rgba(184,137,42,0.2)`, color: '#1A1713', fontFamily: "'Raleway', sans-serif", fontSize: 11, padding: '6px 8px', outline: 'none', width: 0 }