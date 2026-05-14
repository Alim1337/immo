import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const DARK   = '#12100E'
const BORDER = 'rgba(184,137,42,0.22)'
const ERR    = '#C0392B'

const Ico = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  user:     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  email:    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.82 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  lock:     'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  eye:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff:   'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  map:      'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  alert:    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  check:    'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
  building: 'M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4',
  arrow:    'M5 12h14M12 5l7 7-7 7',
  back:     'M19 12H5M12 5l-7 7 7 7',
  search:   'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  key:      'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  info:     'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8h.01M11 12h1v4h1',
}

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane',
]

const ROLES = [
  { value: 'CLIENT',       icon: ICONS.search,   emoji: '🔍', label: 'Client',       desc: 'Je cherche à louer ou acheter un bien', color: 'rgba(184,137,42,0.1)' },
  { value: 'PROPRIETAIRE', icon: ICONS.home,      emoji: '🏠', label: 'Propriétaire', desc: 'Je propose mes biens à la vente ou location', color: 'rgba(184,137,42,0.08)' },
  { value: 'AGENCE',       icon: ICONS.building,  emoji: '🏢', label: 'Agence',       desc: 'Je représente une agence immobilière', color: 'rgba(184,137,42,0.06)' },
]

// Password strength helper
function pwdStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: 'transparent' }
  let score = 0
  if (pwd.length >= 8)  score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: 'Trop faible', color: ERR }
  if (score <= 2) return { score, label: 'Faible',      color: '#E67E22' }
  if (score <= 3) return { score, label: 'Moyen',       color: GOLD }
  if (score <= 4) return { score, label: 'Fort',        color: '#27AE60' }
  return { score: 5, label: 'Très fort', color: '#1E8449' }
}

function InputField({ label, icon, hint, error: fieldError, children }) {
  return (
    <div style={{ marginBottom: fieldError ? 8 : 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT }}>{label.toUpperCase()}</div>
        {hint && <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: 'rgba(138,130,120,0.6)', letterSpacing: 0.3 }}>{hint}</div>}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 0, color: FAINT, display: 'flex', pointerEvents: 'none' }}>
            <Ico d={icon} size={14} />
          </span>
        )}
        {children}
      </div>
      {fieldError && (
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: ERR, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Ico d={ICONS.alert} size={11} />
          {fieldError}
        </div>
      )}
    </div>
  )
}

const iBase = (focused, hasIcon) => ({
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: `1px solid ${focused ? GOLD : BORDER}`,
  color: TEXT, fontFamily: "'Raleway', sans-serif",
  fontSize: 13, fontWeight: 300,
  padding: `10px 0 10px ${hasIcon ? '26px' : '0'}`,
  outline: 'none', transition: 'border-color 0.2s',
  appearance: 'none', WebkitAppearance: 'none',
})

export default function Inscription() {
  const router  = useRouter()
  const [step,    setStep]    = useState(1)
  const [role,    setRole]    = useState(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showCfm, setShowCfm] = useState(false)
  const [focused, setFocused] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const [form, setForm] = useState({
    nom: '', prenom: '', raison_sociale: '',
    email: '', telephone: '', mot_de_passe: '', confirm: '',
    date_naissance: '', sexe: '', ville: '', wilaya: '',
  })
  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    if (fieldErrors[k]) setFieldErrors(fe => ({ ...fe, [k]: '' }))
  }

  const pwd = pwdStrength(form.mot_de_passe)

  const validate = () => {
    const fe = {}
    if (role !== 'AGENCE') {
      if (!form.nom.trim())    fe.nom    = 'Nom requis'
    } else {
      if (!form.raison_sociale.trim()) fe.raison_sociale = 'Raison sociale requise'
    }
    if (!form.email.includes('@')) fe.email = 'Email invalide'
    if (!/^\d{9,10}$/.test(form.telephone.replace(/\s/g, ''))) fe.telephone = 'Numéro invalide (9-10 chiffres)'
    if (form.mot_de_passe.length < 8) fe.mot_de_passe = 'Minimum 8 caractères'
    if (form.mot_de_passe !== form.confirm) fe.confirm = 'Les mots de passe ne correspondent pas'
    setFieldErrors(fe)
    return Object.keys(fe).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || "Erreur lors de l'inscription.")
      localStorage.setItem('token', data.token)
      setSuccess(true)
      setTimeout(() => router.push('/panel'), 900)
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  const fo = (name) => focused === name
  const inp = (name, hasIcon = true) => ({ ...iBase(fo(name), hasIcon), paddingLeft: hasIcon ? 26 : 0 })

  return (
    <>
      <Head><title>Inscription — E-Krili</title></Head>

      <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Raleway', sans-serif" }}>

        {/* ── MINIMAL HEADER ── */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', borderBottom: `1px solid ${BORDER}`, background: BG, position: 'sticky', top: 0, zIndex: 10 }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: GOLD }}><Ico d={ICONS.home} size={18} /></div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 300, letterSpacing: 4, color: GOLD, lineHeight: 1 }}>E-KRILI</div>
              <div style={{ fontSize: 7, letterSpacing: 3, color: FAINT, marginTop: 1 }}>IMMOBILIER DE PRESTIGE</div>
            </div>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${s <= step ? GOLD : BORDER}`, background: s < step ? GOLD : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: s < step ? BG : s === step ? GOLD : FAINT, transition: 'all 0.3s' }}>
                  {s < step ? <Ico d={ICONS.check} size={12} /> : s}
                </div>
                {s < 2 && <div style={{ width: 32, height: 1, background: s < step ? GOLD : BORDER, transition: 'background 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>

          <button onClick={() => router.push('/login')}
            style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '8px 18px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}
          >SE CONNECTER</button>
        </div>

        <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>

          {/* ── LEFT decorative panel ── */}
          <div style={{ width: '36%', flexShrink: 0, position: 'relative', overflow: 'hidden', background: DARK, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '56px 44px' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=60"
                fill style={{ objectFit: 'cover', opacity: 0.25, filter: 'saturate(0.4)' }} alt="" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,16,14,0.7) 0%, rgba(18,16,14,0.95) 100%)' }} />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {step === 1 ? (
                <>
                  <div style={{ fontSize: 9, letterSpacing: 5, color: GOLD_L, marginBottom: 16 }}>BIENVENUE</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: '#F5F0E8', lineHeight: 1.15, margin: '0 0 20px' }}>
                    Rejoignez<br /><span style={{ fontStyle: 'italic', color: GOLD }}>l&apos;excellence</span><br />immobilière.
                  </h2>
                  <div style={{ width: 32, height: 1, background: GOLD, marginBottom: 18 }} />
                  <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(245,240,232,0.45)', lineHeight: 1.9, letterSpacing: 0.3, maxWidth: 260 }}>
                    Choisissez votre profil pour accéder à une expérience personnalisée.
                  </p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 9, letterSpacing: 5, color: GOLD_L, marginBottom: 16 }}>ÉTAPE 2 / 2</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: '#F5F0E8', lineHeight: 1.15, margin: '0 0 20px' }}>
                    {role === 'CLIENT' ? 'Votre profil\nclient' : role === 'PROPRIETAIRE' ? 'Votre espace\npropriétaire' : 'Votre agence'}
                  </h2>
                  <div style={{ width: 32, height: 1, background: GOLD, marginBottom: 18 }} />

                  {/* Tips */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { icon: ICONS.lock, text: 'Mot de passe : min. 8 caractères, maj., chiffre recommandé' },
                      { icon: ICONS.info, text: 'Vos données sont chiffrées et sécurisées' },
                      { icon: ICONS.check, text: 'Compte activé instantanément après inscription' },
                    ].map(({ icon, text }) => (
                      <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: GOLD_L, flexShrink: 0, marginTop: 1 }}><Ico d={icon} size={13} /></span>
                        <span style={{ fontSize: 11, color: 'rgba(245,240,232,0.45)', lineHeight: 1.6, fontWeight: 300 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: form ── */}
          <div style={{ flex: 1, padding: '48px 64px', background: BG2, borderLeft: `1px solid ${BORDER}`, overflowY: 'auto' }}>

            {/* STEP 1 — Role picker */}
            {step === 1 && (
              <div style={{ maxWidth: 460 }}>
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 10 }}>CRÉER UN COMPTE</div>
                  <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: TEXT, margin: 0 }}>Vous êtes…</h1>
                  <div style={{ width: 32, height: 1, background: GOLD, marginTop: 12 }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ROLES.map(r => (
                    <button key={r.value} onClick={() => { setRole(r.value); setStep(2) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'transparent', border: `1px solid ${BORDER}`, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.22s', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(184,137,42,0.05)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none' }}
                    >
                      <div style={{ width: 44, height: 44, flexShrink: 0, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, transition: 'border-color 0.2s' }}>
                        <Ico d={r.icon} size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 3, color: TEXT, marginBottom: 4 }}>{r.label.toUpperCase()}</div>
                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, fontWeight: 300 }}>{r.desc}</div>
                      </div>
                      <span style={{ color: GOLD, opacity: 0.6 }}><Ico d="M9 18l6-6-6-6" size={16} /></span>
                    </button>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <span style={{ fontSize: 12, color: FAINT }}>Déjà un compte ? </span>
                  <span onClick={() => router.push('/login')} style={{ fontSize: 12, color: GOLD, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD_L}
                    onMouseLeave={e => e.currentTarget.style.color = GOLD}>
                    Se connecter
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2 — Form */}
            {step === 2 && (
              <div style={{ maxWidth: 560 }}>
                <button onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: MUTED, padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >
                  <Ico d={ICONS.back} size={12} /> CHANGER DE RÔLE
                </button>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, border: `1px solid rgba(184,137,42,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
                      <Ico d={ROLES.find(r => r.value === role)?.icon} size={14} />
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD }}>{ROLES.find(r => r.value === role)?.label.toUpperCase()}</div>
                  </div>
                  <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: TEXT, margin: 0 }}>Vos informations</h1>
                  <div style={{ width: 32, height: 1, background: GOLD, marginTop: 12 }} />
                </div>

                {/* Global error */}
                {error && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(192,57,43,0.07)', border: `1px solid rgba(192,57,43,0.25)`, borderLeft: `3px solid ${ERR}`, padding: '12px 14px', marginBottom: 24 }}>
                    <span style={{ color: ERR, flexShrink: 0 }}><Ico d={ICONS.alert} size={14} /></span>
                    <span style={{ fontSize: 12, color: ERR, lineHeight: 1.6 }}>{error}</span>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.25)', borderLeft: '3px solid #16a34a', padding: '12px 14px', marginBottom: 24 }}>
                    <span style={{ color: '#16a34a' }}><Ico d={ICONS.check} size={14} /></span>
                    <span style={{ fontSize: 12, color: '#16a34a' }}>Compte créé ! Redirection…</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Name fields */}
                  {role === 'AGENCE' ? (
                    <InputField label="Raison sociale *" icon={ICONS.building} error={fieldErrors.raison_sociale}>
                      <input value={form.raison_sociale} onChange={set('raison_sociale')} required placeholder="Nom de votre agence"
                        onFocus={() => setFocused('raison')} onBlur={() => setFocused(null)} style={inp('raison')} />
                    </InputField>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                      <InputField label="Nom *" icon={ICONS.user} error={fieldErrors.nom}>
                        <input value={form.nom} onChange={set('nom')} required placeholder="Votre nom"
                          onFocus={() => setFocused('nom')} onBlur={() => setFocused(null)} style={inp('nom')} />
                      </InputField>
                      <InputField label="Prénom" icon={ICONS.user} error={fieldErrors.prenom}>
                        <input value={form.prenom} onChange={set('prenom')} placeholder="Votre prénom"
                          onFocus={() => setFocused('prenom')} onBlur={() => setFocused(null)} style={inp('prenom')} />
                      </InputField>
                    </div>
                  )}

                  {/* Email & Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                    <InputField label="Email *" icon={ICONS.email} error={fieldErrors.email}>
                      <input type="email" value={form.email} onChange={set('email')} required placeholder="vous@email.com"
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} style={inp('email')} />
                    </InputField>
                    <InputField label="Téléphone *" icon={ICONS.phone} hint="Ex: 0555123456" error={fieldErrors.telephone}>
                      <input type="tel" value={form.telephone} onChange={set('telephone')} required placeholder="0555 123 456"
                        onFocus={() => setFocused('tel')} onBlur={() => setFocused(null)} style={inp('tel')} />
                    </InputField>
                  </div>

                  {/* DOB & Gender (not for agency) */}
                  {role !== 'AGENCE' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                      <InputField label="Date de naissance" icon={ICONS.calendar}>
                        <input type="date" value={form.date_naissance} onChange={set('date_naissance')}
                          onFocus={() => setFocused('dob')} onBlur={() => setFocused(null)}
                          style={{ ...inp('dob'), colorScheme: 'light' }} />
                      </InputField>
                      <InputField label="Sexe">
                        <select value={form.sexe} onChange={set('sexe')}
                          onFocus={() => setFocused('sexe')} onBlur={() => setFocused(null)}
                          style={{ ...iBase(fo('sexe'), false) }}>
                          <option value="">—</option>
                          <option value="homme">Homme</option>
                          <option value="femme">Femme</option>
                        </select>
                      </InputField>
                    </div>
                  )}

                  {/* City & Wilaya */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                    <InputField label="Ville" icon={ICONS.map}>
                      <input value={form.ville} onChange={set('ville')} placeholder="Ex: Hydra"
                        onFocus={() => setFocused('ville')} onBlur={() => setFocused(null)} style={inp('ville')} />
                    </InputField>
                    <InputField label="Wilaya" icon={ICONS.map}>
                      <select value={form.wilaya} onChange={set('wilaya')}
                        onFocus={() => setFocused('wilaya')} onBlur={() => setFocused(null)}
                        style={{ ...iBase(fo('wilaya'), true) }}>
                        <option value="">—</option>
                        {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </InputField>
                  </div>

                  {/* Password */}
                  <InputField label="Mot de passe *" icon={ICONS.lock} hint="Min. 8 caractères" error={fieldErrors.mot_de_passe}>
                    <input type={showPwd ? 'text' : 'password'} value={form.mot_de_passe} onChange={set('mot_de_passe')} required placeholder="••••••••"
                      onFocus={() => setFocused('pwd')} onBlur={() => setFocused(null)}
                      style={{ ...inp('pwd'), paddingRight: 32 }} />
                    <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                      style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 0 }}>
                      <Ico d={showPwd ? ICONS.eyeOff : ICONS.eye} size={14} />
                    </button>
                  </InputField>

                  {/* Password strength bar */}
                  {form.mot_de_passe && (
                    <div style={{ marginTop: -16, marginBottom: 24 }}>
                      <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                        {[1,2,3,4,5].map(i => (
                          <div key={i} style={{ flex: 1, height: 2, background: i <= pwd.score ? pwd.color : BORDER, transition: 'background 0.3s', borderRadius: 1 }} />
                        ))}
                      </div>
                      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: pwd.color, letterSpacing: 1 }}>{pwd.label}</div>
                    </div>
                  )}

                  {/* Confirm password */}
                  <InputField label="Confirmer le mot de passe *" icon={ICONS.lock} error={fieldErrors.confirm}>
                    <input type={showCfm ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} required placeholder="••••••••"
                      onFocus={() => setFocused('cfm')} onBlur={() => setFocused(null)}
                      style={{ ...inp('cfm'), paddingRight: 32 }} />
                    <button type="button" onClick={() => setShowCfm(v => !v)} tabIndex={-1}
                      style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 0 }}>
                      <Ico d={showCfm ? ICONS.eyeOff : ICONS.eye} size={14} />
                    </button>
                  </InputField>

                  {/* Match indicator */}
                  {form.confirm && (
                    <div style={{ marginTop: -16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Raleway', sans-serif", fontSize: 10, color: form.mot_de_passe === form.confirm ? '#27AE60' : ERR }}>
                      <Ico d={form.mot_de_passe === form.confirm ? ICONS.check : ICONS.alert} size={11} />
                      {form.mot_de_passe === form.confirm ? 'Les mots de passe correspondent' : 'Ne correspondent pas'}
                    </div>
                  )}

                  {/* Divider */}
                  <div style={{ height: 1, background: `linear-gradient(to right, rgba(184,137,42,0.3), transparent)`, margin: '8px 0 28px' }} />

                  {/* Submit */}
                  <button type="submit" disabled={loading || success}
                    style={{ width: '100%', background: loading || success ? FAINT : GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 4, padding: '15px 0', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                    onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.background = '#9A7020' }}
                    onMouseLeave={e => { if (!loading && !success) e.currentTarget.style.background = loading || success ? FAINT : GOLD }}
                  >
                    {loading ? "CRÉATION DU COMPTE…" : (<>{"S'INSCRIRE"} <Ico d={ICONS.arrow} size={14} /></>)}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <span style={{ fontSize: 11, color: FAINT }}>Déjà un compte ? </span>
                    <span onClick={() => router.push('/login')} style={{ fontSize: 11, color: GOLD, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.color = GOLD_L}
                      onMouseLeave={e => e.currentTarget.style.color = GOLD}>
                      Se connecter
                    </span>
                  </div>

                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}