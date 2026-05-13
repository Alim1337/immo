import React from 'react'
import { useRouter } from 'next/router'
import { HiOutlineHome } from 'react-icons/hi'

const L = { gold: '#B8892A', bg: '#D8D2C6', text: '#1A1713', muted: '#5A5248', faint: '#8A8278', border: 'rgba(184,137,42,0.2)' }

const columns = [
  { heading: 'À propos', links: ['Comment ça marche', 'Newsroom', 'Investisseurs', 'Clients Premium', 'Propriétaires Premium'] },
  { heading: 'Accessibilité', links: ["Fonctionnalités", "Guide d'utilisation", "Politique d'accès", 'Partenaires'] },
  { heading: 'Support', links: ['Confiance & Sécurité', "Centre d'aide", 'Conditions générales', 'Politique de confidentialité'] },
  { heading: 'Communauté', links: ['Référencer un bien', 'Espace propriétaire', 'Forum', 'Blog immobilier'] },
]

function Footer() {
  const router = useRouter()
  return (
    <footer style={{ background: L.bg, borderTop: `1px solid ${L.border}`, marginTop: 0 }}>
      {/* Gold top accent */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #B8892A, transparent)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 40px 40px' }}>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px repeat(4, 1fr)', gap: '0 40px', marginBottom: 56 }}>

          {/* Logo col */}
          <div>
            <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <HiOutlineHome style={{ color: L.gold, fontSize: 20 }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, letterSpacing: 4, color: L.gold }}>E-KRILI</div>
                <div style={{ fontSize: 7, letterSpacing: 4, color: L.faint, fontFamily: "'Raleway', sans-serif", marginTop: 2 }}>IMMOBILIER DE PRESTIGE</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300, color: L.muted, lineHeight: 1.9, letterSpacing: 0.5, maxWidth: 200 }}>
              La plateforme immobilière de référence en Algérie. Trouvez le bien qui vous correspond.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {['f', 'in', 'tw'].map((s) => (
                <div key={s}
                  style={{ width: 32, height: 32, border: `1px solid rgba(184,137,42,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Raleway', sans-serif", fontSize: 10, color: L.faint, cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = L.gold; e.currentTarget.style.color = L.gold }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(184,137,42,0.3)'; e.currentTarget.style.color = L.faint }}
                >{s}</div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: L.gold, marginBottom: 20, textTransform: 'uppercase' }}>
                {heading}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {links.map((link) => (
                  <li key={link} style={{ marginBottom: 12 }}>
                    <a href="#"
                      style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300, color: L.muted, letterSpacing: 0.5, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.target.style.color = L.gold}
                      onMouseLeave={(e) => e.target.style.color = L.muted}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(to right, rgba(184,137,42,0.25), transparent)`, marginBottom: 28 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 300, color: L.faint, letterSpacing: 1 }}>
            © {new Date().getFullYear()} E-Krili. Tous droits réservés.
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Confidentialité', 'Conditions', 'Cookies'].map((item) => (
              <a key={item} href="#"
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: L.faint, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = L.gold}
                onMouseLeave={(e) => e.target.style.color = L.faint}
              >{item.toUpperCase()}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer