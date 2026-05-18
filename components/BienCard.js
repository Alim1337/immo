// components/BienCard.js
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const FAINT  = '#8A8278'
const MUTED  = '#5A5248'
const TEXT   = '#1A1713'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.2)'
const GREEN  = '#4A8A5F'
const GREEN_BG = 'rgba(74,138,95,0.1)'

const Icon = ({ d, size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const ICONS = {
  bed:    'M3 9h18M3 15h18M9 3v18M3 3h18v18H3z',
  area:   'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  loc:    'M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  heart:  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
}

const TYPE_LABELS = {
  APPARTEMENT:     'Appartement',
  VILLA:           'Villa',
  MAISON:          'Maison',
  BUREAU:          'Bureau',
  LOCAL_COMMERCIAL:'Local commercial',
  TERRAIN:         'Terrain',
  STUDIO:          'Studio',
}
const TRANS_LABELS = {
  LOCATION:          'À louer',
  VENTE:             'À vendre',
  LOCATION_VACANCES: 'Vacances',
}
const TRANS_COLORS = {
  LOCATION:          { color: GOLD,    bg: 'rgba(184,137,42,0.1)'  },
  VENTE:             { color: '#4A6FA5', bg: 'rgba(74,111,165,0.1)' },
  LOCATION_VACANCES: { color: GREEN,   bg: GREEN_BG                },
}

export default function BienCard({ bien, onFavorite, isFavorited = false }) {
  const router  = useRouter()
  const [hover, setHover]   = useState(false)
  const [fav,   setFav]     = useState(isFavorited)
  const [imgErr, setImgErr] = useState(false)

  const trans   = TRANS_COLORS[bien.type_transaction] || { color: GOLD, bg: 'rgba(184,137,42,0.1)' }
  const hasImg  = bien.images?.length > 0 && !imgErr
  const propName = bien.proprietaire?.raison_sociale ||
    `${bien.proprietaire?.prenom || ''} ${bien.proprietaire?.nom || ''}`.trim()

  const handleFav = (e) => {
    e.stopPropagation()
    setFav(f => !f)
    onFavorite?.(bien.id, !fav)
  }

  return (
    <div
      onClick={() => router.push(`/biens/${bien.id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG2 : BG,
        border: `1px solid ${hover ? 'rgba(184,137,42,0.5)' : BORDER}`,
        cursor: 'pointer', overflow: 'hidden',
        transition: 'all 0.25s',
        boxShadow: hover ? '0 12px 40px rgba(26,23,19,0.12)' : '0 2px 8px rgba(26,23,19,0.04)',
        transform: hover ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Image area ── */}
      <div style={{ position: 'relative', height: 200, background: '#D8D2C6', overflow: 'hidden', flexShrink: 0 }}>
        {hasImg ? (
          <Image
            src={bien.images[0]}
            alt={bien.titre}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.5s ease', transform: hover ? 'scale(1.05)' : 'scale(1)' }}
            onError={() => setImgErr(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'rgba(90,82,72,0.3)', letterSpacing: 3 }}>
              E·K
            </div>
          </div>
        )}

        {/* Gold border overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          border: `1px solid ${hover ? 'rgba(184,137,42,0.4)' : 'transparent'}`,
          transition: 'border-color 0.3s', pointerEvents: 'none',
        }} />

        {/* Transaction badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: trans.bg, border: `1px solid ${trans.color}44`,
          backdropFilter: 'blur(8px)',
          fontFamily: "'Raleway', sans-serif", fontSize: 7.5, letterSpacing: 2.5,
          color: trans.color, padding: '4px 10px',
        }}>
          {TRANS_LABELS[bien.type_transaction] || bien.type_transaction}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFav}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: fav ? `${GOLD}cc` : 'rgba(237,233,225,0.85)',
            border: `1px solid ${fav ? GOLD : BORDER}`,
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)', transition: 'all 0.2s',
            color: fav ? '#fff' : FAINT,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = fav ? GOLD : 'rgba(237,233,225,0.98)'; e.currentTarget.style.color = fav ? '#fff' : GOLD }}
          onMouseLeave={e => { e.currentTarget.style.background = fav ? `${GOLD}cc` : 'rgba(237,233,225,0.85)'; e.currentTarget.style.color = fav ? '#fff' : FAINT }}
        >
          <Icon d={ICONS.heart} size={13} />
        </button>

        {/* Verified badge */}
        {bien.proprietaire?.est_verifie && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(74,138,95,0.9)', backdropFilter: 'blur(4px)',
            fontFamily: "'Raleway', sans-serif", fontSize: 7, letterSpacing: 2,
            color: '#fff', padding: '3px 8px',
          }}>
            VÉRIFIÉ
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '18px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Type label */}
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 6 }}>
          {TYPE_LABELS[bien.type_bien] || bien.type_bien}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300,
          color: hover ? TEXT : '#2A2420', lineHeight: 1.25, marginBottom: 8,
          transition: 'color 0.2s',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {bien.titre}
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 14 }}>
          <span style={{ color: FAINT, display: 'flex', flexShrink: 0 }}><Icon d={ICONS.loc} size={11} /></span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT, letterSpacing: 0.5 }}>
            {bien.ville}, {bien.wilaya}
          </span>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {bien.nbr_chambres && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: FAINT, display: 'flex' }}><Icon d={ICONS.bed} size={11} /></span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED }}>{bien.nbr_chambres} ch.</span>
            </div>
          )}
          {bien.superficie && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: FAINT, display: 'flex' }}><Icon d={ICONS.area} size={11} /></span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED }}>{Number(bien.superficie).toFixed(0)} m²</span>
            </div>
          )}
          {bien.est_meuble && (
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 1.5, color: GREEN, background: GREEN_BG, padding: '2px 7px', border: `1px solid ${GREEN}33` }}>
              MEUBLÉ
            </span>
          )}
        </div>

        {/* Price + proprietaire */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: GOLD, lineHeight: 1 }}>
              {Number(bien.prix).toLocaleString('fr-DZ')}
              <span style={{ fontSize: 11, color: 'rgba(184,137,42,0.7)', marginLeft: 4 }}>DZD</span>
            </div>
            {bien.type_transaction === 'LOCATION' && (
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, color: FAINT, letterSpacing: 1, marginTop: 2 }}>/mois</div>
            )}
          </div>
          {propName && (
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, color: FAINT, letterSpacing: 1, textAlign: 'right' }}>
              par <span style={{ color: MUTED }}>{propName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}