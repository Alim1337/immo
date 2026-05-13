import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'

/* ─── Design tokens ─────────────────────────────────────── */
const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.22)'

/* ─── Inline SVG icon ───────────────────────────────────── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  user:      'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  list:      'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
  home:      'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  support:   'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  star:      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  plus:      'M12 5v14M5 12h14',
  edit:      'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  search:    'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  handshake: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z',
  building:  'M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.85M19 21V10.85',
  chevronL:  'M15 18l-6-6 6-6',
  chevronR:  'M9 18l6-6-6-6',
  arrowL:    'M19 12H5M12 5l-7 7 7 7',
  logout:    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
}

/* ─── Sidebar menus (dynamic by role) ───────────────────── */
const getMenus = (isProprio) => [
  { title: 'Profil',           iconKey: 'user',     section: 'profil' },
  { title: 'Mes annonces',     iconKey: 'list',     section: 'annonces' },
  { title: isProprio ? 'Mes biens' : 'Ajouter un bien',
                               iconKey: 'home',     section: 'biens' },
  { title: 'Négociations',     iconKey: 'handshake',section: 'negociations' },
  { title: 'Devenir VIP',      iconKey: 'star',     vip: true },
  { title: 'Support',          iconKey: 'support',  section: 'support' },
  { title: 'Paramètres',       iconKey: 'settings', section: 'settings' },
]

/* ─── Action cards per role ─────────────────────────────── */
const getActions = (isProprio) => {
  const clientActions = [
    { text: 'Demande personnalisée',        subtext: 'Soumettez une recherche sur mesure',        iconKey: 'edit',      href: '/demande' },
    { text: 'Consulter vos demandes',       subtext: 'Consultez et modifiez vos demandes',        iconKey: 'list',      href: '/gestion-demande' },
    { text: 'Parcourir les biens',          subtext: 'Toutes les annonces disponibles',           iconKey: 'search',    href: '/homesList' },
    { text: 'Négociations (demandes)',      subtext: 'Vos demandes en cours de négociation',      iconKey: 'handshake', href: '/negotiation_demande_client' },
    { text: 'Négociations (propriétaires)',  subtext: 'Échanges avec les propriétaires',           iconKey: 'handshake', href: '/negotiation_client' },
  ]
  const proprioActions = [
    { text: 'Ajouter un bien',              subtext: 'Publiez une nouvelle annonce',              iconKey: 'plus',      href: '/BienFormPage' },
    { text: 'Gérer mes biens',              subtext: 'Modifiez et suivez vos biens publiés',      iconKey: 'building',  href: '/gestionBien_modify' },
    { text: 'Négociations (mes biens)',     subtext: 'Biens en cours de négociation',             iconKey: 'handshake', href: '/negotiation_proprietaire' },
    { text: 'Demandes clients',             subtext: 'Répondez aux demandes des clients',         iconKey: 'handshake', href: '/negotiation_demande_proprietaire' },
  ]
  return isProprio ? [...clientActions, ...proprioActions] : clientActions
}

/* ─── Greeting ──────────────────────────────────────────── */
const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Panel() {
  const [sidebarOpen, setSidebarOpen]     = useState(true)
  const [activeSection, setActiveSection] = useState('accueil')
  const [showVIPWindow, setShowVIPWindow] = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [clientName, setClientName]       = useState('')
  const [clientEmail, setClientEmail]     = useState('')
  const [userType, setUserType]           = useState('')   // 'client' | 'proprietaire'
  const [hasToken, setHasToken]           = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login_client'); return }
    const decoded = jwt.decode(token)
    if (decoded) {
      setClientName(decoded.nom || '')
      setClientEmail(decoded.email || '')
      setUserType(decoded.userType || 'client')
    }
    setHasToken(true)
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

  /* Loading / redirect state */
  if (!hasToken) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: MUTED, letterSpacing: 2 }}>
        Redirection…
      </p>
    </div>
  )

  const isProprio = userType === 'proprietaire'
  const initials  = clientName ? clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'
  const menus     = getMenus(isProprio)
  const actions   = getActions(isProprio)

  /* Which section content to show */
  const sectionContent = {
    accueil:     <AccueilSection isProprio={isProprio} clientName={clientName} actions={actions} router={router} />,
    profil:      <PlaceholderSection title="Gestion de profil"   href="/profile" router={router} />,
    annonces:    <PlaceholderSection title="Mes annonces"        href="/Modifier_Demande_Client"       router={router} />,
    biens:       <PlaceholderSection title={isProprio ? 'Mes biens' : 'Ajouter un bien'} href={isProprio ? '/gestionBien_modify' : '/BienFormPage'} router={router} />,
    negociations:<NegosSection isProprio={isProprio} router={router} />,
    support:     <PlaceholderSection title="Support"             href="/support"                       router={router} />,
    settings:    <PlaceholderSection title="Paramètres"          href="/settings"                      router={router} />,
  }

  return (
    <div style={{ background: BG, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside style={{
          width: sidebarOpen ? 232 : 56,
          flexShrink: 0,
          background: DARK,
          borderRight: `1px solid rgba(184,137,42,0.18)`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          overflow: 'hidden',
        }}>

          {/* ── User block ── */}
          <div style={{
            padding: sidebarOpen ? '22px 18px 18px' : '22px 0 18px',
            borderBottom: `1px solid rgba(184,137,42,0.12)`,
            display: 'flex', alignItems: 'center',
            gap: sidebarOpen ? 12 : 0,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              background: 'rgba(184,137,42,0.12)',
              border: `1px solid rgba(184,137,42,0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: GOLD_L,
            }}>{initials}</div>

            {sidebarOpen && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 500, color: '#F5F0E8', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {clientName || 'Client'}
                </div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: 'rgba(255,255,255,0.28)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {clientEmail}
                </div>
                {/* Role badge */}
                <div style={{
                  display: 'inline-block', marginTop: 6,
                  fontFamily: "'Raleway', sans-serif", fontSize: 7,
                  letterSpacing: isProprio ? 2 : 1.5,
                  color: isProprio ? GOLD_L : 'rgba(255,255,255,0.35)',
                  border: `1px solid ${isProprio ? 'rgba(184,137,42,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  padding: '2px 7px',
                }}>
                  {isProprio ? '★ PROPRIÉTAIRE' : 'CLIENT'}
                </div>
              </div>
            )}
          </div>

          {/* ── Accueil shortcut ── */}
          <SidebarItem
            label="Tableau de bord"
            iconKey="home"
            active={activeSection === 'accueil'}
            collapsed={!sidebarOpen}
            onClick={() => setActiveSection('accueil')}
            accent
          />

          {/* ── Divider ── */}
          <div style={{ height: 1, background: 'rgba(184,137,42,0.1)', margin: '4px 0' }} />

          {/* ── Nav items ── */}
          <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {menus.map((menu, i) => (
              <SidebarItem
                key={i}
                label={menu.title}
                iconKey={menu.iconKey}
                active={activeSection === menu.section}
                collapsed={!sidebarOpen}
                isVip={menu.vip}
                onClick={() => {
                  if (menu.vip) { setShowVIPWindow(true); return }
                  setActiveSection(menu.section)
                }}
              />
            ))}
          </nav>

          {/* ── Bottom controls: toggle + logout ── */}
          <div style={{ borderTop: `1px solid rgba(184,137,42,0.12)`, flexShrink: 0 }}>
            {/* Back to site */}
            <SidebarItem
              label="Accueil du site"
              iconKey="arrowL"
              collapsed={!sidebarOpen}
              onClick={() => router.push('/')}
              faint
            />
            {/* Logout */}
            <SidebarItem
              label="Déconnexion"
              iconKey="logout"
              collapsed={!sidebarOpen}
              onClick={() => { localStorage.removeItem('token'); router.push('/') }}
              faint
            />
            {/* Toggle button — INSIDE sidebar at the very bottom */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarOpen ? 'flex-end' : 'center',
                gap: 6,
                padding: sidebarOpen ? '10px 16px' : '10px 0',
                background: 'rgba(255,255,255,0.03)',
                border: 'none',
                borderTop: `1px solid rgba(184,137,42,0.08)`,
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.2)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
            >
              {sidebarOpen && (
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2 }}>
                  RÉDUIRE
                </span>
              )}
              <Icon d={sidebarOpen ? ICONS.chevronL : ICONS.chevronR} size={13} />
            </button>
          </div>
        </aside>

        {/* ══════════════ MAIN CONTENT ══════════════ */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '44px 52px 52px', position: 'relative' }}>
          {sectionContent[activeSection] || sectionContent.accueil}

          {/* Footer strip */}
          <div style={{
            marginTop: 56, paddingTop: 18,
            borderTop: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: FAINT }}>
              © {new Date().getFullYear()} E-KRILI — IMMOBILIER DE PRESTIGE
            </span>
            <button
              onClick={() => setActiveSection('support')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: FAINT, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = FAINT}
            >
              AIDE & SUPPORT
            </button>
          </div>
        </main>
      </div>

      {/* ── VIP Modal ── */}
      {showVIPWindow && (
        <Modal onClose={() => setShowVIPWindow(false)}>
          <Eyebrow>★ STATUT VIP</Eyebrow>
          <ModalTitle>Activer votre accès VIP</ModalTitle>
          <ModalBody>Confirmez votre paiement pour débloquer la collection prestige et publier des annonces VIP.</ModalBody>
          <div style={{ display: 'flex', gap: 8 }}>
            <ModalBtn primary onClick={() => { setShowVIPWindow(false); setShowConfirm(true) }}>J&apos;AI PAYÉ</ModalBtn>
            <ModalBtn onClick={() => setShowVIPWindow(false)}>PAS ENCORE</ModalBtn>
          </div>
        </Modal>
      )}

      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <Eyebrow>★ CONFIRMATION</Eyebrow>
          <ModalTitle>Confirmer l&apos;activation</ModalTitle>
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

/* ═══════════════════════════════════════════════════════════
   SECTION: Accueil (main dashboard view)
═══════════════════════════════════════════════════════════ */
function AccueilSection({ isProprio, clientName, actions, router }) {
  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>
          {isProprio ? 'ESPACE PROPRIÉTAIRE' : 'ESPACE CLIENT'}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1.1 }}>
          {clientName ? `${greeting()}, ${clientName.split(' ')[0]}` : 'Tableau de bord'}
        </h1>
        <div style={{ width: 36, height: 1, background: GOLD, marginTop: 14 }} />
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, marginTop: 14, fontWeight: 300, lineHeight: 1.7 }}>
          {isProprio
            ? 'Gérez vos biens, suivez vos négociations et répondez aux demandes de vos clients.'
            : 'Ajoutez au moins un bien pour obtenir le statut propriétaire et accéder aux fonctionnalités avancées.'}
        </p>

        {/* Upgrade prompt for clients */}
        {!isProprio && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginTop: 20, padding: '10px 18px',
            border: `1px solid rgba(184,137,42,0.3)`,
            background: 'rgba(184,137,42,0.04)',
          }}>
            <Icon d={ICONS.home} size={14} />
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: MUTED }}>
              Publiez votre premier bien pour devenir propriétaire
            </span>
            <button
              onClick={() => router.push('/BienFormPage')}
              style={{
                background: GOLD, border: 'none', color: BG,
                fontFamily: "'Raleway', sans-serif", fontSize: 8,
                letterSpacing: 2, padding: '6px 14px', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}
            >
              AJOUTER UN BIEN →
            </button>
          </div>
        )}
      </div>

      {/* Propriétaire: section label */}
      {isProprio && (
        <SectionLabel>ACTIONS RAPIDES — CLIENT</SectionLabel>
      )}

      {/* Client actions grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10, marginBottom: isProprio ? 36 : 0 }}>
        {(isProprio ? actions.slice(0, 5) : actions).map((action, i) => (
          <ActionCard key={i} {...action} onClick={() => router.push(action.href)} />
        ))}
      </div>

      {/* Propriétaire-only section */}
      {isProprio && (
        <>
          <SectionLabel style={{ marginTop: 12 }}>GESTION PROPRIÉTAIRE</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
            {actions.slice(5).map((action, i) => (
              <ActionCard key={i} {...action} onClick={() => router.push(action.href)} gold />
            ))}
          </div>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: Négociations (split view by role)
═══════════════════════════════════════════════════════════ */
function NegosSection({ isProprio, router }) {
  const clientNegs = [
    { text: 'Négociations sur vos demandes', subtext: 'Demandes en cours de négociation',    href: '/negotiation_demande_client' },
    { text: 'Négociations propriétaires',    subtext: 'Échanges avec les propriétaires',      href: '/negotiation_client' },
  ]
  const proprioNegs = [
    { text: 'Négociations sur vos biens',    subtext: 'Biens en cours de négociation',        href: '/negotiation_proprietaire' },
    { text: 'Demandes clients',              subtext: 'Répondre aux demandes des clients',    href: '/negotiation_demande_proprietaire' },
  ]

  return (
    <>
      <PageTitle eyebrow="NÉGOCIATIONS" title="Vos échanges en cours" />
      <SectionLabel>EN TANT QUE CLIENT</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginBottom: 32 }}>
        {clientNegs.map((n, i) => (
          <ActionCard key={i} iconKey="handshake" text={n.text} subtext={n.subtext} onClick={() => router.push(n.href)} />
        ))}
      </div>
      {isProprio && (
        <>
          <SectionLabel>EN TANT QUE PROPRIÉTAIRE</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {proprioNegs.map((n, i) => (
              <ActionCard key={i} iconKey="handshake" text={n.text} subtext={n.subtext} onClick={() => router.push(n.href)} gold />
            ))}
          </div>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: Generic placeholder — redirects to existing pages
═══════════════════════════════════════════════════════════ */
function PlaceholderSection({ title, href, router }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 48 }}>
      <PageTitle eyebrow="ESPACE CLIENT" title={title} />
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, fontWeight: 300, lineHeight: 1.7, marginBottom: 28 }}>
        Cette section s'ouvre dans une page dédiée.
      </p>
      <button
        onClick={() => router.push(href)}
        style={{
          background: GOLD, border: 'none', color: BG,
          fontFamily: "'Raleway', sans-serif", fontSize: 9,
          letterSpacing: 3, padding: '13px 32px', cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
        onMouseLeave={e => e.currentTarget.style.background = GOLD}
      >
        ACCÉDER →
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   REUSABLE SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */

/* Sidebar item */
function SidebarItem({ label, iconKey, active, collapsed, onClick, isVip, faint, accent }) {
  const [hover, setHover] = useState(false)
  const color = isVip
    ? (hover ? '#F5D980' : GOLD_L)
    : faint
      ? (hover ? GOLD : 'rgba(255,255,255,0.2)')
      : accent
        ? (active || hover ? '#F5F0E8' : 'rgba(255,255,255,0.55)')
        : (active ? '#F5F0E8' : hover ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.38)')

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={collapsed ? label : undefined}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center',
        gap: 10,
        padding: collapsed ? '9px 0' : '9px 18px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active ? 'rgba(184,137,42,0.1)' : hover ? 'rgba(184,137,42,0.05)' : 'transparent',
        border: 'none',
        borderLeft: `2px solid ${active ? GOLD : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.15s',
        color,
        whiteSpace: 'nowrap', overflow: 'hidden',
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>
        <Icon d={ICONS[iconKey]} size={14} />
      </span>
      {!collapsed && (
        <span style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9, letterSpacing: 2,
          fontWeight: isVip ? 500 : 400,
        }}>
          {label.toUpperCase()}
        </span>
      )}
      {!collapsed && isVip && (
        <span style={{ marginLeft: 'auto', fontSize: 8, color: GOLD_L, letterSpacing: 1 }}>★</span>
      )}
    </button>
  )
}

/* Action card */
function ActionCard({ iconKey, text, subtext, onClick, gold }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG2 : BG,
        border: `1px solid ${hover ? GOLD : (gold ? 'rgba(184,137,42,0.3)' : BORDER)}`,
        padding: '22px 20px',
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'all 0.2s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.07)' : 'none',
      }}
    >
      <div style={{ color: hover ? GOLD : (gold ? 'rgba(184,137,42,0.5)' : FAINT), display: 'flex', transition: 'color 0.2s' }}>
        <Icon d={ICONS[iconKey]} size={18} />
      </div>
      <div>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: hover ? TEXT : MUTED, fontWeight: 500, marginBottom: 5, transition: 'color 0.2s' }}>
          {text.toUpperCase()}
        </div>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT, fontWeight: 300, lineHeight: 1.5 }}>
          {subtext}
        </div>
      </div>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: GOLD, opacity: hover ? 1 : 0, transition: 'opacity 0.2s' }}>
        ACCÉDER →
      </div>
    </button>
  )
}

/* Page title block */
function PageTitle({ eyebrow, title }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>{eyebrow}</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: TEXT, margin: 0 }}>{title}</h1>
      <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12 }} />
    </div>
  )
}

/* Section label (used to split propriétaire blocks) */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
    }}>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 4, color: FAINT, whiteSpace: 'nowrap' }}>
        {children}
      </div>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  )
}

/* Modal */
function Modal({ children, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(20,15,10,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: BG, border: `1px solid ${BORDER}`, padding: '36px 32px', width: '100%', maxWidth: 400, position: 'relative' }}>
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
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, background: primary ? (hover ? '#9A7020' : GOLD) : 'transparent',
        border: primary ? 'none' : `1px solid ${hover ? MUTED : BORDER}`,
        color: primary ? BG : MUTED,
        fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
        padding: '12px 0', cursor: 'pointer', transition: 'all 0.2s',
      }}
    >{children}</button>
  )
}

const Eyebrow   = ({ children }) => <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: GOLD_L, textAlign: 'center', marginBottom: 14 }}>{children}</div>
const ModalTitle = ({ children }) => <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: TEXT, textAlign: 'center', margin: '0 0 10px' }}>{children}</h2>
const ModalBody  = ({ children }) => <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, textAlign: 'center', lineHeight: 1.8, marginBottom: 28, fontWeight: 300 }}>{children}</p>