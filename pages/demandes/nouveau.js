// pages/demandes/nouveau.js
// CLIENT only — create a new property search request

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

// ── Enums from schema ─────────────────────────────────────────────────────────

const TYPE_BIEN_OPTIONS = [
  { value: 'APPARTEMENT',      label: 'Appartement' },
  { value: 'VILLA',            label: 'Villa' },
  { value: 'MAISON',           label: 'Maison' },
  { value: 'BUREAU',           label: 'Bureau' },
  { value: 'LOCAL_COMMERCIAL', label: 'Local commercial' },
  { value: 'TERRAIN',          label: 'Terrain' },
  { value: 'STUDIO',           label: 'Studio' },
]

const TYPE_TRANSACTION_OPTIONS = [
  { value: 'LOCATION',          label: 'Location' },
  { value: 'VENTE',             label: 'Vente' },
  { value: 'LOCATION_VACANCES', label: 'Location vacances' },
]

// Algerian wilayas (abbreviated list — extend as needed)
const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt',
  'El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
  'Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar',
  'Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',
  'El M\'Ghair','El Meniaa',
]

// ── Shared input styles ───────────────────────────────────────────────────────

const inputStyle = {
  width: '100%',
  background: BG,
  border: `1px solid ${BORDER}`,
  color: TEXT,
  fontFamily: "'Raleway', sans-serif",
  fontSize: 12,
  padding: '11px 14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontFamily: "'Raleway', sans-serif",
  fontSize: 9,
  letterSpacing: 2,
  color: FAINT,
  textTransform: 'uppercase',
  marginBottom: 7,
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: GOLD, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Option button (type_bien, type_transaction) ───────────────────────────────

function OptionButton({ label, selected, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? GOLD : 'transparent',
        border: `1px solid ${selected ? GOLD : hovered ? GOLD : BORDER}`,
        color: selected ? BG : hovered ? GOLD : MUTED,
        fontFamily: "'Raleway', sans-serif",
        fontSize: 9, letterSpacing: 2,
        padding: '10px 16px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        whiteSpace: 'nowrap',
      }}
    >
      {label.toUpperCase()}
    </button>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const EMPTY = {
  type_bien:        '',
  type_transaction: '',
  wilaya:           '',
  ville:            '',
  prix_min:         '',
  prix_max:         '',
  superficie_min:   '',
  nbr_chambres_min: '',
  description:      '',
}

export default function NouvelleDemandeForm() {
  const router = useRouter()
  const { token, ready, isLoggedIn, user } = useAuth()

  const [form,       setForm]       = useState(EMPTY)
  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)

  // Redirect non-clients and unauthenticated users
  useEffect(() => {
    if (!ready) return
    if (!isLoggedIn)            { router.push('/login');    return }
    if (user?.role !== 'CLIENT') { router.push('/demandes'); return }
  }, [ready, isLoggedIn, user])

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const pick = (field, value) =>
    setForm(prev => ({ ...prev, [field]: prev[field] === value ? '' : value }))

  // ── Validation ──
  const validate = () => {
    const e = {}
    if (!form.type_bien)        e.type_bien        = 'Requis'
    if (!form.type_transaction) e.type_transaction = 'Requis'
    if (!form.wilaya)           e.wilaya           = 'Requis'
    if (form.prix_min && form.prix_max && parseFloat(form.prix_min) > parseFloat(form.prix_max))
      e.prix_max = 'Le prix max doit être supérieur au prix min'
    return e
  }

  // ── Submit ──
  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSubmitting(true)

    try {
      const res = await fetch('/api/demandes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type_bien:        form.type_bien        || undefined,
          type_transaction: form.type_transaction || undefined,
          wilaya:           form.wilaya           || undefined,
          ville:            form.ville            || undefined,
          prix_min:         form.prix_min         || undefined,
          prix_max:         form.prix_max         || undefined,
          superficie_min:   form.superficie_min   || undefined,
          nbr_chambres_min: form.nbr_chambres_min || undefined,
          description:      form.description      || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrors({ _global: data.error || 'Erreur lors de la création.' })
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/demandes'), 1800)
    } catch {
      setErrors({ _global: 'Erreur réseau. Veuillez réessayer.' })
      setSubmitting(false)
    }
  }

  if (!ready) return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />
    </div>
  )

  // ── Success screen ──
  if (success) return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(184,137,42,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 8 }}>
            Demande publiée
          </div>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT }}>
            Redirection en cours…
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>Nouvelle demande — E-Krili</title></Head>
      <style jsx global>{`body { background: #EDE9E1 !important; }`}</style>

      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Page header ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 40px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => router.push('/demandes')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = MUTED}
              >
                ← MES DEMANDES
              </button>
              <span style={{ color: BORDER }}>|</span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>NOUVELLE DEMANDE</span>
            </div>

            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>
              ESPACE PERSONNEL
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: TEXT, margin: '0 0 12px' }}>
              Déposer une demande
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD }} />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, lineHeight: 1.8, marginTop: 16, marginBottom: 0 }}>
              Décrivez le bien que vous recherchez. Les propriétaires et agences pourront vous contacter directement.
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 40px 80px', width: '100%', boxSizing: 'border-box' }}>

          {errors._global && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontFamily: "'Raleway', sans-serif", fontSize: 11, padding: '12px 16px', marginBottom: 28 }}>
              {errors._global}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Section: Type de bien */}
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 16 }}>
                TYPE DE BIEN <span style={{ color: GOLD }}>*</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {TYPE_BIEN_OPTIONS.map(o => (
                  <OptionButton
                    key={o.value}
                    label={o.label}
                    selected={form.type_bien === o.value}
                    onClick={() => pick('type_bien', o.value)}
                  />
                ))}
              </div>
              {errors.type_bien && (
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: '#dc2626', marginTop: 6 }}>{errors.type_bien}</div>
              )}
            </div>

            {/* Section: Type de transaction */}
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 16 }}>
                TYPE DE TRANSACTION <span style={{ color: GOLD }}>*</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {TYPE_TRANSACTION_OPTIONS.map(o => (
                  <OptionButton
                    key={o.value}
                    label={o.label}
                    selected={form.type_transaction === o.value}
                    onClick={() => pick('type_transaction', o.value)}
                  />
                ))}
              </div>
              {errors.type_transaction && (
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: '#dc2626', marginTop: 6 }}>{errors.type_transaction}</div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: BORDER }} />

            {/* Section: Localisation */}
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 16 }}>LOCALISATION</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Wilaya" required>
                  <select
                    value={form.wilaya}
                    onChange={set('wilaya')}
                    style={{
                      ...inputStyle,
                      borderColor: errors.wilaya ? '#dc2626' : BORDER,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8278' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      paddingRight: 32,
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderColor = errors.wilaya ? '#dc2626' : BORDER}
                  >
                    <option value="">Sélectionner…</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {errors.wilaya && (
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: '#dc2626', marginTop: 5 }}>{errors.wilaya}</div>
                  )}
                </Field>

                <Field label="Ville">
                  <input
                    type="text"
                    value={form.ville}
                    onChange={set('ville')}
                    placeholder="ex: Hydra"
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderColor = BORDER}
                  />
                </Field>
              </div>
            </div>

            {/* Section: Budget */}
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 16 }}>BUDGET (DA)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Prix minimum">
                  <input
                    type="number"
                    value={form.prix_min}
                    onChange={set('prix_min')}
                    placeholder="0"
                    min={0}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderColor = BORDER}
                  />
                </Field>

                <Field label="Prix maximum">
                  <input
                    type="number"
                    value={form.prix_max}
                    onChange={set('prix_max')}
                    placeholder="0"
                    min={0}
                    style={{ ...inputStyle, borderColor: errors.prix_max ? '#dc2626' : BORDER }}
                    onFocus={e => e.currentTarget.style.borderColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderColor = errors.prix_max ? '#dc2626' : BORDER}
                  />
                  {errors.prix_max && (
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: '#dc2626', marginTop: 5 }}>{errors.prix_max}</div>
                  )}
                </Field>
              </div>
            </div>

            {/* Section: Critères */}
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 16 }}>CRITÈRES</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Surface minimum (m²)">
                  <input
                    type="number"
                    value={form.superficie_min}
                    onChange={set('superficie_min')}
                    placeholder="ex: 80"
                    min={0}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderColor = BORDER}
                  />
                </Field>

                <Field label="Nombre de chambres min.">
                  <input
                    type="number"
                    value={form.nbr_chambres_min}
                    onChange={set('nbr_chambres_min')}
                    placeholder="ex: 2"
                    min={0}
                    max={20}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderColor = BORDER}
                  />
                </Field>
              </div>
            </div>

            {/* Section: Description */}
            <Field label="Description / précisions">
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Décrivez vos besoins, préférences, contraintes particulières…"
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: 1.7,
                  minHeight: 100,
                }}
                onFocus={e => e.currentTarget.style.borderColor = GOLD}
                onBlur={e => e.currentTarget.style.borderColor = BORDER}
              />
            </Field>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  background: submitting ? MUTED : GOLD,
                  border: 'none', color: BG,
                  fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                  padding: '14px 32px', cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                  flex: 1,
                }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {submitting ? 'PUBLICATION…' : 'PUBLIER LA DEMANDE'}
              </button>

              <button
                onClick={() => router.push('/demandes')}
                style={{
                  background: 'transparent',
                  border: `1px solid ${BORDER}`, color: MUTED,
                  fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                  padding: '14px 24px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = MUTED; e.currentTarget.style.color = TEXT }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}
              >
                ANNULER
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}