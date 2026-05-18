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

const Ico = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  email:  'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  lock:   'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  eye:    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
  alert:  'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  check:  'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
  home:   'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  arrow:  'M5 12h14M12 5l7 7-7 7',
}

export default function Login() {
  const router = useRouter()
  const [form,    setForm]    = useState({ email: '', mot_de_passe: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [focused, setFocused] = useState(null)
  const [success, setSuccess] = useState(false)
  const [mobile,  setMobile]  = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email.includes('@')) return setError('Adresse email invalide.')
    if (form.mot_de_passe.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Email ou mot de passe incorrect.')
      localStorage.setItem('token', data.token)
      setSuccess(true)
      setTimeout(() => router.push('/panel'), 700)
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  const fb = name => focused === name ? GOLD : BORDER

  const inputSt = name => ({
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${fb(name)}`, color: TEXT,
    fontFamily: "'Raleway', sans-serif", fontSize: mobile ? 15 : 13,
    fontWeight: 300, padding: '12px 32px 12px 28px',
    outline: 'none', transition: 'border-color 0.2s',
    WebkitAppearance: 'none',
  })

  return (
    <>
      <Head>
        <title>Connexion — E-Krili</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @media (max-width: 767px) {
          .login-panel { display: none !important; }
          .login-form-wrap { padding: 28px 24px 40px !important; }
          .login-root { flex-direction: column !important; }
        }
      `}</style>

      <div className="login-root" style={{ minHeight: '100vh', display: 'flex', background: BG, fontFamily: "'Raleway', sans-serif" }}>

        {/* ── LEFT: dark cinematic panel (hidden on mobile) ── */}
        <div className="login-panel" style={{ width: '42%', flexShrink: 0, position: 'relative', overflow: 'hidden', background: DARK }}>
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=60"
            fill style={{ objectFit: 'cover', opacity: 0.28, filter: 'saturate(0.5)' }}
            alt="" priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(18,16,14,0.97) 0%, rgba(18,16,14,0.65) 60%, rgba(18,16,14,0.93) 100%)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '48px 48px 44px' }}>
            {/* Logo */}
            <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, border: `1px solid rgba(184,137,42,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
                <Ico d={ICONS.home} size={16} />
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, letterSpacing: 5, color: GOLD, lineHeight: 1 }}>E-KRILI</div>
                <div style={{ fontSize: 7, letterSpacing: 4, color: 'rgba(245,240,232,0.3)', marginTop: 2 }}>IMMOBILIER DE PRESTIGE</div>
              </div>
            </div>

            {/* Copy */}
            <div style={{ margin: 'auto 0' }}>
              <div style={{ fontSize: 9, letterSpacing: 5, color: GOLD_L, marginBottom: 18 }}>BIENVENUE</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: '#F5F0E8', lineHeight: 1.1, margin: '0 0 20px' }}>
                L&apos;immobilier<br />
                <span style={{ fontStyle: 'italic', color: GOLD }}>de prestige</span><br />
                à portée de main.
              </h2>
              <div style={{ width: 36, height: 1, background: GOLD, marginBottom: 20 }} />
              <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(245,240,232,0.45)', lineHeight: 1.9, letterSpacing: 0.4, maxWidth: 280 }}>
                Des propriétés d&apos;exception pour une clientèle exigeante.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG2, borderLeft: `1px solid ${BORDER}` }}>
          <div className="login-form-wrap" style={{ width: '100%', maxWidth: 420, padding: '40px 52px' }}>

            {/* Mobile-only logo */}
            <div onClick={() => router.push('/')} style={{ display: mobile ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36, cursor: 'pointer' }}>
              <Ico d={ICONS.home} size={20} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, letterSpacing: 5, color: GOLD }}>E-KRILI</div>
                <div style={{ fontSize: 7, letterSpacing: 3, color: FAINT, marginTop: 2 }}>IMMOBILIER DE PRESTIGE</div>
              </div>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 10 }}>ESPACE PERSONNEL</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mobile ? 30 : 34, fontWeight: 300, color: TEXT, margin: 0 }}>Connexion</h1>
              <div style={{ width: 32, height: 1, background: GOLD, marginTop: 12 }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.25)', borderLeft: '3px solid #C0392B', padding: '12px 14px', marginBottom: 24 }}>
                <span style={{ color: '#C0392B', flexShrink: 0, marginTop: 1 }}><Ico d={ICONS.alert} size={14} /></span>
                <span style={{ fontSize: 12, color: '#C0392B', lineHeight: 1.6 }}>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.25)', borderLeft: '3px solid #16a34a', padding: '12px 14px', marginBottom: 24 }}>
                <span style={{ color: '#16a34a' }}><Ico d={ICONS.check} size={14} /></span>
                <span style={{ fontSize: 12, color: '#16a34a' }}>Connexion réussie ! Redirection…</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 8 }}>ADRESSE EMAIL</div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: 0, color: focused === 'email' ? GOLD : FAINT, transition: 'color 0.2s', display: 'flex' }}>
                    <Ico d={ICONS.email} size={15} />
                  </span>
                  <input type="email" value={form.email} onChange={set('email')} required
                    placeholder="votre@email.com" autoComplete="email"
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    style={inputSt('email')}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 8 }}>MOT DE PASSE</div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: 0, color: focused === 'pwd' ? GOLD : FAINT, transition: 'color 0.2s', display: 'flex' }}>
                    <Ico d={ICONS.lock} size={15} />
                  </span>
                  <input type={showPwd ? 'text' : 'password'} value={form.mot_de_passe} onChange={set('mot_de_passe')} required
                    placeholder="••••••••" autoComplete="current-password"
                    onFocus={() => setFocused('pwd')} onBlur={() => setFocused(null)}
                    style={inputSt('pwd')}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                    style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 4 }}>
                    <Ico d={showPwd ? ICONS.eyeOff : ICONS.eye} size={15} />
                  </button>
                </div>
                <div style={{ fontSize: 10, color: FAINT, marginTop: 6 }}>Minimum 8 caractères</div>
              </div>

              {/* Forgot */}
              <div style={{ textAlign: 'right', marginBottom: 28 }}>
                <span
                  onClick={() => router.push('/mot-de-passe-oublie')}
                  style={{ fontSize: 11, color: GOLD, cursor: 'pointer', padding: '8px 0', display: 'inline-block' }}
                >
                  Mot de passe oublié ?
                </span>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading || success}
                style={{ width: '100%', background: loading || success ? FAINT : GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: 4, padding: '16px 0', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 52 }}
                onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.background = '#9A7020' }}
                onMouseLeave={e => { if (!loading && !success) e.currentTarget.style.background = GOLD }}
              >
                {loading ? 'CONNEXION…' : <><span>SE CONNECTER</span><Ico d={ICONS.arrow} size={14} /></>}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
              <span style={{ fontSize: 10, letterSpacing: 2, color: FAINT }}>OU</span>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
            </div>

            {/* Register */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 13, color: FAINT }}>Pas encore de compte ? </span>
              <span onClick={() => router.push('/inscription')}
                style={{ fontSize: 13, color: GOLD, cursor: 'pointer', padding: '8px 4px', display: 'inline-block' }}>
                Créer un compte
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}