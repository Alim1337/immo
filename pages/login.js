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

// SVG icon helper
const Ico = ({ d, size = 18, stroke = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  email:    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  lock:     'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  eye:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff:   'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
  alert:    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  check:    'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
  home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  arrow:    'M5 12h14M12 5l7 7-7 7',
  key:      'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
}

const STATS = [
  { n: '500+', l: 'Biens' },
  { n: '12+',  l: 'Quartiers' },
  { n: '98%',  l: 'Satisfaits' },
]

export default function Login() {
  const router = useRouter()
  const [form,      setForm]      = useState({ email: '', mot_de_passe: '' })
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [showPwd,   setShowPwd]   = useState(false)
  const [focusedF,  setFocused]   = useState(null)
  const [success,   setSuccess]   = useState(false)

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

  const fieldBorder = (name) => focusedF === name ? GOLD : BORDER

  return (
    <>
      <Head><title>Connexion — E-Krili</title></Head>

      <div style={{ minHeight: '100vh', display: 'flex', background: BG, fontFamily: "'Raleway', sans-serif" }}>

        {/* ── LEFT PANEL ── dark cinematic */}
        <div style={{ width: '42%', flexShrink: 0, position: 'relative', overflow: 'hidden', background: DARK, display: 'flex', flexDirection: 'column' }}>

          {/* Background image */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=60"
              fill style={{ objectFit: 'cover', opacity: 0.3, filter: 'saturate(0.5)' }}
              alt="" priority
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(18,16,14,0.96) 0%, rgba(18,16,14,0.7) 60%, rgba(18,16,14,0.92) 100%)' }} />
          </div>

          {/* Top gold line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)`, zIndex: 1 }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, padding: '48px 48px 40px' }}>

            {/* Logo */}
            <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
              <div style={{ width: 36, height: 36, border: `1px solid rgba(184,137,42,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
                <Ico d={ICONS.home} size={16} />
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, letterSpacing: 5, color: GOLD, lineHeight: 1 }}>E-KRILI</div>
                <div style={{ fontSize: 7, letterSpacing: 4, color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>IMMOBILIER DE PRESTIGE</div>
              </div>
            </div>

            {/* Main copy */}
            <div style={{ margin: 'auto 0' }}>
              <div style={{ fontSize: 9, letterSpacing: 5, color: GOLD_L, marginBottom: 18 }}>BIENVENUE</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: '#F5F0E8', lineHeight: 1.1, margin: '0 0 20px' }}>
                L&apos;immobilier<br />
                <span style={{ fontStyle: 'italic', color: GOLD }}>de prestige</span><br />
                à portée de main.
              </h2>
              <div style={{ width: 36, height: 1, background: GOLD, marginBottom: 20 }} />
              <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(245,240,232,0.5)', lineHeight: 1.9, letterSpacing: 0.4, maxWidth: 280 }}>
                Des propriétés d&apos;exception pour une clientèle exigeante. Connectez-vous pour accéder à votre espace personnel.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 2, marginTop: 48 }}>
              {STATS.map(({ n, l }) => (
                <div key={l} style={{ flex: 1, border: `1px solid rgba(184,137,42,0.2)`, padding: '14px 0', textAlign: 'center', background: 'rgba(18,16,14,0.5)' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: GOLD, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 8, letterSpacing: 3, color: 'rgba(245,240,232,0.35)', marginTop: 4 }}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 64px', background: BG2, borderLeft: `1px solid ${BORDER}` }}>
          <div style={{ width: '100%', maxWidth: 400 }}>

            {/* Heading */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 10 }}>ESPACE PERSONNEL</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: TEXT, margin: 0 }}>Connexion</h1>
              <div style={{ width: 32, height: 1, background: GOLD, marginTop: 12 }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.25)', padding: '12px 14px', marginBottom: 24, borderLeft: '3px solid #C0392B' }}>
                <span style={{ color: '#C0392B', flexShrink: 0, marginTop: 1 }}><Ico d={ICONS.alert} size={15} /></span>
                <span style={{ fontSize: 12, color: '#C0392B', lineHeight: 1.6 }}>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.25)', padding: '12px 14px', marginBottom: 24, borderLeft: '3px solid #16a34a' }}>
                <span style={{ color: '#16a34a' }}><Ico d={ICONS.check} size={15} /></span>
                <span style={{ fontSize: 12, color: '#16a34a' }}>Connexion réussie ! Redirection…</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 8 }}>ADRESSE EMAIL</div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: 0, color: focusedF === 'email' ? GOLD : FAINT, transition: 'color 0.2s' }}>
                    <Ico d={ICONS.email} size={15} />
                  </span>
                  <input
                    type="email" value={form.email} onChange={set('email')} required
                    placeholder="votre@email.com"
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${fieldBorder('email')}`, color: TEXT, fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300, padding: '10px 0 10px 28px', outline: 'none', transition: 'border-color 0.2s' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 8 }}>MOT DE PASSE</div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: 0, color: focusedF === 'pwd' ? GOLD : FAINT, transition: 'color 0.2s' }}>
                    <Ico d={ICONS.lock} size={15} />
                  </span>
                  <input
                    type={showPwd ? 'text' : 'password'} value={form.mot_de_passe} onChange={set('mot_de_passe')} required
                    placeholder="••••••••"
                    onFocus={() => setFocused('pwd')} onBlur={() => setFocused(null)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${fieldBorder('pwd')}`, color: TEXT, fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300, padding: '10px 32px 10px 28px', outline: 'none', transition: 'border-color 0.2s' }}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                    style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 0 }}>
                    <Ico d={showPwd ? ICONS.eyeOff : ICONS.eye} size={15} />
                  </button>
                </div>
                <div style={{ fontSize: 10, color: FAINT, marginTop: 6, letterSpacing: 0.3 }}>
                  Minimum 8 caractères
                </div>
              </div>

              {/* Forgot */}
              <div style={{ textAlign: 'right', marginBottom: 32 }}>
                <span style={{ fontSize: 10, color: GOLD, cursor: 'pointer', letterSpacing: 1 }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD_L}
                  onMouseLeave={e => e.currentTarget.style.color = GOLD}>
                  Mot de passe oublié ?
                </span>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading || success}
                style={{ width: '100%', background: loading || success ? FAINT : GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 4, padding: '15px 0', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.background = '#9A7020' }}
                onMouseLeave={e => { if (!loading && !success) e.currentTarget.style.background = GOLD }}
              >
                {loading ? 'CONNEXION…' : (
                  <>SE CONNECTER <Ico d={ICONS.arrow} size={14} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0' }}>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
              <span style={{ fontSize: 10, letterSpacing: 2, color: FAINT }}>OU</span>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
            </div>

            {/* Register link */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: FAINT }}>Pas encore de compte ? </span>
              <span onClick={() => router.push('/inscription')} style={{ fontSize: 12, color: GOLD, cursor: 'pointer', letterSpacing: 0.5 }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD_L}
                onMouseLeave={e => e.currentTarget.style.color = GOLD}>
                Créer un compte
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}