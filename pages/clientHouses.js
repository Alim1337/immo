import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.22)'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  user:     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  list:     'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
  home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  support:  'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  star:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  plus:     'M12 5v14M5 12h14',
  edit:     'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  search:   'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  handshake:'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z',
  arrowL:   'M19 12H5M12 5l-7 7 7 7',
}

// MENUS is now a function so the biens entry can be dynamic
const getMenus = (isProprietaire) => [
  { title: 'Gestion de profil',                        iconKey: 'user',     href: '/profile' },
  { title: 'Gestion des annonces',                     iconKey: 'list',     href: '/Modifier_Demande_Client' },
  { title: isProprietaire ? 'Gestion des biens' : 'Ajouter un bien',
                                                        iconKey: 'home',     href: isProprietaire ? '/gestionBien_modify' : '/BienFormPage' },
  { title: 'Support',                                  iconKey: 'support',  href: '/support' },
  { title: 'Devenir VIP',                              iconKey: 'star',     vip: true },
  { title: 'Paramètres',                               iconKey: 'settings', href: '/settings' },
]

const ACTIONS = [
  { text: 'Ajouter un bien',         subtext: 'Publiez une nouvelle annonce',       iconKey: 'plus',      href: '/BienFormPage' },
  { text: 'Demande personnalisée',   subtext: 'Soumettez une recherche sur mesure', iconKey: 'edit',      href: '/Demande_Client' },
  { text: 'Consulter vos demandes',  subtext: 'Modifiez vos demandes existantes',   iconKey: 'list',      href: '/Modifier_Demande_Client' },
  { text: 'Consulter les biens',     subtext: 'Parcourez toutes les annonces',      iconKey: 'search',    href: '/homesList' },
  { text: 'Voir les négociations',   subtext: 'Suivez vos échanges en cours',       iconKey: 'handshake', href: '/negotiation_client' },
]

export default function ClientHouses() {
  const [sidebarOpen, setSidebarOpen]       = useState(true)
  const [activeMenu, setActiveMenu]         = useState(0)
  const [showVIPWindow, setShowVIPWindow]   = useState(false)
  const [showConfirm, setShowConfirm]       = useState(false)
  const [clientName, setClientName]         = useState('')
  const [clientEmail, setClientEmail]       = useState('')
  const [isProprietaire, setIsProprietaire] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const decoded = jwt.decode(token)
    if (decoded) {
      setClientName(decoded.nom || '')
      setClientEmail(decoded.email || '')
      // Check if this client already has a Proprietaire record
      fetch(`/api/api_check_proprietaire?email=${encodeURIComponent(decoded.email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => { if (data.isProprietaire) setIsProprietaire(true) })
        .catch(() => {})
    }
  }, [])

  const handleConfirmation = () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const decoded = jwt.decode(token)
    if (!decoded?.userType) return
    fetch('/api/api_create_vip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decodedToken: decoded }),
    })
      .then(res => { if (!res.ok) throw new Error('Failed'); router.push('/Vip') })
      .catch(err => { alert('Erreur: ' + err.message); setShowConfirm(false); setShowVIPWindow(false) })
  }

  const initials = clientName
    ? clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  return (
    // Full-height layout, no footer — this is an app shell, not a marketing page
    <div style={{ background: BG, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: sidebarOpen ? 220 : 56,
          flexShrink: 0,
          background: DARK,
          borderRight: `1px solid rgba(184,137,42,0.18)`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          overflow: 'hidden',
          position: 'relative',
        }}>

          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              position: 'absolute', top: 18, right: -11, zIndex: 10,
              width: 22, height: 22, background: BG2,
              border: `1px solid ${BORDER}`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: MUTED, fontSize: 11,
              transition: 'transform 0.25s',
              transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          >‹</button>

          {/* user block */}
          <div style={{
            padding: '24px 16px 18px',
            borderBottom: `1px solid rgba(184,137,42,0.12)`,
            display: 'flex', alignItems: 'center', gap: 10,
            overflow: 'hidden', whiteSpace: 'nowrap',
          }}>
            <div style={{
              width: 34, height: 34, flexShrink: 0,
              background: 'rgba(184,137,42,0.12)',
              border: `1px solid rgba(184,137,42,0.28)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14, color: GOLD_L,
            }}>{initials}</div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontFamily: "'Raleway', sans-serif", fontSize: 11,
                  fontWeight: 500, letterSpacing: 0.5, color: '#F5F0E8',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{clientName || 'Client'}</div>
                <div style={{
                  fontFamily: "'Raleway', sans-serif", fontSize: 9,
                  color: 'rgba(255,255,255,0.28)', marginTop: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{clientEmail}</div>
              </div>
            )}
          </div>

          {/* nav items */}
          <nav style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
            {getMenus(isProprietaire).map((menu, i) => {
              const isActive = activeMenu === i
              return (
                <button key={i}
                  onClick={() => {
                    setActiveMenu(i)
                    if (menu.vip) { setShowVIPWindow(true); return }
                    if (menu.href) router.push(menu.href)
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: 10, padding: sidebarOpen ? '10px 16px' : '10px 0',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    background: isActive ? 'rgba(184,137,42,0.1)' : 'transparent',
                    border: 'none', borderLeft: `2px solid ${isActive ? GOLD : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    color: isActive ? GOLD_L : 'rgba(255,255,255,0.38)',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(184,137,42,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.38)' } }}
                >
                  <span style={{ flexShrink: 0, display: 'flex' }}>
                    <Icon d={ICONS[menu.iconKey]} size={15} />
                  </span>
                  {sidebarOpen && (
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2.5 }}>
                      {menu.title.toUpperCase()}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* back */}
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: sidebarOpen ? '14px 16px' : '14px 0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderTop: `1px solid rgba(184,137,42,0.12)`,
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'rgba(255,255,255,0.22)',
              transition: 'color 0.2s', whiteSpace: 'nowrap', width: '100%',
            }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}
          >
            <span style={{ display: 'flex', flexShrink: 0 }}><Icon d={ICONS.arrowL} size={13} /></span>
            {sidebarOpen && <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2.5 }}>ACCUEIL</span>}
          </button>
        </aside>

        {/* ── Content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '48px 56px 56px' }}>

          {/* Page header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>
              ESPACE CLIENT
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1 }}>
              {clientName ? `${greeting()}, ${clientName.split(' ')[0]}` : 'Devenir propriétaire'}
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 14 }} />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, marginTop: 14, fontWeight: 300, letterSpacing: 0.3, margin: '14px 0 0' }}>
              Ajoutez au moins un bien pour obtenir le statut propriétaire.
            </p>
          </div>

          {/* Action cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: 12,
          }}>
            {ACTIONS.map((action, i) => (
              <ActionCard key={i} {...action} onClick={() => router.push(action.href)} />
            ))}
          </div>

          {/* Subtle in-app footer — just copyright, no nav clutter */}
          <div style={{
            marginTop: 64,
            paddingTop: 20,
            borderTop: `1px solid ${BORDER}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT }}>
              © {new Date().getFullYear()} E-KRILI — IMMOBILIER DE PRESTIGE
            </span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1.5, color: FAINT }}>
              <a href="/support" style={{ color: FAINT, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = FAINT}>
                AIDE & SUPPORT
              </a>
            </span>
          </div>
        </main>
      </div>

      {/* VIP Modal */}
      {showVIPWindow && (
        <Modal onClose={() => setShowVIPWindow(false)}>
          <Eyebrow>★ STATUT VIP</Eyebrow>
          <ModalTitle>Activer votre accès VIP</ModalTitle>
          <ModalBody>Confirmez votre paiement pour débloquer la collection prestige et publier des annonces VIP.</ModalBody>
          <div style={{ display: 'flex', gap: 8 }}>
            <ModalBtn primary onClick={() => { setShowVIPWindow(false); setShowConfirm(true) }}>J'AI PAYÉ</ModalBtn>
            <ModalBtn onClick={() => setShowVIPWindow(false)}>PAS ENCORE</ModalBtn>
          </div>
        </Modal>
      )}

      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <Eyebrow>★ CONFIRMATION</Eyebrow>
          <ModalTitle>Confirmer l'activation</ModalTitle>
          <ModalBody>En confirmant, votre statut VIP sera activé immédiatement.</ModalBody>
          <div style={{ display: 'flex', gap: 8 }}>
            <ModalBtn primary onClick={handleConfirmation}>OUI, CONFIRMER</ModalBtn>
            <ModalBtn onClick={() => setShowConfirm(false)}>ANNULER</ModalBtn>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ActionCard({ iconKey, text, subtext, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG2 : BG,
        border: `1px solid ${hover ? GOLD : BORDER}`,
        padding: '28px 24px',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'all 0.2s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.07)' : 'none',
      }}
    >
      <div style={{ color: hover ? GOLD : FAINT, display: 'flex', transition: 'color 0.2s' }}>
        <Icon d={ICONS[iconKey]} size={20} />
      </div>
      <div>
        <div style={{
          fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2.5,
          color: hover ? TEXT : MUTED, fontWeight: 500, transition: 'color 0.2s', marginBottom: 6,
        }}>{text.toUpperCase()}</div>
        <div style={{
          fontFamily: "'Raleway', sans-serif", fontSize: 10,
          color: FAINT, fontWeight: 300, lineHeight: 1.6,
        }}>{subtext}</div>
      </div>
      <div style={{
        fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: GOLD,
        opacity: hover ? 1 : 0, transition: 'opacity 0.2s',
      }}>ACCÉDER →</div>
    </button>
  )
}

function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,15,10,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, backdropFilter: 'blur(3px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: BG, border: `1px solid ${BORDER}`,
        padding: '36px 32px', width: '100%', maxWidth: 400, position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', fontSize: 18, color: FAINT, cursor: 'pointer' }}>×</button>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, marginBottom: 24 }} />
        {children}
      </div>
    </div>
  )
}

function ModalBtn({ children, onClick, primary }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        background: primary ? (hover ? '#9A7020' : GOLD) : 'transparent',
        border: primary ? 'none' : `1px solid ${hover ? MUTED : BORDER}`,
        color: primary ? BG : MUTED,
        fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
        padding: '12px 0', cursor: 'pointer', transition: 'all 0.2s',
      }}
    >{children}</button>
  )
}

const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: GOLD_L, textAlign: 'center', marginBottom: 14 }}>{children}</div>
)
const ModalTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: TEXT, textAlign: 'center', margin: '0 0 10px' }}>{children}</h2>
)
const ModalBody = ({ children }) => (
  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, textAlign: 'center', lineHeight: 1.8, marginBottom: 28, fontWeight: 300 }}>{children}</p>
)