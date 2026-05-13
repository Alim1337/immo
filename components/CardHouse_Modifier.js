import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { MdOutlineWorkspacePremium } from 'react-icons/md'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#F5F1EA'
const BORDER = 'rgba(184,137,42,0.22)'
const RED    = '#C0392B'

const TYPE_IMAGES = {
  villa:       'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  appartement: 'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
  default:     'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
}

function CardHouseModifier({
  id_biens, description, type_bien, nbrChambre,
  adresse, ville, code_postal, prix_estime, etat, Proprietaire,
}) {
  const router = useRouter()
  const [isModifying, setIsModifying] = useState(false)
  const [deleted, setDeleted]         = useState(false)
  const [saving, setSaving]           = useState(false)
  const [newValues, setNewValues] = useState({
    id_biens, description, type_bien, nbrChambre,
    adresse, ville, code_postal, prix_estime, etat, Proprietaire,
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
      const res = await fetch('/api/api_modifier_bien_button', {
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
    if (!confirm('Supprimer ce bien ?')) return
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
      background: BG2,
      border: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s, transform 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* ── Image ── */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', flexShrink: 0 }}>
        <Image
          src={getImageSrc()}
          alt={description || 'Bien'}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,10,0.55) 0%, transparent 55%)', pointerEvents: 'none' }} />
        {type_bien && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3,
            color: '#F5F0E8', background: 'rgba(20,15,10,0.55)',
            padding: '4px 10px', backdropFilter: 'blur(4px)',
          }}>
            {type_bien.toUpperCase()}
          </div>
        )}
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
          /* ── Edit form ── */
          <form onSubmit={handleDone} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Description', name: 'description', type: 'text' },
              { label: 'Type de bien', name: 'type_bien', type: 'text' },
              { label: 'Adresse', name: 'adresse', type: 'text' },
              { label: 'Ville', name: 'ville', type: 'text' },
              { label: 'Prix estimé', name: 'prix_estime', type: 'number' },
              { label: 'Nb chambres', name: 'nbrChambre', type: 'number' },
              { label: 'État', name: 'etat', type: 'text' },
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
                    border: 'none', borderBottom: `1px solid ${BORDER}`,
                    fontFamily: "'Raleway', sans-serif", fontSize: 12,
                    color: TEXT, padding: '6px 0', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = GOLD}
                  onBlur={e => e.target.style.borderBottomColor = BORDER}
                />
              </div>
            ))}

            {/* image upload */}
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, marginBottom: 6 }}>
                IMAGE
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: MUTED }} />
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
                flex: 1, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED,
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                padding: '10px 0', cursor: 'pointer',
              }}>
                ANNULER
              </button>
            </div>
          </form>
        ) : (
          /* ── Display mode ── */
          <>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: TEXT, marginBottom: 6, lineHeight: 1.3 }}>
              {description || '—'}
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 1, color: FAINT, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {[adresse, ville, code_postal].filter(Boolean).join(', ')}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: `1px solid ${BORDER}`, marginBottom: 16 }}>
              {nbrChambre && <Chip label={`${nbrChambre} ch.`} />}
              {etat       && <Chip label={etat} />}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button onClick={() => setIsModifying(true)} style={{
                flex: 1, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD,
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                padding: '10px 0', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = BG }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = GOLD }}
              >
                MODIFIER
              </button>
              <button onClick={handleSupprimer} style={{
                flex: 1, background: 'transparent', border: `1px solid rgba(192,57,43,0.4)`, color: RED,
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
                padding: '10px 0', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = RED; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = RED }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = RED; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.4)' }}
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

function Chip({ label }) {
  return (
    <div style={{
      fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: MUTED,
      border: `1px solid ${BORDER}`, padding: '3px 8px',
    }}>
      {label}
    </div>
  )
}

export default CardHouseModifier