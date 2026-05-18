// pages/biens/mes-biens.js
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'
const ERR    = '#C0392B'
const SUCCESS = '#16a34a'

const Ico = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  home:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  plus:    'M12 5v14M5 12h14',
  edit:    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:   'M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  heart:   'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  map:     'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  tag:     'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
  alert:   'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  check:   'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
  back:    'M19 12H5M12 5l-7 7 7 7',
  chart:   'M18 20V10M12 20V4M6 20v-6',
  negoc:   'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  image:   'M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.5L9 5h6l1.5-2H19a2 2 0 0 1 2 2zM12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  filter:  'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
}

const TYPE_LABELS = {
  APPARTEMENT: 'Appartement', MAISON: 'Maison', VILLA: 'Villa',
  STUDIO: 'Studio', BUREAU: 'Bureau', COMMERCE: 'Commerce',
  TERRAIN: 'Terrain', GARAGE: 'Garage',
}

const STATUT_LABELS = {
  DISPONIBLE: 'Disponible', LOUE: 'Loué', VENDU: 'Vendu',
  EN_NEGOCIATION: 'En négociation', INDISPONIBLE: 'Indisponible',
}

const STATUT_COLORS = {
  DISPONIBLE:     { bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.3)',  text: '#15803d' },
  LOUE:           { bg: 'rgba(184,137,42,0.1)', border: 'rgba(184,137,42,0.3)', text: GOLD },
  VENDU:          { bg: 'rgba(90,82,72,0.1)',   border: 'rgba(90,82,72,0.3)',   text: MUTED },
  EN_NEGOCIATION: { bg: 'rgba(37,99,235,0.1)',  border: 'rgba(37,99,235,0.3)',  text: '#1d4ed8' },
  INDISPONIBLE:   { bg: 'rgba(192,57,43,0.1)',  border: 'rgba(192,57,43,0.3)',  text: ERR },
}

function fmtPrice(p) {
  if (!p) return '—'
  return new Intl.NumberFormat('fr-DZ', { style: 'decimal' }).format(p) + ' DA'
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return "Aujourd'hui"
  if (d === 1) return 'Hier'
  if (d < 30) return `Il y a ${d} jours`
  const m = Math.floor(d / 30)
  if (m < 12) return `Il y a ${m} mois`
  return `Il y a ${Math.floor(m / 12)} an(s)`
}

// ── Skeleton card
function SkeletonCard() {
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, padding: 20 }}>
      {[80, 50, 60, 40].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 16 : 12, width: `${w}%`, background: BORDER, borderRadius: 2, marginBottom: i === 0 ? 14 : 10, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  )
}

// ── Stat pill
function Stat({ icon, value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ color: FAINT }}><Ico d={icon} size={12} /></span>
      <span style={{ fontSize: 11, fontWeight: 500, color: MUTED }}>{value}</span>
      <span style={{ fontSize: 10, color: FAINT }}>{label}</span>
    </div>
  )
}

export default function MesBiens() {
  const router = useRouter()
  const [biens,    setBiens]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [filter,   setFilter]   = useState('TOUS')
  const [deleting, setDeleting] = useState(null)
  const [confirm,  setConfirm]  = useState(null) // id to confirm delete
  const [toast,    setToast]    = useState(null)  // { msg, type }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchBiens = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      if (!token) { router.push('/login'); return }
      const res  = await fetch('/api/biens/mes-biens', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { router.push('/login'); return }
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      setBiens(data)
    } catch (e) {
      setError(e.message || 'Impossible de charger vos biens.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchBiens() }, [fetchBiens])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/biens/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      setBiens(prev => prev.filter(b => b.id !== id))
      showToast('Bien supprimé avec succès.')
    } catch {
      showToast('Erreur lors de la suppression.', 'error')
    } finally {
      setDeleting(null)
      setConfirm(null)
    }
  }

  const filtered = filter === 'TOUS' ? biens : biens.filter(b => b.etat === filter)

  const FILTERS = ['TOUS', 'DISPONIBLE', 'LOUE', 'VENDU', 'EN_NEGOCIATION', 'INDISPONIBLE']

  return (
    <>
      <Head>
        <title>Mes biens — E-Krili</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${BG}; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .bien-card { animation: fadeIn 0.3s ease forwards; }
        .bien-card:hover .card-actions { opacity: 1 !important; }
        @media (max-width: 767px) {
          .page-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .filters-row { flex-wrap: wrap !important; }
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 10,
          background: toast.type === 'error' ? 'rgba(192,57,43,0.97)' : 'rgba(18,16,14,0.95)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(192,57,43,0.4)' : BORDER}`,
          padding: '12px 18px', color: '#F5F0E8', fontSize: 12,
          fontFamily: "'Raleway', sans-serif", letterSpacing: 0.5,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <Ico d={toast.type === 'error' ? ICONS.alert : ICONS.check} size={14} />
          {toast.msg}
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {confirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(18,16,14,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: BG, border: `1px solid ${BORDER}`, padding: '32px 28px', maxWidth: 380, width: '100%', fontFamily: "'Raleway', sans-serif" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: ERR, marginBottom: 12 }}>CONFIRMATION</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: TEXT, marginBottom: 10 }}>Supprimer ce bien ?</div>
            <div style={{ fontSize: 12, color: FAINT, lineHeight: 1.7, marginBottom: 24 }}>
              Cette action est irréversible. Le bien et toutes ses données associées seront définitivement supprimés.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirm(null)}
                style={{ flex: 1, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '12px 0', cursor: 'pointer' }}>
                ANNULER
              </button>
              <button onClick={() => handleDelete(confirm)} disabled={deleting === confirm}
                style={{ flex: 1, background: ERR, border: 'none', color: '#fff', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '12px 0', cursor: 'pointer', opacity: deleting === confirm ? 0.6 : 1 }}>
                {deleting === confirm ? 'SUPPRESSION…' : 'SUPPRIMER'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Raleway', sans-serif" }}>

        {/* ── Sticky nav ── */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: `1px solid ${BORDER}`, background: BG, position: 'sticky', top: 0, zIndex: 20 }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: GOLD }}><Ico d={ICONS.home} size={17} /></span>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 300, letterSpacing: 4, color: GOLD, lineHeight: 1 }}>E-KRILI</div>
              <div style={{ fontSize: 6, letterSpacing: 3, color: FAINT }}>IMMOBILIER DE PRESTIGE</div>
            </div>
          </div>
          <button onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '7px 14px', cursor: 'pointer' }}>
            <Ico d={ICONS.back} size={12} /> RETOUR
          </button>
        </div>

        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* ── Page header ── */}
          <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 8 }}>ESPACE PROPRIÉTAIRE</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1 }}>
                Mes biens
              </h1>
              <div style={{ width: 32, height: 1, background: GOLD, marginTop: 12 }} />
              {!loading && (
                <div style={{ fontSize: 11, color: FAINT, marginTop: 10 }}>
                  {biens.length === 0 ? 'Aucun bien publié' : `${biens.length} bien${biens.length > 1 ? 's' : ''} publié${biens.length > 1 ? 's' : ''}`}
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/biens/nouveau')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 22px', cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}
            >
              <Ico d={ICONS.plus} size={14} /> PUBLIER UN BIEN
            </button>
          </div>

          {/* ── Summary stats ── */}
          {!loading && biens.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, marginBottom: 32, border: `1px solid ${BORDER}` }}>
              {[
                { label: 'Total', value: biens.length, icon: ICONS.home },
                { label: 'Disponibles', value: biens.filter(b => b.etat === 'DISPONIBLE').length, icon: ICONS.check },
                { label: 'Loués / Vendus', value: biens.filter(b => ['LOUE','VENDU'].includes(b.etat)).length, icon: ICONS.tag },
                { label: 'Total visites', value: biens.reduce((s, b) => s + (b._count?.visites ?? 0), 0), icon: ICONS.eye },
                { label: 'Total favoris', value: biens.reduce((s, b) => s + (b._count?.favoris ?? 0), 0), icon: ICONS.heart },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: BG2, padding: '18px 20px', borderRight: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <span style={{ color: GOLD }}><Ico d={icon} size={13} /></span>
                    <span style={{ fontSize: 9, letterSpacing: 2, color: FAINT }}>{label.toUpperCase()}</span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Filters ── */}
          {!loading && biens.length > 0 && (
            <div className="filters-row" style={{ display: 'flex', gap: 6, marginBottom: 24, alignItems: 'center' }}>
              <span style={{ color: FAINT, flexShrink: 0 }}><Ico d={ICONS.filter} size={13} /></span>
              {FILTERS.map(f => {
                const active = filter === f
                const count  = f === 'TOUS' ? biens.length : biens.filter(b => b.etat === f).length
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ background: active ? GOLD : 'transparent', border: `1px solid ${active ? GOLD : BORDER}`, color: active ? BG : FAINT, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                    {f === 'TOUS' ? 'TOUS' : STATUT_LABELS[f]?.toUpperCase()} ({count})
                  </button>
                )
              })}
              <button onClick={fetchBiens} title="Actualiser"
                style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${BORDER}`, color: FAINT, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Ico d={ICONS.refresh} size={13} />
              </button>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(192,57,43,0.07)', border: `1px solid rgba(192,57,43,0.25)`, borderLeft: `3px solid ${ERR}`, padding: '14px 16px', marginBottom: 24 }}>
              <Ico d={ICONS.alert} size={14} /><span style={{ fontSize: 12, color: ERR }}>{error}</span>
            </div>
          )}

          {/* ── Skeleton ── */}
          {loading && (
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && filtered.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '80px 24px', border: `1px solid ${BORDER}` }}>
              <div style={{ color: BORDER, marginBottom: 20 }}><Ico d={ICONS.home} size={40} /></div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: TEXT, marginBottom: 10 }}>
                {filter === 'TOUS' ? 'Aucun bien publié' : `Aucun bien "${STATUT_LABELS[filter]}"`}
              </div>
              <div style={{ fontSize: 12, color: FAINT, marginBottom: 28 }}>
                {filter === 'TOUS' ? 'Commencez par publier votre premier bien.' : 'Essayez un autre filtre.'}
              </div>
              {filter === 'TOUS' && (
                <button onClick={() => router.push('/biens/nouveau')}
                  style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 28px', cursor: 'pointer' }}>
                  PUBLIER UN BIEN
                </button>
              )}
            </div>
          )}

          {/* ── Cards grid ── */}
          {!loading && filtered.length > 0 && (
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {filtered.map((bien, idx) => {
                const statut = STATUT_COLORS[bien.etat] || STATUT_COLORS.DISPONIBLE
                const img    = Array.isArray(bien.images) ? bien.images[0] : null
                return (
                  <div key={bien.id} className="bien-card"
                    style={{ background: BG2, border: `1px solid ${BORDER}`, position: 'relative', animationDelay: `${idx * 40}ms` }}>

                    {/* Image strip */}
                    <div style={{ height: 160, background: `${BORDER}`, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      {img
                        ? <img src={img} alt={bien.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BORDER }}>
                            <Ico d={ICONS.image} size={32} />
                          </div>
                        )
                      }
                      {/* Statut badge */}
                      <div style={{ position: 'absolute', top: 10, left: 10, background: statut.bg, border: `1px solid ${statut.border}`, color: statut.text, fontSize: 8, letterSpacing: 2, padding: '4px 8px', fontFamily: "'Raleway', sans-serif" }}>
                        {STATUT_LABELS[bien.etat]?.toUpperCase()}
                      </div>
                      {/* Hover actions */}
                      <div className="card-actions" style={{ position: 'absolute', inset: 0, background: 'rgba(18,16,14,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: 0, transition: 'opacity 0.2s' }}>
                        <button onClick={() => router.push(`/biens/${bien.id}`)}
                          style={{ background: 'rgba(245,240,232,0.12)', border: '1px solid rgba(245,240,232,0.25)', color: '#F5F0E8', padding: '9px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: 2, fontFamily: "'Raleway', sans-serif" }}>
                          <Ico d={ICONS.eye} size={13} /> VOIR
                        </button>
                        <button onClick={() => router.push(`/biens/${bien.id}/modifier`)}
                          style={{ background: GOLD, border: 'none', color: BG, padding: '9px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: 2, fontFamily: "'Raleway', sans-serif" }}>
                          <Ico d={ICONS.edit} size={13} /> MODIFIER
                        </button>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '16px 18px 14px' }}>
                      {/* Type */}
                      <div style={{ fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 6 }}>
                        {TYPE_LABELS[bien.type_bien] || bien.type_bien} · {bien.type_transaction === 'LOCATION' ? 'LOCATION' : 'VENTE'}
                      </div>
                      {/* Title */}
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: TEXT, marginBottom: 6, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {bien.titre}
                      </div>
                      {/* Location */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
                        <span style={{ color: FAINT }}><Ico d={ICONS.map} size={11} /></span>
                        <span style={{ fontSize: 11, color: FAINT }}>{[bien.ville, bien.wilaya].filter(Boolean).join(', ') || '—'}</span>
                      </div>
                      {/* Price */}
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: GOLD, marginBottom: 14 }}>
                        {fmtPrice(bien.prix)}
                        {bien.type_transaction === 'LOCATION' && <span style={{ fontSize: 11, color: FAINT, fontFamily: "'Raleway', sans-serif", fontWeight: 300 }}> /mois</span>}
                      </div>

                      {/* Stats row */}
                      <div style={{ display: 'flex', gap: 14, paddingTop: 12, borderTop: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
                        <Stat icon={ICONS.eye}   value={bien._count?.visites ?? 0}      label="visites" />
                        <Stat icon={ICONS.heart}  value={bien._count?.favoris ?? 0}      label="favoris" />
                        <Stat icon={ICONS.negoc}  value={bien._count?.negotiations ?? 0} label="négoc." />
                      </div>

                      {/* Footer: date + delete */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                        <span style={{ fontSize: 10, color: FAINT }}>{timeAgo(bien.date_publication)}</span>
                        <button onClick={() => setConfirm(bien.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: FAINT, padding: 4, display: 'flex', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = ERR}
                          onMouseLeave={e => e.currentTarget.style.color = FAINT}
                          title="Supprimer">
                          <Ico d={ICONS.trash} size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </>
  )
}