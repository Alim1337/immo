import React, { useState, useEffect } from 'react'
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
  { value: 'CLIENT',       icon: ICONS.search,   label: 'Client',       desc: 'Je cherche à louer ou acheter' },
  { value: 'PROPRIETAIRE', icon: ICONS.home,      label: 'Propriétaire', desc: 'Je propose mes biens' },
  { value: 'AGENCE',       icon: ICONS.building,  label: 'Agence',       desc: 'Je représente une agence' },
]

function pwdStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: 'transparent' }
  let s = 0
  if (pwd.length >= 8)           s++
  if (pwd.length >= 12)          s++
  if (/[A-Z]/.test(pwd))         s++
  if (/[0-9]/.test(pwd))         s++
  if (/[^A-Za-z0-9]/.test(pwd))  s++
  const map = [[1,'Trop faible',ERR],[2,'Faible','#E67E22'],[3,'Moyen',GOLD],[4,'Fort','#27AE60'],[5,'Très fort','#1E8449']]
  const found = map.find(([min]) => s <= min) || map[4]
  return { score: s, label: found[1], color: found[2] }
}

// ── Shared input style — defined outside component so it's a stable reference
function iSt(name, focused, fe, mobile, hasIcon = true) {
  return {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${focused === name ? GOLD : fe[name] ? ERR : BORDER}`,
    color: TEXT, fontFamily: "'Raleway', sans-serif",
    fontSize: mobile ? 15 : 13, fontWeight: 300,
    padding: `12px ${hasIcon ? '32px' : '0'} 12px ${hasIcon ? '26px' : '0'}`,
    outline: 'none', transition: 'border-color 0.2s',
    appearance: 'none', WebkitAppearance: 'none',
  }
}

// ── Field wrapper — defined outside component to keep a stable identity
const Field = ({ label, icon, hint, name, focused, fe, children }) => (
  <div style={{ marginBottom: fe[name] ? 4 : 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: fe[name] ? ERR : FAINT }}>
        {label}
      </div>
      {hint && (
        <div style={{ fontSize: 9, color: 'rgba(138,130,120,0.55)', letterSpacing: 0.2 }}>{hint}</div>
      )}
    </div>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon && (
        <span style={{
          position: 'absolute', left: 0,
          color: focused === name ? GOLD : fe[name] ? ERR : FAINT,
          display: 'flex', transition: 'color 0.2s', pointerEvents: 'none',
        }}>
          <Ico d={icon} size={14} />
        </span>
      )}
      {children}
    </div>
    {fe[name] && (
      <div style={{ fontSize: 10, color: ERR, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Ico d={ICONS.alert} size={10} />{fe[name]}
      </div>
    )}
  </div>
)

// ── Two-column grid — defined outside component
const Grid2 = ({ children, mobile }) => (
  <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 0 : '0 28px' }}>
    {children}
  </div>
)

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
  const [fe,      setFe]      = useState({})
  const [mobile,  setMobile]  = useState(false)

  const [form, setForm] = useState({
    nom: '', prenom: '', raison_sociale: '',
    email: '', telephone: '', mot_de_passe: '', confirm: '',
    date_naissance: '', sexe: '', ville: '', wilaya: '',
  })

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    if (fe[k]) setFe(p => ({ ...p, [k]: '' }))
  }

  const pwd = pwdStrength(form.mot_de_passe)

  const validate = () => {
    const errors = {}
    if (role !== 'AGENCE' && !form.nom.trim()) errors.nom = 'Nom requis'
    if (role === 'AGENCE' && !form.raison_sociale.trim()) errors.raison_sociale = 'Raison sociale requise'
    if (!form.email.includes('@')) errors.email = 'Email invalide'
    if (!/^\d{9,10}$/.test(form.telephone.replace(/\s/g, ''))) errors.telephone = 'Numéro invalide (9-10 chiffres)'
    if (form.mot_de_passe.length < 8) errors.mot_de_passe = 'Minimum 8 caractères'
    if (form.mot_de_passe !== form.confirm) errors.confirm = 'Les mots de passe ne correspondent pas'
    setFe(errors)
    return Object.keys(errors).length === 0
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

  // Shorthand to build input style inline
  const inp = (name, hasIcon = true) => iSt(name, focused, fe, mobile, hasIcon)

  return (
    <>
      <Head>
        <title>Inscription — E-Krili</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @media (max-width: 767px) {
          .insc-panel { display: none !important; }
          .insc-form  { padding: 24px 20px 40px !important; border-left: none !important; }
          .insc-header { padding: 0 20px !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Raleway', sans-serif" }}>

        {/* ── STICKY HEADER ── */}
        <div
          className="insc-header"
          style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', borderBottom: `1px solid ${BORDER}`, background: BG, position: 'sticky', top: 0, zIndex: 20, flexShrink: 0 }}
        >
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ color: GOLD, display: 'flex' }}><Ico d={ICONS.home} size={18} /></div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 300, letterSpacing: 4, color: GOLD, lineHeight: 1 }}>E-KRILI</div>
              <div style={{ fontSize: 6, letterSpacing: 3, color: FAINT, marginTop: 1 }}>IMMOBILIER DE PRESTIGE</div>
            </div>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  border: `1px solid ${s <= step ? GOLD : BORDER}`,
                  background: s < step ? GOLD : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, letterSpacing: 1,
                  color: s < step ? BG : s === step ? GOLD : FAINT,
                  transition: 'all 0.3s', fontFamily: "'Raleway', sans-serif",
                }}>
                  {s < step ? <Ico d={ICONS.check} size={11} /> : s}
                </div>
                {s < 2 && <div style={{ width: 24, height: 1, background: s < step ? GOLD : BORDER, transition: 'background 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => router.push('/login')}
            style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '7px 16px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            CONNEXION
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{ display: 'flex', flex: 1 }}>

          {/* Left decorative panel */}
          <div className="insc-panel" style={{ width: '34%', flexShrink: 0, position: 'relative', overflow: 'hidden', background: DARK }}>
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=60"
              fill style={{ objectFit: 'cover', opacity: 0.22, filter: 'saturate(0.4)' }} alt=""
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,16,14,0.72) 0%, rgba(18,16,14,0.96) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '0 44px 52px' }}>
              {step === 1 ? (
                <>
                  <div style={{ fontSize: 9, letterSpacing: 5, color: GOLD_L, marginBottom: 16 }}>BIENVENUE</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: '#F5F0E8', lineHeight: 1.15, margin: '0 0 16px' }}>
                    Rejoignez<br /><span style={{ fontStyle: 'italic', color: GOLD }}>l&apos;excellence</span><br />immobilière.
                  </h2>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 9, letterSpacing: 5, color: GOLD_L, marginBottom: 16 }}>ÉTAPE 2 / 2</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#F5F0E8', lineHeight: 1.15, margin: '0 0 16px' }}>
                    Vos informations
                  </h2>
                  <div style={{ width: 28, height: 1, background: GOLD, marginBottom: 18 }} />
                  {[
                    { icon: ICONS.lock,  text: 'Min. 8 caractères, majuscule et chiffre recommandés' },
                    { icon: ICONS.info,  text: 'Données chiffrées et sécurisées' },
                    { icon: ICONS.check, text: 'Compte activé immédiatement' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <span style={{ color: GOLD_L, flexShrink: 0 }}><Ico d={icon} size={12} /></span>
                      <span style={{ fontSize: 11, color: 'rgba(245,240,232,0.4)', lineHeight: 1.6, fontWeight: 300 }}>{text}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* ── FORM PANEL ── */}
          <div className="insc-form" style={{ flex: 1, overflowY: 'auto', padding: '40px 56px', background: BG2, borderLeft: `1px solid ${BORDER}` }}>
            <div style={{ maxWidth: 540, margin: '0 auto' }}>

              {/* STEP 1 — role picker */}
              {step === 1 && (
                <>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 10 }}>CRÉER UN COMPTE</div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mobile ? 26 : 30, fontWeight: 300, color: TEXT, margin: 0 }}>Vous êtes…</h1>
                    <div style={{ width: 32, height: 1, background: GOLD, marginTop: 12 }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ROLES.map(r => (
                      <button key={r.value} onClick={() => { setRole(r.value); setStep(2) }}
                        style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'transparent', border: `1px solid ${BORDER}`, padding: mobile ? '18px 20px' : '20px 24px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(184,137,42,0.04)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none' }}
                      >
                        <div style={{ width: 40, height: 40, flexShrink: 0, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
                          <Ico d={r.icon} size={17} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 3, color: TEXT, marginBottom: 3 }}>{r.label.toUpperCase()}</div>
                          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, fontWeight: 300 }}>{r.desc}</div>
                        </div>
                        <span style={{ color: GOLD, flexShrink: 0, opacity: 0.7 }}><Ico d="M9 18l6-6-6-6" size={16} /></span>
                      </button>
                    ))}
                  </div>

                  <div style={{ textAlign: 'center', marginTop: 28 }}>
                    <span style={{ fontSize: 13, color: FAINT }}>Déjà un compte ? </span>
                    <span onClick={() => router.push('/login')} style={{ fontSize: 13, color: GOLD, cursor: 'pointer', padding: '8px 4px', display: 'inline-block' }}>Se connecter</span>
                  </div>
                </>
              )}

              {/* STEP 2 — form */}
              {step === 2 && (
                <>
                  <button
                    onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: MUTED, padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = MUTED}
                  >
                    <Ico d={ICONS.back} size={12} /> CHANGER DE RÔLE
                  </button>

                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 30, height: 30, border: `1px solid rgba(184,137,42,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, flexShrink: 0 }}>
                        <Ico d={ROLES.find(r => r.value === role)?.icon} size={13} />
                      </div>
                      <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD }}>{ROLES.find(r => r.value === role)?.label.toUpperCase()}</div>
                    </div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mobile ? 26 : 30, fontWeight: 300, color: TEXT, margin: 0 }}>Vos informations</h1>
                    <div style={{ width: 32, height: 1, background: GOLD, marginTop: 12 }} />
                  </div>

                  {/* Global error */}
                  {error && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(192,57,43,0.07)', border: `1px solid rgba(192,57,43,0.25)`, borderLeft: `3px solid ${ERR}`, padding: '12px 14px', marginBottom: 20 }}>
                      <span style={{ color: ERR, flexShrink: 0 }}><Ico d={ICONS.alert} size={14} /></span>
                      <span style={{ fontSize: 12, color: ERR, lineHeight: 1.6 }}>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.25)', borderLeft: '3px solid #16a34a', padding: '12px 14px', marginBottom: 20 }}>
                      <span style={{ color: '#16a34a' }}><Ico d={ICONS.check} size={14} /></span>
                      <span style={{ fontSize: 12, color: '#16a34a' }}>Compte créé ! Redirection…</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>

                    {/* Name */}
                    {role === 'AGENCE' ? (
                      <Field label="RAISON SOCIALE *" icon={ICONS.building} name="raison_sociale" focused={focused} fe={fe}>
                        <input
                          value={form.raison_sociale} onChange={set('raison_sociale')} required
                          placeholder="Nom de votre agence"
                          onFocus={() => setFocused('raison_sociale')} onBlur={() => setFocused(null)}
                          style={inp('raison_sociale')}
                        />
                      </Field>
                    ) : (
                      <Grid2 mobile={mobile}>
                        <Field label="NOM *" icon={ICONS.user} name="nom" focused={focused} fe={fe}>
                          <input
                            value={form.nom} onChange={set('nom')} required placeholder="Votre nom"
                            onFocus={() => setFocused('nom')} onBlur={() => setFocused(null)}
                            style={inp('nom')}
                          />
                        </Field>
                        <Field label="PRÉNOM" icon={ICONS.user} name="prenom" focused={focused} fe={fe}>
                          <input
                            value={form.prenom} onChange={set('prenom')} placeholder="Votre prénom"
                            onFocus={() => setFocused('prenom')} onBlur={() => setFocused(null)}
                            style={inp('prenom')}
                          />
                        </Field>
                      </Grid2>
                    )}

                    {/* Email & Phone */}
                    <Grid2 mobile={mobile}>
                      <Field label="EMAIL *" icon={ICONS.email} name="email" focused={focused} fe={fe}>
                        <input
                          type="email" value={form.email} onChange={set('email')} required placeholder="vous@email.com"
                          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                          style={inp('email')} autoComplete="email"
                        />
                      </Field>
                      <Field label="TÉLÉPHONE *" icon={ICONS.phone} hint="Ex: 0555123456" name="telephone" focused={focused} fe={fe}>
                        <input
                          type="tel" value={form.telephone} onChange={set('telephone')} required placeholder="0555 123 456"
                          onFocus={() => setFocused('telephone')} onBlur={() => setFocused(null)}
                          style={inp('telephone')}
                        />
                      </Field>
                    </Grid2>

                    {/* DOB & Gender */}
                    {role !== 'AGENCE' && (
                      <Grid2 mobile={mobile}>
                        <Field label="DATE DE NAISSANCE" icon={ICONS.calendar} name="date_naissance" focused={focused} fe={fe}>
                          <input
                            type="date" value={form.date_naissance} onChange={set('date_naissance')}
                            onFocus={() => setFocused('date_naissance')} onBlur={() => setFocused(null)}
                            style={{ ...inp('date_naissance'), colorScheme: 'light' }}
                          />
                        </Field>
                        <Field label="SEXE" name="sexe" focused={focused} fe={fe}>
                          <select
                            value={form.sexe} onChange={set('sexe')}
                            onFocus={() => setFocused('sexe')} onBlur={() => setFocused(null)}
                            style={{ ...inp('sexe', false), width: '100%', background: 'transparent' }}
                          >
                            <option value="">—</option>
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                          </select>
                        </Field>
                      </Grid2>
                    )}

                    {/* Ville & Wilaya */}
                    <Grid2 mobile={mobile}>
                      <Field label="VILLE" icon={ICONS.map} name="ville" focused={focused} fe={fe}>
                        <input
                          value={form.ville} onChange={set('ville')} placeholder="Ex: Hydra"
                          onFocus={() => setFocused('ville')} onBlur={() => setFocused(null)}
                          style={inp('ville')}
                        />
                      </Field>
                      <Field label="WILAYA" icon={ICONS.map} name="wilaya" focused={focused} fe={fe}>
                        <select
                          value={form.wilaya} onChange={set('wilaya')}
                          onFocus={() => setFocused('wilaya')} onBlur={() => setFocused(null)}
                          style={{ ...inp('wilaya'), width: '100%', background: 'transparent' }}
                        >
                          <option value="">—</option>
                          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </Field>
                    </Grid2>

                    {/* Password */}
                    <Field label="MOT DE PASSE *" icon={ICONS.lock} hint="Min. 8 caractères" name="mot_de_passe" focused={focused} fe={fe}>
                      <input
                        type={showPwd ? 'text' : 'password'} value={form.mot_de_passe} onChange={set('mot_de_passe')} required
                        placeholder="••••••••"
                        onFocus={() => setFocused('mot_de_passe')} onBlur={() => setFocused(null)}
                        style={{ ...inp('mot_de_passe'), paddingRight: 36 }} autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                        style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 4 }}>
                        <Ico d={showPwd ? ICONS.eyeOff : ICONS.eye} size={15} />
                      </button>
                    </Field>

                    {/* Strength bar */}
                    {form.mot_de_passe && (
                      <div style={{ marginTop: -12, marginBottom: 20 }}>
                        <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i <= pwd.score ? pwd.color : BORDER, transition: 'background 0.3s' }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 9, color: pwd.color, letterSpacing: 1 }}>{pwd.label}</div>
                      </div>
                    )}

                    {/* Confirm password */}
                    <Field label="CONFIRMER LE MOT DE PASSE *" icon={ICONS.lock} name="confirm" focused={focused} fe={fe}>
                      <input
                        type={showCfm ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} required
                        placeholder="••••••••"
                        onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                        style={{ ...inp('confirm'), paddingRight: 36 }} autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowCfm(v => !v)} tabIndex={-1}
                        style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 4 }}>
                        <Ico d={showCfm ? ICONS.eyeOff : ICONS.eye} size={15} />
                      </button>
                    </Field>

                    {/* Match indicator */}
                    {form.confirm && (
                      <div style={{ marginTop: -12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: form.mot_de_passe === form.confirm ? '#27AE60' : ERR }}>
                        <Ico d={form.mot_de_passe === form.confirm ? ICONS.check : ICONS.alert} size={11} />
                        {form.mot_de_passe === form.confirm ? 'Les mots de passe correspondent' : 'Ne correspondent pas'}
                      </div>
                    )}

                    <div style={{ height: 1, background: `linear-gradient(to right, rgba(184,137,42,0.3), transparent)`, margin: '8px 0 24px' }} />

                    <button
                      type="submit" disabled={loading || success}
                      style={{ width: '100%', background: loading || success ? FAINT : GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: 4, padding: '16px 0', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 52 }}
                      onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.background = '#9A7020' }}
                      onMouseLeave={e => { if (!loading && !success) e.currentTarget.style.background = loading || success ? FAINT : GOLD }}
                    >
                      {loading ? "CRÉATION DU COMPTE…" : <><span>{"S'INSCRIRE"}</span><Ico d={ICONS.arrow} size={14} /></>}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <span style={{ fontSize: 13, color: FAINT }}>Déjà un compte ? </span>
                      <span onClick={() => router.push('/login')} style={{ fontSize: 13, color: GOLD, cursor: 'pointer', padding: '8px 4px', display: 'inline-block' }}>Se connecter</span>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}