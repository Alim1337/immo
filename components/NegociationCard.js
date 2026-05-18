// components/NegociationCard.js
import React from 'react'
import { useRouter } from 'next/router'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const STATUS_CONFIG = {
  EN_COURS:  { color: GOLD,      label: 'En cours'  },
  ACCEPTEE:  { color: '#2ECC71', label: 'Acceptée'  },
  REFUSEE:   { color: '#E74C3C', label: 'Refusée'   },
  ANNULEE:   { color: FAINT,     label: 'Annulée'   },
  FINALISEE: { color: MUTED,     label: 'Finalisée' },
}

export default function NegociationCard({ neg, currentUserId, onClick }) {
  const router = useRouter()

  const isClient  = neg.client_id === currentUserId
  const other     = isClient ? neg.proprietaire : neg.client
  const otherName = other?.raison_sociale || `${other?.prenom || ''} ${other?.nom || ''}`.trim()
  const status    = STATUS_CONFIG[neg.statut] || { color: FAINT, label: neg.statut }
  const lastMsg   = neg.messages?.[0]
  const unread    = (neg.messages || []).filter(m => !m.lu && m.expediteur_id !== currentUserId).length

  const handleClick = () => {
    if (onClick) onClick(neg)
    else router.push(`/negociations/${neg.id}`)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: BG2,
        border: `1px solid ${unread > 0 ? GOLD : BORDER}`,
        padding: '18px 22px',
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 16,
        alignItems: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = GOLD
        e.currentTarget.style.background  = '#DDD8CE'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = unread > 0 ? GOLD : BORDER
        e.currentTarget.style.background  = BG2
      }}
    >
      {/* ── Left: info ── */}
      <div style={{ minWidth: 0 }}>
        {/* Bien title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 400, color: TEXT,
          marginBottom: 3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {neg.bien?.titre || '—'}
        </div>

        {/* Counterpart + location */}
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT, marginBottom: 8 }}>
          {isClient ? 'Propriétaire' : 'Client'} :{' '}
          <span style={{ color: MUTED }}>{otherName}</span>
          {neg.bien?.ville && <> · {neg.bien.ville}</>}
        </div>

        {/* Last message preview */}
        {lastMsg && (
          <div style={{
            fontFamily: "'Raleway', sans-serif", fontSize: 10,
            color: unread > 0 ? MUTED : FAINT,
            fontWeight: unread > 0 ? 400 : 300,
            fontStyle: 'italic',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 400,
          }}>
            {lastMsg.expediteur_id === currentUserId ? 'Vous : ' : `${otherName} : `}
            {lastMsg.contenu}
          </div>
        )}
      </div>

      {/* ── Right: meta ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        {/* Status badge */}
        <div style={{
          fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3,
          color: status.color, border: `1px solid ${status.color}`,
          padding: '4px 10px',
        }}>
          {status.label.toUpperCase()}
        </div>

        {/* Proposed price */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: GOLD }}>
          {Number(neg.prix_propose).toLocaleString('fr-DZ')} DZD
        </div>

        {/* Unread badge */}
        {unread > 0 && (
          <div style={{
            background: GOLD, color: BG,
            fontFamily: "'Raleway', sans-serif", fontSize: 9,
            width: 22, height: 22, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread}
          </div>
        )}

        {/* Arrow */}
        <span style={{ color: GOLD, fontSize: 14 }}>→</span>
      </div>
    </div>
  )
}