// pages/demandes/index.js
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_BIEN_LABELS = {
  APPARTEMENT:      'Appartement',
  VILLA:            'Villa',
  MAISON:           'Maison',
  BUREAU:           'Bureau',
  LOCAL_COMMERCIAL: 'Local commercial',
  TERRAIN:          'Terrain',
  STUDIO:           'Studio',
}

const TYPE_TRANSACTION_LABELS = {
  LOCATION:          'Location',
  VENTE:             'Vente',
  LOCATION_VACANCES: 'Location vacances',
}

const STATUT_STYLES = {
  EN_ATTENTE: { color: GOLD,      label: 'En attente' },
  EN_COURS:   { color: '#2563eb', label: 'En cours'   },
  SATISFAITE: { color: '#16a34a', label: 'Satisfaite' },
  EXPIREE:    { color: FAINT,     label: 'Expirée'    },
  ANNULEE:    { color: '#dc2626', label: 'Annulée'    },
}

const fmtPrice = (p) =>
  p ? Number(p).toLocaleString('fr-DZ') + ' DA' : null

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

// ── Filter tabs ───────────────────────────────────────────────────────────────

const FILTERS_CLIENT = ['Toutes', 'En attente', 'En cours', 'Satisfaite', 'Expirée', 'Annulée']
const FILTERS_PROPRIO = ['Toutes', 'En attente', 'En cours']

const STATUT_MAP = {
  'En attente': 'EN_ATTENTE',
  'En cours':   'EN_COURS',
  'Satisfaite': 'SATISFAITE',
  'Expirée':    'EXPIREE',
  'Annulée':    'ANNULEE',
}

// ── Card ──────────────────────────────────────────────────────────────────────

function DemandeCard({ demande, isOwn, onDelete, onContact }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [hovered,       setHovered]       = useState(false)

  const statut     = STATUT_STYLES[demande.statut] || { color: FAINT, label: demande.statut }
  const clientName = demande.client
    ? `${demande.client.prenom || ''} ${demande.client.nom || ''}`.trim()
    : 'Client'

  const interetCount = demande.interets?.length ?? 0

  return (
    <div
      style={{
        background: BG2,
        border: `1px solid ${hovered ? GOLD : BORDER}`,
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gold accent */}
      <div style={{ height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />

      <div style={{ padding: '20px 24px 24px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 5 }}>
              DEMANDE #{demande.id}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: TEXT, lineHeight: 1.1 }}>
              {TYPE_BIEN_LABELS[demande.type_bien] || demande.type_bien || 'Bien'}
              {demande.type_transaction && (
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: MUTED, marginLeft: 8 }}>
                  — {TYPE_TRANSACTION_LABELS[demande.type_transaction] || demande.type_transaction}
                </span>
              )}
            </div>
            {!isOwn && (
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT, marginTop: 4 }}>
                Par <span style={{ color: MUTED }}>{clientName}</span>
              </div>
            )}
          </div>

          {/* Status badge */}
          <div style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 8, letterSpacing: 2,
            color: statut.color,
            border: `1px solid ${statut.color}`,
            padding: '4px 10px',
            whiteSpace: 'nowrap',
          }}>
            {statut.label.toUpperCase()}
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px', marginBottom: 18 }}>
          {[
            { label: 'Wilaya',      value: demande.wilaya },
            { label: 'Ville',       value: demande.ville },
            { label: 'Prix min',    value: fmtPrice(demande.prix_min) },
            { label: 'Prix max',    value: fmtPrice(demande.prix_max) },
            { label: 'Surface min', value: demande.superficie_min   ? `${demande.superficie_min} m²` : null },
            { label: 'Chambres',    value: demande.nbr_chambres_min ? `${demande.nbr_chambres_min}+` : null },
          ].map(({ label, value }) => value ? (
            <div key={label} style={{ padding: '7px 0', borderBottom: `1px solid rgba(184,137,42,0.1)` }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, textTransform: 'uppercase', display: 'block' }}>
                {label}
              </span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: TEXT }}>
                {value}
              </span>
            </div>
          ) : null)}
        </div>

        {/* Description */}
        {demande.description && (
          <div style={{
            fontFamily: "'Raleway', sans-serif", fontSize: 11, color: MUTED,
            fontStyle: 'italic', lineHeight: 1.7, marginBottom: 18,
            borderLeft: `2px solid ${BORDER}`, paddingLeft: 12,
          }}>
            {demande.description}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: FAINT }}>
              {fmtDate(demande.date_creation)}
            </span>
            {/* Show interet count to CLIENT */}
            {isOwn && interetCount > 0 && (
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: GOLD }}>
                {interetCount} propriétaire{interetCount > 1 ? 's' : ''} intéressé{interetCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {/* Proprio / Agence → contact button */}
            {!isOwn && (
              <button
                onClick={() => onContact(demande)}
                style={{
                  background: GOLD, border: 'none', color: BG,
                  fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
                  padding: '9px 18px', cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                CONTACTER
              </button>
            )}

            {/* Client → cancel own demande */}
            {isOwn && !confirmDelete && demande.statut === 'EN_ATTENTE' && (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  background: 'transparent',
                  border: `1px solid rgba(220,38,38,0.3)`,
                  color: 'rgba(220,38,38,0.6)',
                  fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
                  padding: '9px 18px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'; e.currentTarget.style.color = 'rgba(220,38,38,0.6)' }}
              >
                ANNULER
              </button>
            )}

            {isOwn && confirmDelete && (
              <>
                <button
                  onClick={() => { setConfirmDelete(false); onDelete(demande.id) }}
                  style={{
                    background: '#dc2626', border: 'none', color: '#fff',
                    fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
                    padding: '9px 16px', cursor: 'pointer',
                  }}
                >
                  CONFIRMER
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${BORDER}`, color: MUTED,
                    fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
                    padding: '9px 16px', cursor: 'pointer',
                  }}
                >
                  RETOUR
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DemandesIndex() {
  const router = useRouter()
  const { user, token, ready, isLoggedIn } = useAuth()

  const isClient  = user?.role === 'CLIENT'
  const isProprio = user?.role === 'PROPRIETAIRE' || user?.role === 'AGENCE'
  const FILTERS   = isClient ? FILTERS_CLIENT : FILTERS_PROPRIO

  const [demandes, setDemandes] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('Toutes')
  const [error,    setError]    = useState(null)

  // ── Fetch ──
 // ── Fetch ──
useEffect(() => {
  if (!ready) return
  if (!isLoggedIn) { router.push('/login'); return }

  setLoading(true)
  setError(null)

  const statut = STATUT_MAP[filter]
  const qs     = statut ? `?statut=${statut}` : ''

  fetch(`/api/demandes${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(r => {
      if (!r.ok) throw new Error(r.status)
      return r.json()
    })
    .then(data => {
      setDemandes(Array.isArray(data) ? data : [])
      setLoading(false)
    })
    .catch(() => {
      setError('Erreur lors du chargement des demandes.')
      setLoading(false)
    })
}, [ready, isLoggedIn, token, filter])  // ← make sure filter is here

  // ── Cancel demande (client) ──
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/demandes/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: 'ANNULEE' }),
      })
      if (!res.ok) throw new Error()
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: 'ANNULEE' } : d))
    } catch {
      alert('Erreur lors de l\'annulation.')
    }
  }

  // ── Contact (proprio) ──
  const handleContact = (demande) => {
    router.push(`/profil/${demande.client_id}`)
  }

  // ── Skeleton ──
  if (!ready || loading) return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />
      <div style={{
        maxWidth: 1000, margin: '60px auto', padding: '0 40px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3,
      }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ height: 220, background: BG2, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
      <style jsx>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )

  return (
    <>
      <Head>
        <title>{isClient ? 'Mes demandes' : 'Demandes clients'} — E-Krili</title>
      </Head>
      <style jsx global>{`
        body { background: #EDE9E1 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Page header ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 40px 0' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => router.push('/panel')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = MUTED}
              >
                ← TABLEAU DE BORD
              </button>
              <span style={{ color: BORDER }}>|</span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>DEMANDES</span>
            </div>

            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>
                  {isClient ? 'ESPACE PERSONNEL' : 'MARCHÉ DES DEMANDES'}
                </div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: TEXT, margin: 0 }}>
                  {isClient ? 'Mes demandes' : 'Demandes clients'}
                </h1>
                <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12 }} />
              </div>

              {isClient && (
                <button
                  onClick={() => router.push('/demandes/nouveau')}
                  style={{
                    background: GOLD, border: 'none', color: BG,
                    fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                    padding: '12px 24px', cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  + NOUVELLE DEMANDE
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 0 }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: 'none', border: 'none',
                    borderBottom: `2px solid ${filter === f ? GOLD : 'transparent'}`,
                    fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                    color: filter === f ? GOLD : MUTED,
                    padding: '12px 20px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── List ── */}
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box' }}>

          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)',
              color: '#dc2626', fontFamily: "'Raleway', sans-serif", fontSize: 11,
              padding: '12px 16px', marginBottom: 28,
            }}>
              {error}
            </div>
          )}

          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT, marginBottom: 28 }}>
            {demandes.length} DEMANDE{demandes.length !== 1 ? 'S' : ''}
          </div>

          {demandes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 12 }}>
                Aucune demande
              </div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT, marginBottom: 32 }}>
                {isClient
                  ? 'Décrivez le bien que vous recherchez et les propriétaires vous contacteront.'
                  : 'Aucune demande client ne correspond à ce filtre pour l\'instant.'}
              </div>
              {isClient && (
                <button
                  onClick={() => router.push('/demandes/nouveau')}
                  style={{
                    background: GOLD, border: 'none', color: BG,
                    fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                    padding: '13px 28px', cursor: 'pointer',
                  }}
                >
                  DÉPOSER UNE DEMANDE
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
              {demandes.map(d => (
                <DemandeCard
                  key={d.id}
                  demande={d}
                  isOwn={isClient}
                  onDelete={handleDelete}
                  onContact={handleContact}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}