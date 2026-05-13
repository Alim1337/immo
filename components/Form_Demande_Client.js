import React, { useState } from 'react'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BORDER = 'rgba(184,137,42,0.22)'

const labelStyle = {
  display: 'block',
  fontFamily: "'Raleway', sans-serif",
  fontSize: 9,
  letterSpacing: 4,
  color: GOLD,
  marginBottom: 10,
  textTransform: 'uppercase',
}

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: `1px solid rgba(184,137,42,0.28)`,
  color: TEXT,
  fontFamily: "'Raleway', sans-serif",
  fontSize: 14,
  fontWeight: 300,
  padding: '10px 0',
  outline: 'none',
  transition: 'border-color 0.3s',
  appearance: 'none',
  WebkitAppearance: 'none',
  marginBottom: 36,
}

const CHAMBRES = ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12']

function FieldGroup({ children, half }) {
  return (
    <div style={{ display: half ? 'grid' : 'block', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
      {children}
    </div>
  )
}

const Form_Demande_Client = ({ onSubmit, submitting }) => {
  const [type_bien,             setTypeBien]             = useState('')
  const [prix_minimum,          setPrixMinimum]           = useState('')
  const [prix_maximum,          setPrixMaximum]           = useState('')
  const [surface_minimum,       setSurfaceMinimum]        = useState('')
  const [nbr_chambre_minimum,   setNbrChambreMinimum]     = useState('')
  const [date_debut_rechercher, setDateDebutRechercher]   = useState(new Date().toISOString().slice(0, 10))

  // Track focused field for gold underline effect
  const [focused, setFocused] = useState(null)

  const getFocusStyle = (name) => ({
    ...inputStyle,
    borderBottomColor: focused === name ? GOLD : 'rgba(184,137,42,0.28)',
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(type_bien, prix_minimum, prix_maximum, surface_minimum, nbr_chambre_minimum, date_debut_rechercher)
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Type de bien */}
      <div>
        <label style={labelStyle}>Type de bien</label>
        <select
          value={type_bien}
          onChange={e => setTypeBien(e.target.value)}
          required
          onFocus={() => setFocused('type')}
          onBlur={() => setFocused(null)}
          style={{ ...getFocusStyle('type'), color: type_bien ? TEXT : FAINT }}
        >
          <option value="" disabled style={{ color: FAINT }}>Sélectionner un type</option>
          <option value="appartement" style={{ background: BG, color: TEXT }}>Appartement</option>
          <option value="villa"       style={{ background: BG, color: TEXT }}>Villa</option>
          <option value="autre"       style={{ background: BG, color: TEXT }}>Autre</option>
        </select>
      </div>

      {/* Prix min / max */}
      <FieldGroup half>
        <div>
          <label style={labelStyle}>Prix minimum (DA)</label>
          <input
            type="number"
            placeholder="Ex: 5 000 000"
            value={prix_minimum}
            onChange={e => setPrixMinimum(e.target.value)}
            onFocus={() => setFocused('pmin')}
            onBlur={() => setFocused(null)}
            style={{ ...getFocusStyle('pmin'), '::placeholder': { color: FAINT } }}
          />
        </div>
        <div>
          <label style={labelStyle}>Prix maximum (DA)</label>
          <input
            type="number"
            placeholder="Ex: 50 000 000"
            value={prix_maximum}
            onChange={e => setPrixMaximum(e.target.value)}
            required
            onFocus={() => setFocused('pmax')}
            onBlur={() => setFocused(null)}
            style={getFocusStyle('pmax')}
          />
        </div>
      </FieldGroup>

      {/* Surface / Chambres */}
      <FieldGroup half>
        <div>
          <label style={labelStyle}>Surface minimum (m²) <span style={{ color: FAINT, fontSize: 8, letterSpacing: 1 }}>— optionnel</span></label>
          <input
            type="number"
            placeholder="Ex: 80"
            value={surface_minimum}
            onChange={e => setSurfaceMinimum(e.target.value)}
            onFocus={() => setFocused('surf')}
            onBlur={() => setFocused(null)}
            style={getFocusStyle('surf')}
          />
        </div>
        <div>
          <label style={labelStyle}>Chambres minimum</label>
          <select
            value={nbr_chambre_minimum}
            onChange={e => setNbrChambreMinimum(e.target.value)}
            required
            onFocus={() => setFocused('chambre')}
            onBlur={() => setFocused(null)}
            style={{ ...getFocusStyle('chambre'), color: nbr_chambre_minimum ? TEXT : FAINT }}
          >
            <option value="" disabled style={{ color: FAINT }}>Sélectionner</option>
            {CHAMBRES.map(c => (
              <option key={c} value={c} style={{ background: BG, color: TEXT }}>{c}</option>
            ))}
          </select>
        </div>
      </FieldGroup>

      {/* Date début */}
      <div style={{ maxWidth: 280 }}>
        <label style={labelStyle}>Date de début de recherche</label>
        <input
          type="date"
          value={date_debut_rechercher}
          onChange={e => setDateDebutRechercher(e.target.value)}
          required
          onFocus={() => setFocused('date')}
          onBlur={() => setFocused(null)}
          style={{ ...getFocusStyle('date'), colorScheme: 'light' }}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(to right, rgba(184,137,42,0.3), transparent)`, margin: '4px 0 32px' }} />

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? FAINT : GOLD,
          border: 'none',
          color: '#EDE9E1',
          fontFamily: "'Raleway', sans-serif",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: 4,
          padding: '15px 56px',
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          opacity: submitting ? 0.7 : 1,
        }}
        onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#9A7020' }}
        onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = GOLD }}
      >
        {submitting ? 'ENVOI EN COURS...' : 'SOUMETTRE MA DEMANDE'}
      </button>

    </form>
  )
}

export default Form_Demande_Client