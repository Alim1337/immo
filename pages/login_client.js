import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'

const L = {
  gold:   '#B8892A',
  goldL:  '#D4A84B',
  goldD:  '#9A7020',
  bg:     '#EDE9E1',
  bg2:    '#E4DFD5',
  dark:   '#1A1713',
  text:   '#1A1713',
  muted:  '#5A5248',
  faint:  '#8A8278',
  border: 'rgba(184,137,42,0.22)',
}

/* ─── Shared Header ─────────────────────────────────────── */
function AuthHeader({ activePage }) {
  const router = useRouter()
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 52px',
      borderBottom: `1px solid ${L.border}`,
      background: L.bg,
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, fontWeight: 300, letterSpacing: 6, color: L.gold, lineHeight: 1,
        }}>E-KRILI</div>
        <div style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 7, letterSpacing: 5, color: L.faint, marginTop: 3,
        }}>IMMOBILIER DE PRESTIGE</div>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[
          { label: 'SE CONNECTER', href: '/login_client' },
          { label: "S'INSCRIRE",   href: '/signup_client' },
        ].map(({ label, href }) => {
          const active = activePage === href
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 9, letterSpacing: 3,
                padding: '9px 22px',
                cursor: 'pointer',
                border: active ? 'none' : `1px solid ${L.border}`,
                background: active ? L.gold : 'transparent',
                color: active ? L.bg : L.muted,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = L.goldL; e.currentTarget.style.color = L.text } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = L.border; e.currentTarget.style.color = L.muted } }}
            >{label}</button>
          )
        })}
      </nav>
    </header>
  )
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Raleway:wght@300;400;500&display=swap');

      .auth-input {
        width: 100%;
        box-sizing: border-box;
        background: transparent;
        border: none;
        border-bottom: 1px solid ${L.border};
        padding: 11px 0;
        font-family: 'Raleway', sans-serif;
        font-size: 12px;
        font-weight: 300;
        color: ${L.text};
        letter-spacing: 0.5px;
        outline: none;
        margin-bottom: 28px;
        transition: border-color 0.2s;
      }
      .auth-input::placeholder { color: ${L.faint}; }
      .auth-input:focus { border-bottom-color: ${L.gold}; }

      .auth-btn {
        width: 100%;
        padding: 15px 0;
        background: ${L.gold};
        border: none;
        color: ${L.bg};
        font-family: 'Raleway', sans-serif;
        font-size: 10px;
        letter-spacing: 4px;
        cursor: pointer;
        transition: background 0.2s, transform 0.15s;
        margin-top: 8px;
        margin-bottom: 8px;
      }
      .auth-btn:hover:not(:disabled) { background: ${L.goldD}; transform: translateY(-1px); }
      .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

      .auth-link {
        font-family: 'Raleway', sans-serif;
        font-size: 10px;
        color: ${L.faint};
        cursor: pointer;
        text-decoration: none;
        letter-spacing: 0.5px;
        transition: color 0.2s;
        background: none;
        border: none;
        padding: 0;
      }
      .auth-link:hover, .auth-link:hover span { color: ${L.gold}; }
      .auth-link span { color: ${L.gold}; }

      .auth-divider {
        height: 1px;
        margin-bottom: 32px;
        background: linear-gradient(to right, rgba(184,137,42,0.35), transparent);
      }
    `}</style>
  )
}

const Label = ({ children }) => (
  <label style={{
    display: 'block',
    fontFamily: "'Raleway', sans-serif",
    fontSize: 8, letterSpacing: 4, color: L.gold, marginBottom: 8,
  }}>{children}</label>
)

/* ═══════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════ */
export default function LoginClient() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const response = await fetch('/api/api_login_client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    setLoading(false)
    if (response.ok) {
      const { token } = await response.json()
      localStorage.setItem('token', token)
      router.push('/panel')
    } else {
      const error = await response.text()
      toast.error(error, { position: 'top-center' })
    }
  }

  return (
    <>
      <GlobalStyles />
      <div style={{ display: 'flex', minHeight: '100vh', background: L.bg, flexDirection: 'column' }}>
        <AuthHeader activePage="/login_client" />

        <div style={{ display: 'flex', flex: 1 }}>

          {/* LEFT — image panel */}
          <div style={{
            width: '42%', flexShrink: 0,
            position: 'relative', overflow: 'hidden',
          }}>
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=60"
              fill priority
              style={{ objectFit: 'cover', filter: 'brightness(0.45) saturate(0.65)' }}
              alt="Luxury property"
            />
            {/* warm overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(26,23,19,0.05) 0%, rgba(237,233,225,0.55) 100%)' }} />
            {/* gold top line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${L.gold}, transparent)` }} />

            {/* centered content */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', padding: '56px 52px',
            }}>
              <div style={{ width: 32, height: 1, background: L.gold, marginBottom: 32 }} />
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 34, fontWeight: 300, fontStyle: 'italic',
                color: '#F5F0E8', lineHeight: 1.3, marginBottom: 28,
              }}>
                L&apos;immobilier<br />
                de prestige,<br />
                à portée de main.
              </p>
              <div style={{ width: 28, height: 1, background: L.gold, marginBottom: 22 }} />
              <p style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 10, fontWeight: 300,
                color: 'rgba(245,240,232,0.6)',
                letterSpacing: 2, lineHeight: 2,
              }}>
                DES PROPRIÉTÉS D&apos;EXCEPTION<br />
                POUR UNE CLIENTÈLE D&apos;EXCEPTION.
              </p>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{
            flex: 1,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '60px 72px',
            background: L.bg2,
            borderLeft: `1px solid ${L.border}`,
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 38, fontWeight: 300, color: L.text, lineHeight: 1,
            }}>Bon retour</div>
            <div style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 8, letterSpacing: 5, color: L.faint,
              marginTop: 8, marginBottom: 44,
            }}>CONNECTEZ-VOUS À VOTRE ESPACE</div>

            <div className="auth-divider" />

            <form onSubmit={handleLogin} style={{ maxWidth: 400 }}>
              <Label>ADRESSE EMAIL</Label>
              <input
                className="auth-input"
                type="email" required
                placeholder="exemple@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <Label>MOT DE PASSE</Label>
              <input
                className="auth-input"
                type="password" required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'CONNEXION…' : 'SE CONNECTER'}
              </button>
            </form>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 24, maxWidth: 400,
            }}>
              <button className="auth-link">Mot de passe oublié ?</button>
              <button className="auth-link" onClick={() => router.push('/signup_client')}>
                Pas encore membre ? <span>Créer un compte</span>
              </button>
            </div>
          </div>
        </div>

        <ToastContainer toastStyle={{ background: L.bg2, color: L.text, border: `1px solid ${L.border}`, fontFamily: "'Raleway', sans-serif", fontSize: 12 }} />
      </div>
    </>
  )
}