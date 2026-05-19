// components/Header.js
import React, { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import { HiOutlineHome } from 'react-icons/hi'
import jwt from 'jsonwebtoken'

// ── Tokens ────────────────────────────────────────────────
const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const CREAM  = '#F5F0E8'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'
const BORDER_H = 'rgba(184,137,42,0.55)'
const DARK   = '#16120D'

// ── Static data ───────────────────────────────────────────
const WILAYAS = [
  'Toutes les wilayas','Adrar','Aïn Defla','Aïn Témouchent','Alger','Annaba',
  'Batna','Béchar','Béjaïa','Biskra','Blida','Bordj Bou Arréridj','Bouira',
  'Boumerdès','Chlef','Constantine','Djelfa','El Bayadh','El Oued','El Tarf',
  'Ghardaïa','Guelma','Illizi','Jijel','Khenchela','Laghouat','Mascara',
  'Médéa','Mila','Mostaganem','Msila','Naâma','Oran','Ouargla','Oum El Bouaghi',
  'Relizane','Saïda','Sétif','Sidi Bel Abbès','Skikda','Souk Ahras','Tamanrasset',
  'Tébessa','Tiaret','Tindouf','Tipaza','Tissemsilt','Tizi Ouzou','Tlemcen',
]
const TYPES = ['Type de bien','APPARTEMENT','VILLA','MAISON','BUREAU','LOCAL_COMMERCIAL','TERRAIN','STUDIO']
const TRANSACTIONS = ['Transaction','LOCATION','VENTE','LOCATION_VACANCES']

// ── SVG icons (no extra deps) ─────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const ICONS = {
  search:  'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  menu:    'M4 6h16M4 12h16M4 18h16',
  x:       'M18 6L6 18M6 6l12 12',
  user:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  chevron: 'M6 9l6 6 6-6',
  panel:   'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  heart:   'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  logout:  'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  globe:   'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
}

// ─────────────────────────────────────────────────────────
export default function Header() {
  const router = useRouter()
  const [user,        setUser]        = useState(null)
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)   // mobile menu
  const [searchOpen,  setSearchOpen]  = useState(false)   // mobile search drawer
  const [wilaya,      setWilaya]      = useState('')
  const [type,        setType]        = useState('')
  const [transaction, setTransaction] = useState('')
  const [prixMax,     setPrixMax]     = useState('')

  // Read token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const d = jwt.decode(token)
        if (d?.id) setUser(d)
      } catch {}
    }
  }, [])

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [router.pathname])

  const doSearch = () => {
    const p = new URLSearchParams()
    if (wilaya      && wilaya      !== 'Toutes les wilayas') p.set('wilaya', wilaya)
    if (type        && type        !== 'Type de bien')        p.set('type_bien', type)
    if (transaction && transaction !== 'Transaction')         p.set('type_transaction', transaction)
    if (prixMax)     p.set('prix_max', prixMax)
     router.push(`/search?${p.toString()}`)
    setSearchOpen(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  const displayName = user?.raison_sociale || `${user?.prenom || ''} ${user?.nom || ''}`.trim()

  return (
    <>
      {/* ── Main header bar ─────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: BG,
        borderBottom: `1px solid ${BORDER}`,
        boxShadow: scrolled ? '0 2px 20px rgba(26,23,19,0.1)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        {/* Gold top line */}
        <div style={{ height: 2, background: `linear-gradient(to right, ${GOLD}, ${GOLD}44, transparent)` }} />

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 60,
          maxWidth: 1400, margin: '0 auto', width: '100%',
        }}>

          {/* ── LOGO ── */}
          <div onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', flexShrink: 0 }}>
            <HiOutlineHome style={{ color: GOLD, fontSize: 20 }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 300, letterSpacing: 5, color: GOLD, lineHeight: 1 }}>
                E-KRILI
              </div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 6.5, letterSpacing: 3.5, color: FAINT, marginTop: 2 }}>
                IMMOBILIER DE PRESTIGE
              </div>
            </div>
          </div>

          {/* ── DESKTOP SEARCH BAR (hidden on mobile) ── */}
          <DesktopSearch
            wilaya={wilaya}      setWilaya={setWilaya}
            type={type}          setType={setType}
            transaction={transaction} setTransaction={setTransaction}
            prixMax={prixMax}    setPrixMax={setPrixMax}
            onSearch={doSearch}
          />

          {/* ── RIGHT SIDE ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

            {/* Globe — desktop only */}
            <button className="hdr-icon-btn hdr-desktop-only" title="Langue" style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 6 }}>
              <Icon d={ICONS.globe} size={16} />
            </button>

            {/* Search icon — mobile only */}
            <button
              className="hdr-mobile-only"
              onClick={() => setSearchOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: searchOpen ? GOLD : FAINT, display: 'flex', padding: 6, transition: 'color 0.2s' }}
            >
              <Icon d={searchOpen ? ICONS.x : ICONS.search} size={20} />
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 18, background: BORDER }} className="hdr-desktop-only" />

            {/* User area */}
            {user ? (
              <UserMenu user={user} displayName={displayName} onLogout={logout} router={router} />
            ) : (
              <GuestButtons router={router} />
            )}

            {/* Hamburger — mobile only */}
            <button
              className="hdr-mobile-only"
              onClick={() => setMobileOpen(o => !o)}
              style={{ background: 'none', border: `1px solid ${BORDER}`, cursor: 'pointer', color: FAINT, display: 'flex', padding: 8, marginLeft: 4, transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = FAINT }}
            >
              <Icon d={mobileOpen ? ICONS.x : ICONS.menu} size={18} />
            </button>
          </div>
        </div>

        {/* ── MOBILE SEARCH DRAWER ── */}
        {searchOpen && (
          <div style={{
            background: BG2, borderTop: `1px solid ${BORDER}`,
            padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <MobileSearchField label="Wilaya" value={wilaya} onChange={setWilaya} options={WILAYAS} />
            <MobileSearchField label="Type de bien" value={type} onChange={setType} options={TYPES} />
            <MobileSearchField label="Transaction" value={transaction} onChange={setTransaction} options={TRANSACTIONS} />
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 6 }}>PRIX MAX (DZD)</div>
              <input
                type="number" placeholder="ex: 50000"
                value={prixMax} onChange={e => setPrixMax(e.target.value)}
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 0, padding: '10px 12px', fontFamily: "'Raleway', sans-serif", fontSize: 12, color: TEXT, outline: 'none' }}
              />
            </div>
            <button onClick={doSearch} style={{
              background: GOLD, border: 'none', color: CREAM,
              fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, fontWeight: 600,
              padding: '14px', cursor: 'pointer', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = GOLD_L}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}
            >
              RECHERCHER
            </button>
          </div>
        )}

        {/* ── MOBILE MENU DRAWER ── */}
        {mobileOpen && (
          <nav style={{
            background: DARK, borderTop: `1px solid ${BORDER}`,
            padding: '12px 0',
          }}>
            {[
              { label: 'Parcourir les biens', href: '/biens' },
              { label: 'Tableau de bord',     href: '/panel', authOnly: true },
              { label: 'Mes favoris',          href: '/favoris', authOnly: true },
              { label: 'Connexion',            href: '/login', guestOnly: true },
              { label: 'Créer un compte',      href: '/inscription', guestOnly: true },
            ]
              .filter(item => {
                if (item.authOnly  && !user)  return false
                if (item.guestOnly &&  user)  return false
                return true
              })
              .map(item => (
                <button key={item.href} onClick={() => router.push(item.href)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    borderLeft: '2px solid transparent',
                    padding: '14px 24px', cursor: 'pointer', textAlign: 'left',
                    fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                    color: 'rgba(245,239,227,0.5)', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = CREAM; e.currentTarget.style.borderLeftColor = GOLD; e.currentTarget.style.background = 'rgba(184,137,42,0.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,239,227,0.5)'; e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'none' }}
                >
                  {item.label.toUpperCase()}
                </button>
              ))
            }
            {user && (
              <>
                <div style={{ height: 1, background: BORDER, margin: '8px 24px' }} />
                <button onClick={logout}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '14px 24px', cursor: 'pointer', textAlign: 'left',
                    fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                    color: 'rgba(210,100,100,0.7)', transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e07070'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(210,100,100,0.7)'}
                >
                  DÉCONNEXION
                </button>
              </>
            )}
          </nav>
        )}
      </header>

      {/* ── Global responsive CSS ── */}
      <style>{`
        .hdr-desktop-only { display: flex !important; }
        .hdr-mobile-only  { display: none  !important; }
        @media (max-width: 768px) {
          .hdr-desktop-only { display: none  !important; }
          .hdr-mobile-only  { display: flex !important; }
        }
        .hdr-icon-btn:hover { color: ${GOLD} !important; }
      `}</style>
    </>
  )
}

// ── Desktop search bar ────────────────────────────────────
function DesktopSearch({ wilaya, setWilaya, type, setType, transaction, setTransaction, prixMax, setPrixMax, onSearch }) {
  const [focused, setFocused] = useState(false)
  const sel = {
    background: 'transparent', border: 'none',
    borderRight: `1px solid ${BORDER}`,
    color: MUTED, fontFamily: "'Raleway', sans-serif",
    fontSize: 10, letterSpacing: 1.5,
    padding: '0 12px', height: '100%',
    cursor: 'pointer', outline: 'none',
    appearance: 'none', WebkitAppearance: 'none',
    minWidth: 110,
  }
  return (
    <div className="hdr-desktop-only" style={{
      alignItems: 'stretch', height: 38, flex: '0 1 620px',
      border: `1px solid ${focused ? BORDER_H : BORDER}`,
      background: focused ? '#F5F1EA' : 'rgba(237,233,225,0.5)',
      transition: 'border-color 0.25s, background 0.25s',
    }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <select value={wilaya} onChange={e => setWilaya(e.target.value)} style={sel} className="lux-select">
        {WILAYAS.map(w => <option key={w}>{w}</option>)}
      </select>
      <select value={type} onChange={e => setType(e.target.value)} style={sel} className="lux-select">
        {TYPES.map(t => <option key={t}>{t}</option>)}
      </select>
      <select value={transaction} onChange={e => setTransaction(e.target.value)} style={{ ...sel, borderRight: 'none' }} className="lux-select">
        {TRANSACTIONS.map(t => <option key={t}>{t}</option>)}
      </select>
      <button onClick={onSearch} className="lux-search-btn" style={{
        background: GOLD, border: 'none', color: CREAM,
        fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 600,
        letterSpacing: 3, padding: '0 20px', cursor: 'pointer',
        whiteSpace: 'nowrap', transition: 'background 0.2s', flexShrink: 0,
      }}>
        RECHERCHE
      </button>
    </div>
  )
}

// ── Mobile search field ───────────────────────────────────
function MobileSearchField({ label, value, onChange, options }) {
  return (
    <div>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 6 }}>
        {label.toUpperCase()}
      </div>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', background: BG, border: `1px solid ${BORDER}`,
        padding: '10px 12px', fontFamily: "'Raleway', sans-serif",
        fontSize: 12, color: TEXT, outline: 'none', appearance: 'none',
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ── User dropdown menu ────────────────────────────────────
function UserMenu({ user, displayName, onLogout, router }) {
  const initial = (user?.raison_sociale || user?.prenom || user?.nom || '?')[0].toUpperCase()
  const roleLabel = { CLIENT: 'Client', PROPRIETAIRE: 'Propriétaire', AGENCE: 'Agence' }[user?.role] || ''

  return (
    <Menu as="div" style={{ position: 'relative' }}>
      <Menu.Button style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'transparent', border: `1px solid ${BORDER}`,
        padding: '6px 12px', cursor: 'pointer', transition: 'border-color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = BORDER_H}
        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
      >
        {/* Avatar initial */}
        <div style={{
          width: 26, height: 26, background: `${GOLD}22`,
          border: `1px solid ${GOLD}44`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: GOLD,
        }}>
          {initial}
        </div>
        <div className="hdr-desktop-only" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 1.5, color: TEXT, lineHeight: 1 }}>
            {displayName.split(' ')[0]}
          </span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 7.5, letterSpacing: 2, color: GOLD }}>
            {roleLabel.toUpperCase()}
          </span>
        </div>
        <span style={{ color: FAINT, display: 'flex' }}><Icon d={ICONS.chevron} size={13} /></span>
      </Menu.Button>

      <Transition as={Fragment}
        enter="transition ease-out duration-120" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-80"  leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1"
      >
        <Menu.Items style={{
          position: 'absolute', right: 0, top: 'calc(100% + 10px)',
          width: 220, outline: 'none', padding: '8px 0',
          background: BG2, border: `1px solid ${BORDER}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)', zIndex: 200,
        }}>
          {/* User info block */}
          <div style={{ padding: '10px 16px 14px', borderBottom: `1px solid ${BORDER}`, marginBottom: 8 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: TEXT }}>{displayName}</div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2.5, color: GOLD, marginTop: 3 }}>{roleLabel.toUpperCase()}</div>
          </div>

          {[
            { label: 'Tableau de bord', icon: ICONS.panel,  action: () => router.push('/panel') },
            { label: 'Mes favoris',      icon: ICONS.heart,  action: () => router.push('/favoris') },
            { label: 'Mon profil',       icon: ICONS.user,   action: () => router.push(`/profil/${user?.id}`) },
          ].map(({ label, icon, action }) => (
            <Menu.Item key={label}>
              {({ active }) => (
                <button onClick={action} style={{
                  width: '100%', textAlign: 'left', background: active ? 'rgba(184,137,42,0.07)' : 'transparent',
                  border: 'none', padding: '10px 16px', cursor: 'pointer',
                  fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2,
                  color: active ? GOLD_L : MUTED, transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ color: active ? GOLD : FAINT, display: 'flex' }}><Icon d={icon} size={13} /></span>
                  {label.toUpperCase()}
                </button>
              )}
            </Menu.Item>
          ))}

          <div style={{ height: 1, background: BORDER, margin: '8px 16px' }} />

          <Menu.Item>
            {({ active }) => (
              <button onClick={onLogout} style={{
                width: '100%', textAlign: 'left', background: 'transparent',
                border: 'none', padding: '10px 16px', cursor: 'pointer',
                fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2,
                color: active ? '#e07070' : 'rgba(210,100,100,0.7)',
                display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.15s',
              }}>
                <span style={{ display: 'flex' }}><Icon d={ICONS.logout} size={13} /></span>
                DÉCONNEXION
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

// ── Guest buttons ─────────────────────────────────────────
function GuestButtons({ router }) {
  return (
    <div className="hdr-desktop-only" style={{ alignItems: 'center', gap: 8 }}>
      <button className="lux-outline-btn" onClick={() => router.push('/login')} style={{
        background: 'transparent', fontFamily: "'Raleway', sans-serif",
        fontSize: 9, letterSpacing: 2.5, padding: '8px 16px', cursor: 'pointer',
      }}>
        CONNEXION
      </button>
      <button className="lux-gold-btn" onClick={() => router.push('/inscription')} style={{
        fontFamily: "'Raleway', sans-serif", fontSize: 9,
        letterSpacing: 2.5, padding: '8px 16px', cursor: 'pointer', border: 'none',
      }}>
        S&apos;INSCRIRE
      </button>
    </div>
  )
}