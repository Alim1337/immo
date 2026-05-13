import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import Header from '@/components/Header'
import Form_Demande_Client from '@/components/Form_Demande_Client'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.22)'

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  user:      'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  list:      'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
  edit:      'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  star:      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  back:      'M19 12H5M12 5l-7 7 7 7',
}

const MENUS = [
  { title: 'Tableau de bord', iconKey: 'dashboard', href: '/panel' },
  { title: 'Profil',          iconKey: 'user',      href: '/Gestion_Profile_Proprietaire' },
  { title: 'Mes demandes',    iconKey: 'list',      href: '/Modifier_Demande_Client' },
  { title: 'Devenir VIP',     iconKey: 'star',      vip: true },
  { title: 'Paramètres',      iconKey: 'settings',  href: '/settings' },
]

export default function DemandeClient() {
  const router = useRouter()
  const [clientName, setClientName]   = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientId, setClientId]       = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showVIP, setShowVIP]         = useState(false)
  const [submitting, setSubmitting]   = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login_client'); return }
    const decoded = jwt.decode(token)
    if (decoded) {
      setClientName(decoded.nom || '')
      setClientEmail(decoded.email || '')
      setClientId(decoded.userType === 'client' ? decoded.id : decoded.id_client)
    }
  }, [])

  async function handleSubmit(type_bien, prix_minimum, prix_maximum, surface_minimum, nbr_chambre_minimum, date_debut_rechercher) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/api_insert_demande_client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ type_bien, prix_minimum, prix_maximum, surface_minimum, nbr_chambre_minimum, date_debut_rechercher, id: clientId }),
      })
      if (res.ok) {
        toast.success('Demande soumise avec succès !', { position: 'top-center' })
        setTimeout(() => router.push('/panel'), 1500)
      } else {
        toast.error('Erreur lors de la soumission.', { position: 'top-center' })
      }
    } catch {
      toast.error('Erreur réseau.', { position: 'top-center' })
    }
    setSubmitting(false)
  }

  const initials = clientName
    ? clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
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
        }}>

          {/* User block */}
          <div style={{
            padding: '24px 16px 18px',
            borderBottom: `1px solid rgba(184,137,42,0.12)`,
            display: 'flex', alignItems: 'center', gap: 10,
            overflow: 'hidden', whiteSpace: 'nowrap',
          }}>
            <div style={{
              width: 34, height: 34, flexShrink: 0,
              background: 'rgba(184,137,42,0.12)',
              border: `1px solid rgba(184,137,42,0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: GOLD_L,
            }}>{initials}</div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 500, color: '#F5F0E8', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {clientName || 'Utilisateur'}
                </div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {clientEmail}
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
            {MENUS.map((item, i) => (
              <SidebarItem
                key={i}
                item={item}
                collapsed={!sidebarOpen}
                active={false}
                onClick={() => {
                  if (item.vip) { setShowVIP(true); return }
                  if (item.href) router.push(item.href)
                }}
              />
            ))}
          </nav>

          {/* Toggle button at bottom */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center',
              gap: 8, padding: '14px 16px',
              borderTop: `1px solid rgba(184,137,42,0.12)`,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.25)', width: '100%',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          >
            <span style={{ display: 'flex', transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }}>
              <Icon d="M15 18l-6-6 6-6" size={14} />
            </span>
            {sidebarOpen && (
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, whiteSpace: 'nowrap' }}>
                RÉDUIRE
              </span>
            )}
          </button>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '48px 64px 64px' }}>

          {/* Breadcrumb */}
          <button
            onClick={() => router.push('/panel')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Raleway', sans-serif", fontSize: 9,
              letterSpacing: 2, color: FAINT, marginBottom: 40,
              padding: 0, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD}
            onMouseLeave={e => e.currentTarget.style.color = FAINT}
          >
            <Icon d={ICONS.back} size={12} />
            TABLEAU DE BORD
          </button>

          {/* Page header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>
              ESPACE CLIENT
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: TEXT, margin: 0 }}>
              Demande personnalisée
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 14 }} />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, fontWeight: 300, letterSpacing: 0.3, margin: '14px 0 0', lineHeight: 1.8 }}>
              Définissez vos critères et nous trouverons le bien qui vous correspond.
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: BG2,
            border: `1px solid ${BORDER}`,
            maxWidth: 680,
            padding: '40px 48px',
          }}>
            <Form_Demande_Client onSubmit={handleSubmit} submitting={submitting} />
          </div>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 20, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT }}>
              © {new Date().getFullYear()} E-KRILI — IMMOBILIER DE PRESTIGE
            </span>
          </div>
        </main>
      </div>

      {/* VIP Modal */}
      {showVIP && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,15,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowVIP(false) }}>
          <div style={{ background: BG, border: `1px solid ${BORDER}`, padding: '36px 32px', width: '100%', maxWidth: 380, position: 'relative' }}>
            <button onClick={() => setShowVIP(false)} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', fontSize: 18, color: FAINT, cursor: 'pointer' }}>×</button>
            <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, marginBottom: 24 }} />
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: GOLD_L, textAlign: 'center', marginBottom: 14 }}>★ STATUT VIP</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: TEXT, textAlign: 'center', margin: '0 0 12px' }}>Activer votre accès VIP</h2>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, textAlign: 'center', lineHeight: 1.8, marginBottom: 28 }}>
              Débloquez la collection prestige et publiez des annonces VIP.
            </p>
            <button
              onClick={() => router.push('/Vip')}
              style={{ width: '100%', background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '14px', cursor: 'pointer' }}
            >
              DÉCOUVRIR VIP
            </button>
          </div>
        </div>
      )}

      <ToastContainer toastStyle={{ background: BG2, color: TEXT, border: `1px solid ${BORDER}` }} />
    </div>
  )
}

function SidebarItem({ item, collapsed, active, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center',
        gap: 10,
        padding: collapsed ? '11px 0' : '11px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active ? 'rgba(184,137,42,0.1)' : hover ? 'rgba(184,137,42,0.06)' : 'transparent',
        border: 'none',
        borderLeft: `2px solid ${active ? GOLD : hover ? 'rgba(184,137,42,0.4)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.18s',
        color: active ? GOLD_L : item.vip ? GOLD_L : hover ? '#F5F0E8' : 'rgba(255,255,255,0.38)',
        whiteSpace: 'nowrap', overflow: 'hidden',
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>
        <Icon d={ICONS[item.iconKey]} size={15} />
      </span>
      {!collapsed && (
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, fontWeight: item.vip ? 500 : 400 }}>
          {item.title.toUpperCase()}
        </span>
      )}
    </button>
  )
}