import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
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
  borderHover: 'rgba(184,137,42,0.55)',
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
      {/* Brand */}
      <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, fontWeight: 300, letterSpacing: 6, color: L.gold,
          lineHeight: 1,
        }}>E-KRILI</div>
        <div style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 7, letterSpacing: 5, color: L.faint, marginTop: 3,
        }}>IMMOBILIER DE PRESTIGE</div>
      </div>

      {/* Nav pills */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[
          { label: 'SE CONNECTER',  href: '/login_client' },
          { label: "S'INSCRIRE",    href: '/signup_client' },
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

/* ─── Shared Input / Button CSS injected once ────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Raleway:wght@300;400;500&display=swap');

      .auth-input {
        width: 100%;
        box-sizing: border-box;
        background: ${L.bg};
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

      .auth-select {
        width: 100%;
        box-sizing: border-box;
        background: ${L.bg};
        border: none;
        border-bottom: 1px solid ${L.border};
        padding: 11px 0;
        font-family: 'Raleway', sans-serif;
        font-size: 12px;
        font-weight: 300;
        color: ${L.text};
        outline: none;
        margin-bottom: 28px;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238A8278'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 4px center;
        transition: border-color 0.2s;
      }
      .auth-select:focus { border-bottom-color: ${L.gold}; }

      .auth-btn {
        width: 100%;
        padding: 15px 0;
        background: ${L.gold};
        border: none;
        color: ${L.bg};
        font-family: 'Raleway', sans-serif;
        font-size: 10px;
        letter-spacing: 4;
        cursor: pointer;
        transition: background 0.2s, transform 0.15s;
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
      }
      .auth-link:hover { color: ${L.gold}; }
      .auth-link span { color: ${L.gold}; }

      input[type='date'].auth-input { color-scheme: light; }
    `}</style>
  )
}

/* ─── LABEL ─────────────────────────────────────────────── */
const Label = ({ children }) => (
  <label style={{
    display: 'block',
    fontFamily: "'Raleway', sans-serif",
    fontSize: 8, letterSpacing: 4, color: L.gold, marginBottom: 8,
  }}>{children}</label>
)

/* ─── Decorative left panel ──────────────────────────────── */
function ImagePanel({ src, quote, sub }) {
  return (
    <div style={{
      width: '38%', flexShrink: 0,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: '52px 44px',
    }}>
      <Image
        src={src} fill priority
        style={{ objectFit: 'cover', filter: 'brightness(0.45) saturate(0.6)' }}
        alt="Luxury property"
      />
      {/* warm vignette from right */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(26,23,19,0.1) 0%, rgba(237,233,225,0.55) 100%)' }} />
      {/* gold top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${L.gold}, transparent)` }} />
      {/* bottom content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 30, fontWeight: 300, fontStyle: 'italic',
          color: '#F5F0E8', lineHeight: 1.25, marginBottom: 18,
        }}
          dangerouslySetInnerHTML={{ __html: quote }}
        />
        <div style={{ width: 28, height: 1, background: L.gold, marginBottom: 14 }} />
        <div style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9, letterSpacing: 3.5, color: 'rgba(245,240,232,0.6)',
        }}>{sub}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SIGNUP
═══════════════════════════════════════════════════════════ */
export default function SignupClient() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', mdps: '', date_naissance: '', sex: '' })
  const router = useRouter()
  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const response = await fetch('/api/api_insert_client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await response.json()
    setLoading(false)
    if (response.ok) {
      toast.success('Compte créé avec succès !', { position: 'top-center' })
      setTimeout(() => router.push('/login_client'), 1500)
    } else {
      toast.error(data?.error || 'Erreur lors de la création du compte', { position: 'top-center' })
    }
  }

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', background: L.bg, display: 'flex', flexDirection: 'column' }}>
        <AuthHeader activePage="/signup_client" />

        <div style={{ display: 'flex', flex: 1 }}>
          <ImagePanel
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=60"
            quote="&ldquo;L&rsquo;excellence<br/>commence ici.&rdquo;"
            sub="REJOIGNEZ LA COMMUNAUTÉ E-KRILI"
          />

          {/* Form panel */}
          <div style={{
            flex: 1, padding: '52px 68px',
            background: L.bg2,
            borderLeft: `1px solid ${L.border}`,
            overflowY: 'auto',
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 38, fontWeight: 300, color: L.text, lineHeight: 1,
            }}>Créer un compte</div>
            <div style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 8, letterSpacing: 5, color: L.faint,
              marginTop: 8, marginBottom: 44,
            }}>VOTRE ESPACE PERSONNEL</div>

            {/* gold rule */}
            <div style={{ height: 1, marginBottom: 36, background: `linear-gradient(to right, rgba(184,137,42,0.35), transparent)` }} />

            <form onSubmit={handleSubmit} style={{ maxWidth: 580 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 48 }}>
                <div><Label>NOM</Label>
                  <input className="auth-input" type="text" required placeholder="Votre nom" value={form.nom} onChange={update('nom')} /></div>
                <div><Label>PRÉNOM</Label>
                  <input className="auth-input" type="text" required placeholder="Votre prénom" value={form.prenom} onChange={update('prenom')} /></div>
                <div><Label>EMAIL</Label>
                  <input className="auth-input" type="email" required placeholder="exemple@email.com" value={form.email} onChange={update('email')} /></div>
                <div><Label>TÉLÉPHONE</Label>
                  <input className="auth-input" type="tel" required placeholder="+213 ..." value={form.telephone} onChange={update('telephone')} /></div>
                <div><Label>MOT DE PASSE</Label>
                  <input className="auth-input" type="password" required placeholder="••••••••" value={form.mdps} onChange={update('mdps')} /></div>
                <div><Label>DATE DE NAISSANCE</Label>
                  <input className="auth-input" type="date" required value={form.date_naissance} onChange={update('date_naissance')} /></div>
                <div><Label>SEXE</Label>
                  <select className="auth-select" required value={form.sex} onChange={update('sex')}>
                    <option value="">Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading} style={{ letterSpacing: 4 }}>
                {loading ? 'CRÉATION EN COURS…' : 'CRÉER MON COMPTE'}
              </button>

              <div style={{ marginTop: 20, fontFamily: "'Raleway', sans-serif", fontSize: 11, color: L.faint }}>
                Déjà membre ?{' '}
                <span className="auth-link" onClick={() => router.push('/login_client')} style={{ color: L.gold, cursor: 'pointer' }}>
                  Se connecter
                </span>
              </div>
            </form>
          </div>
        </div>

        <ToastContainer toastStyle={{ background: L.bg2, color: L.text, border: `1px solid ${L.border}`, fontFamily: "'Raleway', sans-serif", fontSize: 12 }} />
      </div>
    </>
  )
}