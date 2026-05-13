import React, { useState } from 'react'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const Icon = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const STATUS_COLORS = {
  'en attente':  { bg: 'rgba(184,137,42,0.1)',  text: GOLD },
  'acceptée':    { bg: 'rgba(34,197,94,0.1)',   text: '#16a34a' },
  'refusée':     { bg: 'rgba(239,68,68,0.1)',   text: '#dc2626' },
  'en cours':    { bg: 'rgba(59,130,246,0.1)',  text: '#2563eb' },
}

const formatPrice = (p) => p ? Number(p).toLocaleString('fr-DZ') + ' DA' : '—'
const formatDate  = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '9px 0', borderBottom: `1px solid rgba(184,137,42,0.1)` }}>
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, textTransform: 'uppercase' }}>
      {label}
    </span>
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 400, color: TEXT }}>
      {value || '—'}
    </span>
  </div>
)

const Demande_client_card = ({ demandeClient, clientName, handleSupprimer }) => {
  const {
    id_demande_client,
    type_bien,
    type_transaction,
    prix_minimum,
    prix_maximum,
    surface_minimum,
    nbr_chambre_minimum,
    date_debut_recherche,
    statut_demande,
  } = demandeClient

  const [showConfirm, setShowConfirm] = useState(false)
  const [hoverDelete, setHoverDelete] = useState(false)
  const [hoverConfirm, setHoverConfirm] = useState(false)
  const [hoverCancel, setHoverCancel] = useState(false)

  const statusKey = (statut_demande || '').toLowerCase()
  const statusStyle = STATUS_COLORS[statusKey] || { bg: 'rgba(138,130,120,0.1)', text: FAINT }

  return (
    <div style={{
      background: BG2,
      border: `1px solid ${BORDER}`,
      transition: 'box-shadow 0.25s, transform 0.25s',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      {/* Gold top accent */}
      <div style={{ height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />

      <div style={{ padding: '24px 28px 28px' }}>

        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 6 }}>
              DEMANDE #{id_demande_client}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: TEXT, lineHeight: 1.1 }}>
              {clientName || 'Client'}
            </div>
          </div>

          {/* Status badge */}
          {statut_demande && (
            <div style={{
              background: statusStyle.bg,
              color: statusStyle.text,
              fontFamily: "'Raleway', sans-serif",
              fontSize: 8, letterSpacing: 2,
              padding: '4px 10px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {statut_demande}
            </div>
          )}
        </div>

        {/* Data rows */}
        <div style={{ marginBottom: 24 }}>
          <Row label="Type de bien"    value={type_bien ? type_bien.charAt(0).toUpperCase() + type_bien.slice(1) : null} />
          <Row label="Transaction"     value={type_transaction} />
          <Row label="Prix minimum"    value={formatPrice(prix_minimum)} />
          <Row label="Prix maximum"    value={formatPrice(prix_maximum)} />
          <Row label="Surface min."    value={surface_minimum ? `${surface_minimum} m²` : null} />
          <Row label="Chambres min."   value={nbr_chambre_minimum} />
          <Row label="Début recherche" value={formatDate(date_debut_recherche)} />
        </div>

        {/* Actions */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            onMouseEnter={() => setHoverDelete(true)}
            onMouseLeave={() => setHoverDelete(false)}
            style={{
              background: 'transparent',
              border: `1px solid ${hoverDelete ? '#dc2626' : 'rgba(220,38,38,0.3)'}`,
              color: hoverDelete ? '#dc2626' : 'rgba(220,38,38,0.6)',
              fontFamily: "'Raleway', sans-serif",
              fontSize: 8, letterSpacing: 2,
              padding: '9px 20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <Icon d="M3 6h18M19 6l-1 14H6L5 6M10 6V4h4v2" size={12} />
            SUPPRIMER
          </button>
        ) : (
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED, marginBottom: 14, lineHeight: 1.7 }}>
              Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setShowConfirm(false); handleSupprimer(id_demande_client) }}
                onMouseEnter={() => setHoverConfirm(true)}
                onMouseLeave={() => setHoverConfirm(false)}
                style={{
                  flex: 1, background: hoverConfirm ? '#b91c1c' : '#dc2626',
                  border: 'none', color: '#fff',
                  fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
                  padding: '10px 0', cursor: 'pointer', transition: 'background 0.2s',
                }}
              >
                CONFIRMER
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                onMouseEnter={() => setHoverCancel(true)}
                onMouseLeave={() => setHoverCancel(false)}
                style={{
                  flex: 1, background: 'transparent',
                  border: `1px solid ${hoverCancel ? MUTED : BORDER}`,
                  color: hoverCancel ? TEXT : MUTED,
                  fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
                  padding: '10px 0', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                ANNULER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Demande_client_card