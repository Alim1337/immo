// components/usersCard.js
// Compact card that shows a user (CLIENT / PROPRIETAIRE / AGENCE)
// Used wherever a list of users is rendered (admin panel, search results, etc.)

import React, { useState } from 'react'
import { useRouter } from 'next/router'

const GOLD     = '#B8892A'
const GOLD_L   = '#D4A84B'
const GOLD_DIM = 'rgba(184,137,42,0.6)'
const BG_CARD  = '#EDE9E1'
const BG_CARD2 = '#E4DFD5'
const TEXT_1   = '#1A1713'
const TEXT_2   = '#5A5248'
const TEXT_3   = '#8A8278'
const BORDER   = 'rgba(184,137,42,0.18)'
const BORDER_H = 'rgba(184,137,42,0.5)'
const GREEN    = '#3D7A52'
const GREEN_BG = 'rgba(61,122,82,0.1)'

const Icon = ({ d, size = 14, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  pin:   'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  check: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  home:  'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  star:  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  arrow: 'M5 12h14M12 5l7 7-7 7',
}

const ROLE_LABELS = {
  CLIENT:       'CLIENT',
  PROPRIETAIRE: 'PROPRIÉTAIRE',
  AGENCE:       'AGENCE',
}

function StarRating({ note, size = 11 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(note) ? GOLD : 'rgba(184,137,42,0.2)', fontSize: size }}>★</span>
      ))}
    </div>
  )
}

/**
 * UsersCard
 *
 * Props:
 *   user {
 *     id, nom, prenom, raison_sociale,
 *     avatar_url, role, ville, wilaya,
 *     est_verifie, date_inscription,
 *     note_moyenne, nombre_avis,
 *     _count: { biens }
 *   }
 *   onClick   — optional override; defaults to router.push('/profil/:id')
 *   compact   — boolean, hides stats strip for tight layouts (default false)
 */
export default function UsersCard({ user, onClick, compact = false }) {
  const router = useRouter()
  const [hover, setHover] = useState(false)

  if (!user) return null

  const displayName = user.raison_sociale
    || `${user.prenom || ''} ${user.nom || ''}`.trim()
    || 'Utilisateur'

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')

  const location = [user.ville, user.wilaya].filter(Boolean).join(', ')

  const handleClick = onClick || (() => router.push(`/profil/${user.id}`))

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG_CARD2 : BG_CARD,
        border: `1px solid ${hover ? BORDER_H : BORDER}`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.2s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 8px 24px rgba(26,23,19,0.09)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Gold top accent */}
      <div style={{ height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />

      <div style={{ padding: '20px 22px' }}>

        {/* ── Avatar + name row ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>

          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                style={{ width: 44, height: 44, objectFit: 'cover', border: `1px solid ${BORDER}` }}
              />
            ) : (
              <div style={{
                width: 44, height: 44,
                background: `${GOLD}18`,
                border: `1px solid ${GOLD}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: GOLD }}>
                  {initials || '?'}
                </span>
              </div>
            )}
          </div>

          {/* Name + role + verified */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 8, letterSpacing: 3,
                color: GOLD,
              }}>
                {ROLE_LABELS[user.role] || user.role}
              </span>
              {user.est_verifie && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: GREEN_BG,
                  border: `1px solid ${GREEN}33`,
                  color: GREEN,
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 7, letterSpacing: 2,
                  padding: '2px 7px',
                }}>
                  <Icon d={ICONS.check} size={9} stroke={GREEN} /> VÉRIFIÉ
                </span>
              )}
            </div>

            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 17, fontWeight: 300,
              color: hover ? TEXT_1 : TEXT_2,
              transition: 'color 0.2s',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}>
              {displayName}
            </div>
          </div>
        </div>

        {/* ── Meta ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: compact ? 0 : 16 }}>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={ICONS.pin} size={11} stroke={TEXT_3} />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: TEXT_3, letterSpacing: 0.5 }}>
                {location}
              </span>
            </div>
          )}

          {user.note_moyenne && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarRating note={user.note_moyenne} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: GOLD }}>
                {user.note_moyenne}
              </span>
              {user.nombre_avis && (
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: TEXT_3 }}>
                  ({user.nombre_avis} avis)
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Stats strip (hidden in compact mode) ── */}
        {!compact && (
          <>
            <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {user._count?.biens != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon d={ICONS.home} size={11} stroke={TEXT_3} />
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: TEXT_3 }}>
                    {user._count.biens} bien{user._count.biens !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {user.date_inscription && (
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: TEXT_3 }}>
                  Depuis {new Date(user.date_inscription).toLocaleDateString('fr-DZ', { year: 'numeric', month: 'short' })}
                </span>
              )}
              {/* Arrow hint */}
              <span style={{ color: hover ? GOLD : GOLD_DIM, transition: 'color 0.2s' }}>
                <Icon d={ICONS.arrow} size={12} stroke="currentColor" />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}