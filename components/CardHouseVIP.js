import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import jwt from 'jsonwebtoken'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.22)'

const TYPE_IMAGES = {
  villa:       'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  appartement: 'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
  default:     'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
}

function CardHouseVIP({
  id_biens, description, type_bien, adresse, ville,
  code_postal, prix_estime, etat, nbrChambre,
  Proprietaire, token, onInterestedClick, type_location_vip,
}) {
  const [decodedToken, setDecodedToken] = useState(null)
  const [saved, setSaved]               = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (token) setDecodedToken(jwt.decode(token))
  }, [token])

  const getStoredImage = () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(`image_${id_biens}`)
    return stored ? JSON.parse(stored).data : null
  }

  const getImageSrc = () => {
    const key = type_bien?.toLowerCase()
    return getStoredImage() || TYPE_IMAGES[key] || TYPE_IMAGES.default
  }

  const isOwner = decodedToken && decodedToken.id === Proprietaire?.id_proprietaire

  return (
    <article
      style={{
        background: DARK,
        border: `1px solid rgba(184,137,42,0.35)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'box-shadow 0.3s, transform 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.25), 0 0 0 1px ${GOLD}`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* ── VIP crown badge ── */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px',
          background: 'linear-gradient(to bottom, rgba(20,15,10,0.7), transparent)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'Raleway', sans-serif", fontSize: 8,
            letterSpacing: 4, color: GOLD_L,
          }}
        >
          ★ VIP
        </div>
        {type_location_vip && (
          <div
            style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 7,
              letterSpacing: 3, color: '#F5F0E8',
              background: 'rgba(184,137,42,0.25)',
              border: `1px solid rgba(184,137,42,0.4)`,
              padding: '3px 8px',
            }}
          >
            {type_location_vip.toUpperCase()}
          </div>
        )}
      </div>

      {/* ── Image ── */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
        <Image
          src={getImageSrc()}
          alt={description || 'Bien VIP'}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.5s ease', filter: 'brightness(0.85) saturate(0.9)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* deep gradient for text readability */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(20,15,10,0.85) 0%, rgba(20,15,10,0.1) 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* save */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(s => !s) }}
          style={{
            position: 'absolute', top: 10, right: 10, zIndex: 3,
            background: 'rgba(20,15,10,0.55)',
            border: `1px solid rgba(184,137,42,0.4)`,
            width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          aria-label="Sauvegarder"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={saved ? GOLD : 'none'} stroke={GOLD_L} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* price over image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px' }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22, fontWeight: 400, color: '#F5F0E8', lineHeight: 1,
            }}
          >
            {prix_estime
              ? `${Number(prix_estime).toLocaleString('fr-DZ')} DZD`
              : 'Prix sur demande'}
          </div>
        </div>
      </div>

      {/* ── Gold rule ── */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />

      {/* ── Body ── */}
      <div style={{ padding: '18px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* title */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, fontWeight: 400, color: '#F5F0E8',
            marginBottom: 6, lineHeight: 1.3,
          }}
        >
          {description || '—'}
        </div>

        {/* location */}
        <div
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 10, letterSpacing: 1,
            color: 'rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', gap: 4,
            marginBottom: 18,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GOLD_L} strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {[adresse, ville, code_postal].filter(Boolean).join(', ')}
        </div>

        {/* meta chips — dark variant */}
        <div
          style={{
            display: 'flex', gap: 8, flexWrap: 'wrap',
            paddingTop: 14,
            borderTop: `1px solid rgba(184,137,42,0.2)`,
            marginBottom: 16,
          }}
        >
          {nbrChambre && <DarkChip icon="🛏" label={`${nbrChambre} chambres`} />}
          {etat        && <DarkChip icon="✦" label={etat} />}
          {type_bien   && <DarkChip icon="🏠" label={type_bien} />}
          {Proprietaire?.nom && <DarkChip icon="👤" label={Proprietaire.nom} />}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto' }}>
          {isOwner ? (
            <div
              style={{
                fontFamily: "'Raleway', sans-serif", fontSize: 9,
                letterSpacing: 3, color: GOLD,
                border: `1px solid rgba(184,137,42,0.3)`,
                padding: '10px 0', textAlign: 'center',
              }}
            >
              VOTRE BIEN
            </div>
          ) : token ? (
            <button
              onClick={() => onInterestedClick(id_biens, Proprietaire?.id_proprietaire)}
              style={{
                width: '100%',
                background: GOLD,
                border: 'none',
                color: BG,
                fontFamily: "'Raleway', sans-serif",
                fontSize: 9, letterSpacing: 4,
                padding: '12px 0', cursor: 'pointer',
                transition: 'background 0.25s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}
            >
              JE SUIS INTÉRESSÉ
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              style={{
                width: '100%',
                background: 'transparent',
                border: `1px solid rgba(184,137,42,0.3)`,
                color: GOLD_L,
                fontFamily: "'Raleway', sans-serif",
                fontSize: 9, letterSpacing: 3,
                padding: '12px 0', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(184,137,42,0.3)'}
            >
              CONNEXION REQUISE
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function DarkChip({ icon, label }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        fontFamily: "'Raleway', sans-serif", fontSize: 9,
        letterSpacing: 1, color: 'rgba(255,255,255,0.4)',
        border: '1px solid rgba(184,137,42,0.18)',
        padding: '3px 8px',
      }}
    >
      <span style={{ fontSize: 10 }}>{icon}</span>
      {label}
    </div>
  )
}

export default CardHouseVIP