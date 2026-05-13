import React, { useState } from 'react'
import Image from 'next/image'
import { MdOutlineWorkspacePremium } from 'react-icons/md'

/* ── NO BgLogin import — that was causing the full-screen banner ── */

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.22)'
const RED    = '#C0392B'

const TYPE_IMAGES = {
  villa:       'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  appartement: 'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
  default:     'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
}

function CardHouseModifiervip({
  id_biens, description, type_bien, type_location_vip,
  nbrChambre, adresse, ville, code_postal, prix_estime, etat, Proprietaire,
}) {
  const [isModifying, setIsModifying] = useState(false)
  const [deleted, setDeleted]         = useState(false)
  const [saving, setSaving]           = useState(false)
  const [newValues, setNewValues] = useState({
    id_biens, description, type_bien, type_location_vip,
    nbrChambre, adresse, ville, code_postal, prix_estime, etat, Proprietaire,
  })

  const getStoredImage = () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(`image_${id_biens}`)
    return stored ? JSON.parse(stored).data : null
  }

  const getImageSrc = () =>
    getStoredImage() || TYPE_IMAGES[type_bien?.toLowerCase()] || TYPE_IMAGES.default

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const obj = { name: `image_${id_biens}_${Date.now()}`, data: ev.target.result }
      localStorage.setItem(`image_${id_biens}`, JSON.stringify(obj))
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewValues(prev => ({ ...prev, [name]: value }))
  }

  const handleDone = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/api_modifier_bien_button_vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_biens, newValues }),
      })
      if (res.ok) setIsModifying(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleSupprimer = async () => {
    if (!confirm('Supprimer ce bien VIP ?')) return
    try {
      const res = await fetch(`/api/api_supprimer_bien_button/${id_biens}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) setDeleted(true)
    } catch (err) {
      console.error(err)
    }
  }

  if (deleted) return null

  return (
    <article style={{
      background: DARK,
      border: `1px solid rgba(184,137,42,0.35)`,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s, transform 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.25), 0 0 0 1px ${GOLD}`; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* ── VIP badge bar ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 14px', borderBottom: `1px solid rgba(184,137,42,0.2)`,
        background: 'rgba(184,137,42,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MdOutlineWorkspacePremium style={{ color: GOLD_L, fontSize: 14 }} />
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 4, color: GOLD_L }}>
            BIEN VIP
          </span>
        </div>
        {type_location_vip && (
          <div style={{
            fontFamily: "'Raleway', sans-serif", fontSize: 7, letterSpacing: 3,
            color: FAINT, border: `1px solid rgba(184,137,42,0.25)`, padding: '3px 8px',
          }}>
            {type_location_vip.toUpperCase()}
          </div>
        )}
      </div>

      {/* ── Image ── */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', flexShrink: 0 }}>
        <Image
          src={getImageSrc()}
          alt={description || 'Bien VIP'}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.5s', filter: 'brightness(0.82) saturate(0.9)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,10,0.8) 0%, transparent 55%)', pointerEvents: 'none' }} />
        {/* gold rule at bottom of image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
        {prix_estime && (
          <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, color: '#F5F0E8' }}>
              {Number(prix_estime).toLocaleString('fr-DZ')} DZD
            </div>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {isModifying ? (
          <form onSubmit={handleDone} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Description',      name: 'description',      type: 'text' },
              { label: 'Type de bien',     name: 'type_bien',        type: 'text' },
              { label: 'Type location',    name: 'type_location_vip',type: 'text' },
              { label: 'Adresse',          name: 'adresse',          type: 'text' },
              { label: 'Ville',            name: 'ville',            type: 'text' },
              { label: 'Prix estimé',      name: 'prix_estime',      type: 'number' },
              { label: 'Nb chambres',      name: 'nbrChambre',       type: 'number' },
              { label: 'État',             name: 'etat',             type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, marginBottom: 4 }}>
                  {label.toUpperCase()}
                </div>
                <input
                  type={type} name={name} value={newValues[name] || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%', background: 'transparent',
                    border: 'none', borderBottom: `1px solid rgba(184,137,42,0.3)`,
                    fontFamily: "'Raleway', sans-serif", fontSize: 12,
                    color: '#F5F0E8', padding: '6px 0', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = GOLD}
                  onBlur={e => e.target.style.borderBottomColor = 'rgba(184,137,42,0.3)'}
                />
              </div>
            ))}

            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, marginBottom: 6 }}>IMAGE</div>
              <input type="file" accept="image/*" onChange={handleImageChange}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT }} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit" disabled={saving} style={{
                flex: 1, background: GOLD, border: 'none', color: BG,
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                padding: '10px 0', cursor: 'pointer', opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'ENREGISTREMENT…' : 'ENREGISTRER'}
              </button>
              <button type="button" onClick={() => setIsModifying(false)} style={{
                flex: 1, background: 'transparent', border: `1px solid rgba(184,137,42,0.3)`, color: FAINT,
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                padding: '10px 0', cursor: 'pointer',
              }}>
                ANNULER
              </button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: '#F5F0E8', marginBottom: 6, lineHeight: 1.3 }}>
              {description || '—'}
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GOLD_L} strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {[adresse, ville, code_postal].filter(Boolean).join(', ')}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: `1px solid rgba(184,137,42,0.18)`, marginBottom: 16 }}>
              {nbrChambre && <DarkChip label={`${nbrChambre} ch.`} />}
              {etat       && <DarkChip label={etat} />}
              {type_bien  && <DarkChip label={type_bien} />}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button onClick={() => setIsModifying(true)} style={{
                flex: 1, background: GOLD, border: 'none', color: BG,
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                padding: '10px 0', cursor: 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}
              >
                MODIFIER
              </button>
              <button onClick={handleSupprimer} style={{
                flex: 1, background: 'transparent', border: `1px solid rgba(192,57,43,0.5)`, color: '#E07060',
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                padding: '10px 0', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = RED; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = RED }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E07060'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.5)' }}
              >
                SUPPRIMER
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  )
}

function DarkChip({ label }) {
  return (
    <div style={{
      fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1,
      color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(184,137,42,0.2)',
      padding: '3px 8px',
    }}>
      {label}
    </div>
  )
}

export default CardHouseModifiervip