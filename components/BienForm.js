// components/BienForm.js
// Reusable form used by pages/biens/nouveau.js AND pages/biens/[id]/modifier.js
// Props:
//   initialData  — object with existing values (for edit mode), null for create
//   onSubmit(formData, images) — called with form values + base64 images array
//   loading      — bool, disables submit button
//   error        — string, shown as error banner
//   submitLabel  — string, button label (default "PUBLIER")

import React, { useState } from 'react'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'
const RED    = '#C0392B'

const TYPES        = ['APPARTEMENT','VILLA','MAISON','BUREAU','LOCAL_COMMERCIAL','TERRAIN','STUDIO']
const TRANSACTIONS = ['LOCATION','VENTE','LOCATION_VACANCES']
const ETATS        = ['DISPONIBLE','RESERVE','LOUE','VENDU','SUSPENDU']
const WILAYAS      = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane',
]
const EQUIPEMENTS = [
  'WiFi','Parking','Piscine','Ascenseur','Sécurité','Climatisation',
  'Chauffage','Balcon','Terrasse','Jardin','Cave','Garage',
]

// ── Reusable sub-components ─────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, marginTop: 8 }}>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 4, color: GOLD_L, whiteSpace: 'nowrap' }}>
        {children}
      </div>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: 'block', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 8 }}>
        {label.toUpperCase()}{required && <span style={{ color: GOLD }}> *</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder, required, min }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} required={required} min={min}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        display: 'block', width: '100%', boxSizing: 'border-box',
        background: focused ? BG : 'rgba(237,233,225,0.5)',
        border: `1px solid ${focused ? GOLD : BORDER}`,
        padding: '11px 14px',
        fontFamily: "'Raleway', sans-serif", fontSize: 12, color: TEXT,
        outline: 'none', transition: 'all 0.2s',
      }}
    />
  )
}

function Select({ value, onChange, required, children }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={value} onChange={onChange} required={required}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        display: 'block', width: '100%', boxSizing: 'border-box',
        background: focused ? BG : 'rgba(237,233,225,0.5)',
        border: `1px solid ${focused ? GOLD : BORDER}`,
        padding: '11px 14px',
        fontFamily: "'Raleway', sans-serif", fontSize: 12, color: TEXT,
        outline: 'none', transition: 'all 0.2s',
        appearance: 'none', cursor: 'pointer',
      }}
    >
      {children}
    </select>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function BienForm({
  initialData  = null,
  onSubmit,
  loading      = false,
  error        = '',
  submitLabel  = 'PUBLIER LE BIEN',
  onCancel,
}) {
  const isEdit = !!initialData

  const [form, setForm] = useState({
    titre:            initialData?.titre            || '',
    description:      initialData?.description      || '',
    type_bien:        initialData?.type_bien        || '',
    type_transaction: initialData?.type_transaction || '',
    adresse:          initialData?.adresse          || '',
    ville:            initialData?.ville            || '',
    wilaya:           initialData?.wilaya           || '',
    code_postal:      initialData?.code_postal      || '',
    superficie:       initialData?.superficie       || '',
    nbr_chambres:     initialData?.nbr_chambres     || '',
    nbr_salles_bain:  initialData?.nbr_salles_bain  || '',
    nbr_etages:       initialData?.nbr_etages       || '',
    prix:             initialData?.prix             || '',
    etat:             initialData?.etat             || 'DISPONIBLE',
    est_meuble:       initialData?.est_meuble       || false,
    equipements:      initialData?.equipements      || [],
  })

  const [images,   setImages]   = useState(initialData?.images || [])
  const [formErr,  setFormErr]  = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleEq = eq => setForm(f => ({
    ...f,
    equipements: f.equipements.includes(eq)
      ? f.equipements.filter(e => e !== eq)
      : [...f.equipements, eq],
  }))

  const handleImageChange = e => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setFormErr('')
    if (!form.titre)            return setFormErr('Le titre est obligatoire.')
    if (!form.type_bien)        return setFormErr('Le type de bien est obligatoire.')
    if (!form.type_transaction) return setFormErr('Le type de transaction est obligatoire.')
    if (!form.ville)            return setFormErr('La ville est obligatoire.')
    if (!form.wilaya)           return setFormErr('La wilaya est obligatoire.')
    if (!form.prix)             return setFormErr('Le prix est obligatoire.')
    onSubmit?.(form, images)
  }

  const displayError = formErr || error

  return (
    <form onSubmit={handleSubmit}>

      {displayError && (
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: RED, borderLeft: `2px solid ${RED}`, paddingLeft: 12, marginBottom: 28 }}>
          {displayError}
        </div>
      )}

      {/* ── Informations générales ── */}
      <SectionLabel>INFORMATIONS GÉNÉRALES</SectionLabel>

      <Field label="Titre de l'annonce" required>
        <Input value={form.titre} onChange={set('titre')} placeholder="Ex. : Villa moderne avec piscine à Hydra" required />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Field label="Type de bien" required>
          <Select value={form.type_bien} onChange={set('type_bien')} required>
            <option value="">Sélectionner…</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Type de transaction" required>
          <Select value={form.type_transaction} onChange={set('type_transaction')} required>
            <option value="">Sélectionner…</option>
            {TRANSACTIONS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={4}
          placeholder="Décrivez votre bien en détail…"
          style={{
            display: 'block', width: '100%', boxSizing: 'border-box',
            background: 'rgba(237,233,225,0.5)', border: `1px solid ${BORDER}`,
            padding: '11px 14px', fontFamily: "'Raleway', sans-serif",
            fontSize: 12, color: TEXT, outline: 'none', resize: 'vertical', lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
      </Field>

      {/* ── Localisation ── */}
      <SectionLabel>LOCALISATION</SectionLabel>

      <Field label="Adresse">
        <Input value={form.adresse} onChange={set('adresse')} placeholder="Numéro, rue, quartier" />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Field label="Ville" required>
          <Input value={form.ville} onChange={set('ville')} required />
        </Field>
        <Field label="Wilaya" required>
          <Select value={form.wilaya} onChange={set('wilaya')} required>
            <option value="">Sélectionner…</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Code postal">
        <Input value={form.code_postal} onChange={set('code_postal')} />
      </Field>

      {/* ── Détails ── */}
      <SectionLabel>DÉTAILS DU BIEN</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Field label="Prix (DZD)" required>
          <Input type="number" value={form.prix} onChange={set('prix')} placeholder="0" required min="0" />
        </Field>
        <Field label="Superficie (m²)">
          <Input type="number" value={form.superficie} onChange={set('superficie')} min="0" />
        </Field>
        <Field label="Nombre de chambres">
          <Input type="number" value={form.nbr_chambres} onChange={set('nbr_chambres')} min="0" />
        </Field>
        <Field label="Salles de bain">
          <Input type="number" value={form.nbr_salles_bain} onChange={set('nbr_salles_bain')} min="0" />
        </Field>
        <Field label="Nombre d'étages">
          <Input type="number" value={form.nbr_etages} onChange={set('nbr_etages')} min="0" />
        </Field>
        <Field label="État">
          <Select value={form.etat} onChange={set('etat')}>
            {ETATS.map(e => <option key={e} value={e}>{e}</option>)}
          </Select>
        </Field>
      </div>

      {/* Meublé toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button type="button" onClick={() => setForm(f => ({ ...f, est_meuble: !f.est_meuble }))}
          style={{ width: 44, height: 24, borderRadius: 12, background: form.est_meuble ? GOLD : BORDER, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <span style={{ position: 'absolute', top: 2, left: form.est_meuble ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </button>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: MUTED }}>Bien meublé</span>
      </div>

      {/* Équipements */}
      <Field label="Équipements">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EQUIPEMENTS.map(eq => (
            <button key={eq} type="button" onClick={() => toggleEq(eq)}
              style={{
                background: form.equipements.includes(eq) ? GOLD : 'transparent',
                border: `1px solid ${form.equipements.includes(eq) ? GOLD : BORDER}`,
                color: form.equipements.includes(eq) ? BG : MUTED,
                fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 1,
                padding: '7px 14px', cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {eq}
            </button>
          ))}
        </div>
      </Field>

      {/* ── Photos ── */}
      <SectionLabel>PHOTOS</SectionLabel>

      <label
        style={{ display: 'block', border: `1px dashed ${BORDER}`, padding: '32px', textAlign: 'center', cursor: 'pointer', marginBottom: 16, transition: 'border-color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
      >
        <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: TEXT, marginBottom: 6 }}>
          {images.length > 0 ? `${images.length} photo(s) sélectionnée(s)` : 'Cliquez ou déposez vos photos ici'}
        </div>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT }}>
          JPG, PNG — plusieurs fichiers acceptés
        </div>
      </label>

      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6, marginBottom: 28 }}>
          {images.map((src, i) => (
            <div key={i} style={{ position: 'relative', height: 90, overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === 0 && (
                <div style={{ position: 'absolute', top: 4, left: 4, fontFamily: "'Raleway', sans-serif", fontSize: 7, letterSpacing: 2, color: BG, background: GOLD, padding: '2px 6px' }}>
                  PRINCIPALE
                </div>
              )}
              <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(20,15,10,0.7)', border: 'none', color: '#fff', width: 20, height: 20, cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 12, paddingTop: 28, borderTop: `1px solid ${BORDER}`, marginTop: 8 }}>
        <button type="submit" disabled={loading}
          style={{
            flex: 2, background: GOLD, border: 'none', color: BG,
            fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
            padding: '14px 0', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => e.currentTarget.style.opacity = loading ? '0.6' : '1'}
        >
          {loading ? 'ENREGISTREMENT…' : submitLabel}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel}
            style={{
              flex: 1, background: 'transparent', border: `1px solid ${BORDER}`,
              color: MUTED, fontFamily: "'Raleway', sans-serif",
              fontSize: 10, letterSpacing: 3, padding: '14px 0',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}
          >
            ANNULER
          </button>
        )}
      </div>
    </form>
  )
}