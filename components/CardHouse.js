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
const BORDER = 'rgba(184,137,42,0.22)'
const BORDER_H = 'rgba(184,137,42,0.5)'

const TYPE_IMAGES = {
  villa:       'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  appartement: 'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
  default:     'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
}

const ETAT_LABELS = {
  neuf:                 { label: 'Neuf',             color: '#4A7C59' },
  bonne_condition:      { label: 'Bonne condition',  color: '#5A7A4A' },
  rénové:               { label: 'Rénové',           color: '#6A7A3A' },
  à_rénover:            { label: 'À rénover',        color: '#8A7228' },
  partiellement_rénové: { label: 'Part. rénové',     color: '#7A6828' },
  en_construction:      { label: 'En construction',  color: '#7A5828' },
}

const Ico = ({ d, size = 13, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  pin:   'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  bed:   'M2 4v16M2 8h18a2 2 0 0 1 2 2v6H2M2 14h20',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  user:  'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  lock:  'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  arrow: 'M5 12h14M12 5l7 7-7 7',
}

function CardHouse({
  id_biens, description, type_bien, adresse, ville,
  code_postal, prix_estime, etat, nbrChambre,
  Proprietaire, token, onInterestedClick,
}) {
  const [decodedToken, setDecodedToken] = useState(null)
  const [saved, setSaved]               = useState(false)
  const [hovered, setHovered]           = useState(false)
  const [imgHovered, setImgHovered]     = useState(false)
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

  const isOwner  = decodedToken && decodedToken.id === Proprietaire?.id_proprietaire
  const etatMeta = etat ? (ETAT_LABELS[etat] || { label: etat, color: FAINT }) : null
  const location = [adresse, ville].filter(Boolean).join(', ')

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#F8F4ED',
        border: `1px solid ${hovered ? BORDER_H : BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.3s, box-shadow 0.35s, transform 0.35s',
        boxShadow: hovered
          ? '0 24px 64px rgba(26,23,19,0.13)'
          : '0 2px 8px rgba(26,23,19,0.04)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      {/* ── Image ── */}
      <div
        style={{ position: 'relative', height: 250, overflow: 'hidden', flexShrink: 0 }}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        <Image
          src={getImageSrc()}
          alt={description || 'Bien immobilier'}
          fill
          style={{
            objectFit: 'cover',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: imgHovered ? 'scale(1.07)' : 'scale(1)',
          }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,10,5,0.78) 0%, rgba(15,10,5,0.12) 45%, transparent 100%)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
          opacity: hovered ? 1 : 0.82,
        }} />

        {/* Top badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {type_bien && (
            <div style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3,
              color: '#F5F0E8', background: 'rgba(26,23,19,0.62)',
              padding: '5px 11px', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              {type_bien.toUpperCase()}
            </div>
          )}
          <button
            onClick={e => { e.stopPropagation(); setSaved(s => !s) }}
            style={{
              background: saved ? GOLD : 'rgba(237,233,225,0.12)',
              border: `1px solid ${saved ? GOLD : 'rgba(255,255,255,0.18)'}`,
              backdropFilter: 'blur(6px)',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.25s', padding: 0,
            }}
            aria-label="Sauvegarder"
          >
            <Ico d={ICONS.heart} size={14} stroke={saved ? '#FFF' : '#F5F0E8'} />
          </button>
        </div>

        {/* Etat badge */}
        {etatMeta && (
          <div style={{
            position: 'absolute', bottom: 62, left: 14,
            fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
            color: etatMeta.color, background: 'rgba(237,233,225,0.93)',
            padding: '4px 10px',
          }}>
            {etatMeta.label.toUpperCase()}
          </div>
        )}

        {/* Price */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px 14px' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, fontWeight: 400, color: '#F5F0E8', lineHeight: 1,
            textShadow: '0 2px 8px rgba(0,0,0,0.35)',
          }}>
            {prix_estime
              ? `${Number(prix_estime).toLocaleString('fr-DZ')} DZD`
              : 'Prix sur demande'}
          </div>
          {nbrChambre && (
            <div style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 9,
              letterSpacing: 2, color: 'rgba(245,240,232,0.5)',
              marginTop: 4, display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Ico d={ICONS.bed} size={11} stroke="rgba(245,240,232,0.5)" />
              {nbrChambre} chambres
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '20px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 400, color: TEXT,
          lineHeight: 1.3, marginBottom: 8,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {description || '—'}
        </div>

        {/* Location */}
        {location && (
          <div style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 9, letterSpacing: 1, color: FAINT,
            display: 'flex', alignItems: 'center', gap: 5,
            marginBottom: 16,
          }}>
            <Ico d={ICONS.pin} size={11} stroke={GOLD} />
            {location}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />

        {/* Meta */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {nbrChambre && <MetaChip icon={ICONS.bed} label={`${nbrChambre} ch.`} />}
          {Proprietaire?.nom && <MetaChip icon={ICONS.user} label={Proprietaire.nom} />}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto' }}>
          {isOwner ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
              color: GOLD, border: `1px solid ${BORDER}`, padding: '12px 0',
            }}>
              ✦ VOTRE BIEN
            </div>
          ) : token ? (
            <InterestedBtn onClick={() => onInterestedClick(id_biens, Proprietaire?.id_proprietaire)} />
          ) : (
            <LoginBtn onClick={() => router.push('/login')} />
          )}
        </div>
      </div>
    </article>
  )
}

function MetaChip({ icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: MUTED,
      border: `1px solid ${BORDER}`, padding: '4px 10px',
      background: 'rgba(237,233,225,0.5)',
    }}>
      <Ico d={icon} size={11} stroke={FAINT} />
      {label}
    </div>
  )
}

function InterestedBtn({ onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        background: 'transparent',
        border: `1px solid ${GOLD}`,
        color: GOLD,
        fontFamily: "'Raleway', sans-serif",
        fontSize: 9, letterSpacing: 3,
        padding: '12px 0', cursor: 'pointer',
        transition: 'all 0.28s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        // Fill-from-left effect via background trick
        backgroundImage: hover ? `linear-gradient(${GOLD}, ${GOLD})` : 'none',
        backgroundSize: hover ? '100% 100%' : '0% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        ...(hover ? { color: BG } : {}),
      }}
    >
      JE SUIS INTÉRESSÉ
      <Ico d={ICONS.arrow} size={13} stroke={hover ? BG : GOLD} />
    </button>
  )
}

function LoginBtn({ onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        background: 'transparent',
        border: `1px solid ${hover ? MUTED : BORDER}`,
        color: hover ? MUTED : FAINT,
        fontFamily: "'Raleway', sans-serif",
        fontSize: 9, letterSpacing: 3,
        padding: '12px 0', cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      <Ico d={ICONS.lock} size={12} stroke={hover ? MUTED : FAINT} />
      CONNEXION REQUISE
    </button>
  )
}

export default CardHouse