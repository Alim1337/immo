import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

const GOLD       = '#B8892A'
const GOLD_LIGHT = '#D4A84B'
const BG         = '#EDE9E1'
const TEXT       = '#1A1713'
const MUTED      = '#5A5248'
const BORDER     = 'rgba(184,137,42,0.22)'

export default function Header() {
  const router = useRouter()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const menuRef = useRef(null)

  /* shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* close menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navLinks = [
    { label: 'Acheter',  href: '/homesList' },
    { label: 'Louer',    href: '/homesList?type=rent' },
    { label: 'Estimer',  href: '/estimate' },
    { label: 'Agences',  href: '/agents' },
  ]

  return (
    <header
      className="lux-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'box-shadow 0.3s',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.1)' : '0 1px 16px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 40px',
          height: 68,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 24,
        }}
      >

        {/* ── LEFT : Logo ── */}
        <div
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{ position: 'relative', width: 32, height: 32, flexShrink: 0 }}>
            <Image
              src="https://img.freepik.com/free-vector/real-estate-business-logo-template-branding-design-vector-haus-estate-company-text_53876-136241.jpg"
              fill
              style={{ objectFit: 'contain' }}
              alt="E-Krili logo"
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontWeight: 400,
                color: TEXT,
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              E-<span style={{ fontStyle: 'italic', color: GOLD }}>Krili</span>
            </div>
            <div
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 7,
                letterSpacing: 4,
                color: MUTED,
                marginTop: 2,
              }}
            >
              IMMOBILIER DE PRESTIGE
            </div>
          </div>
        </div>

        {/* ── CENTRE : Search bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            border: `1px solid ${searchFocus ? GOLD : BORDER}`,
            background: searchFocus ? '#F5F1EA' : BG,
            transition: 'border-color 0.25s, background 0.25s',
            padding: '0 6px 0 16px',
            height: 40,
            width: 340,
          }}
        >
          <input
            type="text"
            placeholder="Ville, quartier ou code postal…"
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: "'Raleway', sans-serif",
              fontSize: 12,
              fontWeight: 300,
              color: TEXT,
              letterSpacing: 0.5,
            }}
          />
          <button
            className="lux-search-btn"
            onClick={() => router.push('/homesList')}
            style={{
              background: GOLD,
              border: 'none',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <MagnifyingGlassIcon style={{ width: 14, height: 14, color: BG }} />
          </button>
        </div>

        {/* ── RIGHT : Nav + Auth ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 28 }}>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 24 }}>
            {navLinks.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: router.pathname === href ? GOLD : MUTED,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s',
                  borderBottom: router.pathname === href ? `1px solid ${GOLD}` : '1px solid transparent',
                  paddingBottom: 2,
                }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = router.pathname === href ? GOLD : MUTED}
              >
                {label.toUpperCase()}
              </button>
            ))}
          </nav>

          {/* Vertical separator */}
          <div style={{ width: 1, height: 20, background: BORDER }} />

          {/* Auth buttons + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="lux-outline-btn"
              onClick={() => router.push('/login')}
              style={{
                background: 'transparent',
                fontFamily: "'Raleway', sans-serif",
                fontSize: 10,
                letterSpacing: 3,
                padding: '8px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              CONNEXION
            </button>
            <button
              className="lux-gold-btn"
              onClick={() => router.push('/signup')}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 10,
                letterSpacing: 3,
                padding: '8px 18px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              PUBLIER
            </button>

            {/* Hamburger menu */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: 'none',
                  border: `1px solid ${BORDER}`,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  marginLeft: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
                aria-label="Menu"
              >
                {[0,1,2].map(i => (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: menuOpen ? (i === 1 ? 0 : 16) : (i === 1 ? 10 : 16),
                      height: 1,
                      background: MUTED,
                      transition: 'width 0.25s',
                    }}
                  />
                ))}
              </button>

              {menuOpen && (
                <div
                  className="lux-menu-items"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    minWidth: 200,
                    zIndex: 100,
                    padding: '8px 0',
                  }}
                >
                  {[
                    { label: 'Mon compte',       href: '/account' },
                    { label: 'Mes annonces',      href: '/my-listings' },
                    { label: 'Favoris',           href: '/favorites' },
                    { label: 'Messages',          href: '/messages' },
                    { label: 'Aide & contact',    href: '/help' },
                  ].map(({ label, href }) => (
                    <button
                      key={label}
                      className="lux-menu-item"
                      onClick={() => { setMenuOpen(false); router.push(href) }}
                      style={{
                        display: 'block',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: 11,
                        letterSpacing: 2,
                        color: MUTED,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {label.toUpperCase()}
                    </button>
                  ))}
                  <div style={{ height: 1, background: BORDER, margin: '8px 20px' }} />
                  <button
                    className="lux-menu-item"
                    onClick={() => { setMenuOpen(false); router.push('/login') }}
                    style={{
                      display: 'block',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 11,
                      letterSpacing: 2,
                      color: GOLD,
                      padding: '10px 20px',
                      cursor: 'pointer',
                    }}
                  >
                    DÉCONNEXION
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}