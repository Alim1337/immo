import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const adresseOptions = [
  'Aïn Benian','Aïn Taya','Alger-Centre','Baba Hassen','Bab El Oued','Bab Ezzouar',
  'Bachdjerrah','Baraki','Belouizdad','Ben Aknoun','Beni Messous',
  'Birkhadem','Bir Mourad Raïs','Birtouta','Bologhine',
  'Bordj El Bahri','Bordj El Kiffan','Bourouba','Bouzareah','Casbah',
  'Chéraga','Dar El Beïda','Dely Ibrahim',
  'Djasr Kasentina','Douera','Draria',
  'El Achour','El Biar','El Hammamet','El Harrach','El Madania',
  'El Marsa','El Mouradia','El Magharia','Hraoua','Hussein-Dey','Hydra',
  'Khraïssia','Kouba','Les Eucalyptus','Mahelma','Mohammadia','Oued Koriche',
  'Oued Smar','Ouled Chebel','Ouled Fayet',
  'Rahmania','Raïs Hamidou','Réghaïa','Rouïba','Saoula',
  'Sidi MHamed','Sidi Moussa','Souidania','Staoueli','Tessala El Merdja','Zéralda',
]

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{
        display: 'block',
        fontFamily: "'Raleway', sans-serif",
        fontSize: 9, letterSpacing: 4,
        color: GOLD, marginBottom: 10,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function StyledInput({ value, onChange, placeholder, type = 'text', required }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: 'block', width: '100%', boxSizing: 'border-box',
        background: focused ? BG : 'rgba(237,233,225,0.5)',
        border: `1px solid ${focused ? GOLD : BORDER}`,
        padding: '11px 14px',
        fontFamily: "'Raleway', sans-serif", fontSize: 11,
        color: TEXT, outline: 'none', transition: 'all 0.2s',
        letterSpacing: 0.3,
      }}
    />
  )
}

function StyledSelect({ value, onChange, required, children }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: 'block', width: '100%', boxSizing: 'border-box',
        backgroundColor: focused ? BG : 'rgba(237,233,225,0.5)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8278' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        border: `1px solid ${focused ? GOLD : BORDER}`,
        padding: '11px 14px',
        fontFamily: "'Raleway', sans-serif", fontSize: 11,
        color: value ? TEXT : FAINT,
        outline: 'none', transition: 'all 0.2s',
        appearance: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </select>
  )
}

function ActionBtn({ children, onClick, type = 'button', primary, disabled }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        padding: '13px 0',
        background: primary
          ? (disabled ? MUTED : hover ? '#9A7020' : GOLD)
          : (hover ? BG : 'transparent'),
        border: primary ? 'none' : `1px solid ${hover ? MUTED : BORDER}`,
        color: primary ? BG : MUTED,
        fontFamily: "'Raleway', sans-serif",
        fontSize: 9, letterSpacing: 3,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, marginTop: 8 }}>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 4, color: GOLD_L, whiteSpace: 'nowrap' }}>
        {children}
      </div>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  )
}

export default function BienForm() {
  const [description,     setDescription]    = useState('')
  const [typeBien,        setTypeBien]        = useState('')
  const [ville,           setVille]           = useState('Alger')
  const [nbrChambre,      setNbrChambre]      = useState('')
  const [selectedAddress, setSelectedAddress] = useState('')
  const [codePostal,      setCodePostal]      = useState('')
  const [minPrixEstime,   setMinPrixEstime]   = useState('')
  const [etat,            setEtat]            = useState('')
  const [image,           setImage]           = useState(null)
  const [loading,         setLoading]         = useState(false)

  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Session expirée, veuillez vous reconnecter.', { position: 'top-center' })
        router.push('/login_client')
        return
      }

      const res = await fetch('/api/addBien', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          type_bien: typeBien,
          nbr_chambre: nbrChambre,
          adresse: selectedAddress,
          ville,
          code_postal: codePostal,
          prix_estime: minPrixEstime,
          etat,
        }),
      })

      if (res.ok) {
        toast.success('Bien ajouté avec succès !', { position: 'top-center' })
        setTimeout(() => router.push('/clientHouses'), 1200)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Une erreur est survenue.', { position: 'top-center' })
      }
    } catch (err) {
      toast.error('Erreur réseau, veuillez réessayer.', { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  function handleCancel(e) {
    e.preventDefault()
    if (window.confirm('Voulez-vous vraiment annuler ?')) router.push('/clientHouses')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const obj = { name: `image_${Date.now()}`, data: ev.target.result }
      setImage(obj)
      localStorage.setItem('selectedImage', JSON.stringify(obj))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '56px 24px 72px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* Page header */}
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>
              ESPACE CLIENT
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1 }}>
              Ajouter un bien
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 14 }} />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, marginTop: 14, fontWeight: 300, letterSpacing: 0.3 }}>
              Renseignez les informations de votre propriété pour publier votre annonce.
            </p>
          </div>

          {/* Form card */}
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '40px 44px' }}>
            <form onSubmit={handleSubmit}>

              <SectionLabel>INFORMATIONS GÉNÉRALES</SectionLabel>

              <FormField label="TITRE DE L'ANNONCE">
                <StyledInput
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex. : Villa moderne avec piscine à Hydra"
                  required
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FormField label="TYPE DE BIEN">
                  <StyledSelect value={typeBien} onChange={e => setTypeBien(e.target.value)} required>
                    <option value="">Sélectionner</option>
                    <option value="appartement">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="autre">Autre</option>
                  </StyledSelect>
                </FormField>

                <FormField label="NOMBRE DE CHAMBRES">
                  <StyledSelect value={nbrChambre} onChange={e => setNbrChambre(e.target.value)}>
                    <option value="">Sélectionner</option>
                    {['F3','F4','F5','F6','F7','F8','F9','F10'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </StyledSelect>
                </FormField>
              </div>

              <SectionLabel>LOCALISATION</SectionLabel>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FormField label="WILAYA">
                  <StyledSelect value={ville} onChange={e => setVille(e.target.value)} required>
                    <option value="Alger">Alger</option>
                  </StyledSelect>
                </FormField>

                <FormField label="COMMUNE / ADRESSE">
                  <StyledSelect value={selectedAddress} onChange={e => setSelectedAddress(e.target.value)} required>
                    <option value="">Sélectionner</option>
                    {adresseOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </StyledSelect>
                </FormField>
              </div>

              <SectionLabel>DÉTAILS DU BIEN</SectionLabel>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FormField label="PRIX MENSUEL ESTIMÉ (DA)">
                  <StyledInput
                    value={minPrixEstime}
                    onChange={e => setMinPrixEstime(e.target.value)}
                    placeholder="Ex. : 80 000"
                    required
                  />
                </FormField>

                <FormField label="ÉTAT DU BIEN">
                  <StyledSelect value={etat} onChange={e => setEtat(e.target.value)} required>
                    <option value="">Sélectionner</option>
                    <option value="neuf">Neuf</option>
                    <option value="bonne_condition">Bonne condition</option>
                    <option value="rénové">Rénové</option>
                    <option value="à_rénover">À rénover</option>
                    <option value="partiellement_rénové">Partiellement rénové</option>
                    <option value="en_construction">En construction</option>
                  </StyledSelect>
                </FormField>
              </div>

              <SectionLabel>PHOTO PRINCIPALE</SectionLabel>

              <FormField label="AJOUTER UNE IMAGE">
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  border: `1px dashed ${BORDER}`,
                  padding: '16px 18px', cursor: 'pointer',
                  background: 'rgba(237,233,225,0.4)',
                  fontFamily: "'Raleway', sans-serif", fontSize: 10,
                  color: image ? GOLD : FAINT, letterSpacing: 1,
                }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={image ? GOLD : FAINT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  {image ? image.name : 'Cliquez pour sélectionner une image'}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </FormField>

              <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
                <ActionBtn type="submit" primary disabled={loading}>
                  {loading ? 'ENVOI...' : 'CONFIRMER'}
                </ActionBtn>
                <ActionBtn onClick={handleCancel}>ANNULER</ActionBtn>
              </div>

            </form>
          </div>

          {/* Bottom bar */}
          <div style={{ marginTop: 48, paddingTop: 20, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT }}>
              © {new Date().getFullYear()} E-KRILI — IMMOBILIER DE PRESTIGE
            </span>
            <span
              onClick={() => router.push('/clientHouses')}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = FAINT}
            >
              ← RETOUR AU TABLEAU DE BORD
            </span>
          </div>

        </div>
      </main>

      <ToastContainer toastStyle={{ background: BG2, color: TEXT, border: `1px solid ${BORDER}` }} />
    </div>
  )
}