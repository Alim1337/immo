// pages/panel.js
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import PanelSidebar from '@/components/PanelSidebar'
import { useAuth } from '@/hooks/useAuth'

// ── Design tokens — LIGHT PANEL + DARK SIDEBAR ───────────────────────────────
const GOLD      = '#B8892A'
const GOLD_L    = '#D4A84B'
const GOLD_DIM  = 'rgba(184,137,42,0.6)'
const GOLD_GLOW = 'rgba(184,137,42,0.1)'
const BG_PAGE   = '#F5F0E8'   // warm linen — main panel
const BG_HEADER = '#FAF7F2'   // slightly lighter for header strip
const BG_CARD   = '#EDE9E1'   // warm card
const BG_CARD2  = '#E4DFD5'   // card hover
const BG_HOVER  = '#DDD8CF'
const TEXT_1    = '#1A1713'
const TEXT_2    = '#5A5248'
const TEXT_3    = '#8A8278'
const BORDER    = 'rgba(184,137,42,0.18)'
const BORDER_H  = 'rgba(184,137,42,0.5)'
const BORDER_S  = 'rgba(184,137,42,0.08)'
const GREEN     = '#3D7A52'
const GREEN_BG  = 'rgba(61,122,82,0.1)'
const RED       = '#A04040'
const RED_BG    = 'rgba(160,64,64,0.1)'

const Icon = ({ d, size = 14, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const ICONS = {
  arrow:  'M5 12h14M12 5l7 7-7 7',
  plus:   'M12 5v14M5 12h14',
  home:   'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  chat:   'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  user:   'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  star:   'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  trend:  'M23 6l-9.5 9.5-5-5L1 18',
}

const STATUS = {
  EN_COURS:  { label: 'En cours',  color: GOLD,   bg: GOLD_GLOW  },
  ACCEPTEE:  { label: 'Acceptée',  color: GREEN,  bg: GREEN_BG   },
  REFUSEE:   { label: 'Refusée',   color: RED,    bg: RED_BG     },
  ANNULEE:   { label: 'Annulée',   color: TEXT_3, bg: BORDER_S   },
  FINALISEE: { label: 'Finalisée', color: TEXT_2, bg: BORDER_S   },
}

function StatusPill({ statut }) {
  const m = STATUS[statut] || { label: statut, color: TEXT_3, bg: BORDER_S }
  return (
    <span style={{
      fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 2.5,
      color: m.color, background: m.bg, padding: '4px 10px',
      border: `1px solid ${m.color}33`, whiteSpace: 'nowrap',
    }}>{m.label.toUpperCase()}</span>
  )
}

function SectionTitle({ children, action, onAction }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 18 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
        <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 4, color: TEXT_3, fontWeight: 500 }}>
          {children}
        </span>
        <div style={{ width: 28, height: 1, background: BORDER }} />
        <div style={{ width: 3, height: 3, background: GOLD, transform:'rotate(45deg)', opacity: 0.6 }} />
      </div>
      {action && (
        <button onClick={onAction} style={{
          background:'none', border:'none', fontFamily:"'Raleway',sans-serif",
          fontSize: 8, letterSpacing: 3, color: GOLD_DIM, cursor:'pointer', padding: 0,
          display:'flex', alignItems:'center', gap: 6, transition:'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = GOLD}
          onMouseLeave={e => e.currentTarget.style.color = GOLD_DIM}
        >
          {action} <Icon d={ICONS.arrow} size={10} />
        </button>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, accentColor, onClick }) {
  const [hover, setHover] = useState(false)
  const ac = accentColor || GOLD
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG_CARD2 : BG_CARD,
        border: `1px solid ${hover ? ac + '66' : BORDER}`,
        padding: '0 0 20px',
        cursor: 'pointer',
        transition: 'all 0.22s',
        boxShadow: hover ? `0 8px 32px rgba(26,23,19,0.1)` : 'none',
        transform: hover ? 'translateY(-3px)' : 'none',
        overflow: 'hidden', position: 'relative',
      }}
    >
      <div style={{
        height: 2,
        background: hover
          ? `linear-gradient(to right, ${ac}, ${ac}66, transparent)`
          : `linear-gradient(to right, ${ac}55, ${ac}22, transparent)`,
        marginBottom: 20, transition: 'all 0.3s',
      }} />
      <div style={{ padding: '0 20px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 10 }}>
          <div style={{
            fontFamily:"'Cormorant Garamond',serif", fontSize: 52, fontWeight: 300,
            color: hover ? ac : TEXT_1, lineHeight: 1, transition: 'color 0.22s',
          }}>
            {value ?? '—'}
          </div>
          <div style={{
            width: 34, height: 34,
            background: hover ? `${ac}18` : BORDER_S,
            border: `1px solid ${hover ? ac + '44' : BORDER}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all 0.22s', marginTop: 4,
          }}>
            <Icon d={icon} size={14} stroke={hover ? ac : TEXT_3} />
          </div>
        </div>
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 3, color: hover ? TEXT_2 : TEXT_3, transition:'color 0.22s' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ icon, label, href, router, highlight }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={() => router.push(href)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? (highlight ? `rgba(184,137,42,0.14)` : BG_CARD2)
          : (highlight ? GOLD_GLOW : BG_CARD),
        border: `1px solid ${hover ? (highlight ? GOLD + 'AA' : BORDER_H) : (highlight ? GOLD + '44' : BORDER)}`,
        padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: 12,
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 6px 20px rgba(26,23,19,0.08)' : 'none',
      }}
    >
      <div style={{
        width: 30, height: 30,
        background: hover ? (highlight ? `${GOLD}33` : `${GOLD}14`) : BORDER_S,
        border: `1px solid ${hover ? GOLD + '55' : BORDER}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all 0.2s', flexShrink: 0,
      }}>
        <Icon d={ICONS[icon] || ICONS.home} size={13} stroke={hover ? GOLD : TEXT_3} />
      </div>
      <span style={{
        fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 2,
        color: hover ? (highlight ? GOLD : TEXT_1) : TEXT_2,
        transition:'color 0.2s', fontWeight: hover ? 500 : 300,
      }}>
        {label.toUpperCase()}
      </span>
    </button>
  )
}

function Initials({ name, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      background: `${GOLD}18`, border: `1px solid ${GOLD}44`,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: size * 0.42, fontWeight: 400, color: GOLD }}>
        {name?.trim()?.[0]?.toUpperCase() || '?'}
      </span>
    </div>
  )
}

function NegRow({ neg, otherName, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG_CARD2 : BG_CARD,
        border: `1px solid ${hover ? BORDER_H : BORDER}`,
        padding: '15px 20px', cursor: 'pointer',
        display:'flex', alignItems:'center', gap: 14, transition:'all 0.18s',
        boxShadow: hover ? '0 4px 16px rgba(26,23,19,0.08)' : 'none',
      }}
    >
      <Initials name={otherName} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif", fontSize: 16,
          color: hover ? TEXT_1 : TEXT_2, marginBottom: 3,
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', transition:'color 0.18s',
        }}>
          {neg.bien?.titre || '—'}
        </div>
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 10, color: TEXT_3, letterSpacing: 0.5 }}>
          avec <span style={{ color: TEXT_2 }}>{otherName}</span>
          {' · '}
          <span style={{ color: GOLD }}>{Number(neg.prix_propose).toLocaleString('fr-DZ')} DZD</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap: 12, flexShrink: 0 }}>
        <StatusPill statut={neg.statut} />
        <span style={{ color: hover ? GOLD : TEXT_3, fontSize: 16, transition:'color 0.18s' }}>→</span>
      </div>
    </div>
  )
}

function BienCard({ bien, onClick }) {
  const [hover, setHover] = useState(false)
  const avail = bien.etat === 'DISPONIBLE'
  const ac = avail ? GREEN : TEXT_3
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG_CARD2 : BG_CARD,
        border: `1px solid ${hover ? BORDER_H : BORDER}`,
        cursor: 'pointer', transition:'all 0.2s', overflow:'hidden',
        boxShadow: hover ? '0 10px 30px rgba(26,23,19,0.1)' : 'none',
        transform: hover ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{ height: 2, background: `linear-gradient(to right, ${ac}, ${ac}55, transparent)` }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif", fontSize: 16,
          color: hover ? TEXT_1 : TEXT_2, marginBottom: 3, lineHeight: 1.3, transition:'color 0.2s',
        }}>
          {bien.titre}
        </div>
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 9, color: TEXT_3, letterSpacing: 1, marginBottom: 14 }}>
          {bien.ville}, {bien.wilaya}
        </div>
        <div style={{ height: 1, background: BORDER, marginBottom: 12 }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 16, color: GOLD }}>
            {Number(bien.prix).toLocaleString('fr-DZ')} <span style={{ fontSize: 10, color: GOLD_DIM }}>DZD</span>
          </div>
          <span style={{
            fontFamily:"'Raleway',sans-serif", fontSize: 7, letterSpacing: 2,
            color: ac, background: `${ac}14`, padding: '3px 8px', border: `1px solid ${ac}33`,
          }}>
            {avail ? 'DISPONIBLE' : bien.etat}
          </span>
        </div>
      </div>
    </div>
  )
}

function PublishBtn({ onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? GOLD_L : GOLD, border: 'none', color: '#FAF7F2',
        fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 3, fontWeight: 500,
        padding: '13px 26px', cursor: 'pointer',
        transition:'background 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? `0 6px 24px ${GOLD}44` : `0 2px 8px ${GOLD}22`,
        display:'flex', alignItems:'center', gap: 9,
      }}
    >
      <Icon d={ICONS.plus} size={11} stroke="#FAF7F2" />
      PUBLIER UN BIEN
    </button>
  )
}

function EmptyState({ label }) {
  return (
    <div style={{ padding:'32px 0', display:'flex', alignItems:'center', gap: 14, borderTop:`1px solid ${BORDER}` }}>
      <div style={{ width: 24, height: 1, background: BORDER }} />
      <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 11, color: TEXT_3, letterSpacing: 0.5 }}>{label}</span>
    </div>
  )
}

function DemandeRow({ demande, isOwner, onAccept, onRefuse, onViewBien }) {
  const [hover,   setHover]   = useState(false)
  const [acting,  setActing]  = useState(false)

  const STATUT_COLORS = {
    EN_ATTENTE: { color: GOLD,   bg: GOLD_GLOW },
    ACCEPTEE:   { color: GREEN,  bg: GREEN_BG  },
    REFUSEE:    { color: RED,    bg: RED_BG    },
    ANNULEE:    { color: TEXT_3, bg: BORDER_S  },
  }
  const sc = STATUT_COLORS[demande.statut] || { color: TEXT_3, bg: BORDER_S }

  const otherName = isOwner
    ? `${demande.client?.prenom || ''} ${demande.client?.nom || ''}`.trim()
    : (demande.proprietaire?.raison_sociale || `${demande.proprietaire?.prenom || ''} ${demande.proprietaire?.nom || ''}`.trim())

  const handleAct = async (action) => {
    setActing(true)
    await action()
    setActing(false)
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background:  hover ? BG_CARD2 : BG_CARD,
        border:     `1px solid ${hover ? BORDER_H : BORDER}`,
        padding:    '14px 20px',
        display:    'flex', alignItems: 'center', gap: 14,
        transition: 'all 0.18s',
        boxShadow:   hover ? '0 4px 16px rgba(26,23,19,0.08)' : 'none',
      }}
    >
      <Initials name={otherName} size={36} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif", fontSize: 15,
          color: hover ? TEXT_1 : TEXT_2, marginBottom: 3,
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', transition:'color 0.18s',
        }}>
          {demande.bien?.titre || '—'}
        </div>
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 10, color: TEXT_3 }}>
          {isOwner ? `Client : ${otherName}` : `Propriétaire : ${otherName}`}
          {demande.type && <span style={{ marginLeft: 8, color: GOLD_DIM }}>· {demande.type}</span>}
        </div>
        {demande.message && (
          <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 10, color: TEXT_3, marginTop: 2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth: 400 }}>
            {demande.message}
          </div>
        )}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap: 8, flexShrink: 0 }}>
        {/* Status pill */}
        <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 2, color: sc.color, background: sc.bg, border:`1px solid ${sc.color}33`, padding:'3px 9px', whiteSpace:'nowrap' }}>
          {(demande.statut || '').replace('_', ' ')}
        </span>

        {/* View bien button */}
        <button onClick={onViewBien}
          style={{ background:'transparent', border:`1px solid ${BORDER}`, color: TEXT_2, fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 2, padding:'6px 10px', cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXT_2 }}
        >
          VOIR LE BIEN
        </button>

        {/* Accept / Refuse — only for owner on pending demandes */}
        {isOwner && demande.statut === 'EN_ATTENTE' && (
          <>
            <button onClick={() => handleAct(onAccept)} disabled={acting}
              style={{ background: GREEN_BG, border:`1px solid ${GREEN}55`, color: GREEN, fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 2, padding:'6px 12px', cursor: acting ? 'not-allowed' : 'pointer', transition:'all 0.15s', opacity: acting ? 0.6 : 1 }}
              onMouseEnter={e => { if (!acting) e.currentTarget.style.background = 'rgba(61,122,82,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = GREEN_BG }}
            >
              ACCEPTER
            </button>
            <button onClick={() => handleAct(onRefuse)} disabled={acting}
              style={{ background: RED_BG, border:`1px solid ${RED}55`, color: RED, fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 2, padding:'6px 12px', cursor: acting ? 'not-allowed' : 'pointer', transition:'all 0.15s', opacity: acting ? 0.6 : 1 }}
              onMouseEnter={e => { if (!acting) e.currentTarget.style.background = 'rgba(160,64,64,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = RED_BG }}
            >
              REFUSER
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Panel() {
  const router = useRouter()
  const { user, token, ready, isLoggedIn, isClient, canPublish, logout } = useAuth()
  const [stats,    setStats]    = useState(null)
  const [biens,    setBiens]    = useState([])
  const [negs,     setNegs]     = useState([])
  const [demandes, setDemandes] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!ready) return
    if (!isLoggedIn) { router.push('/login'); return }
    fetchData()
  }, [ready, isLoggedIn]) // eslint-disable-line

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const [negsRes, biensRes, demandesRes] = await Promise.all([
        fetch('/api/negociations', { headers }),
        canPublish ? fetch(`/api/biens?proprietaire_id=${user.id}`, { headers }) : Promise.resolve(null),
        fetch('/api/demandes', { headers }),
      ])
      const negsData     = await negsRes.json()
      const biensData    = biensRes ? await biensRes.json() : { biens: [] }
      const demandesData = await demandesRes.json()

      const negsList     = Array.isArray(negsData) ? negsData : (negsData.negociations || [])
      const biensList    = biensData.biens || []
      const demandesList = Array.isArray(demandesData) ? demandesData : []

      setNegs(negsList)
      setBiens(biensList)
      setDemandes(demandesList)
      setStats({
        negs_en_cours:       negsList.filter(n => n.statut === 'EN_COURS').length,
        biens_actifs:        biensList.filter(b => b.etat === 'DISPONIBLE').length,
        messages_non_lus:    negsList.flatMap(n => n.messages || []).filter(m => !m.lu && m.expediteur_id !== user.id).length,
        demandes_en_attente: demandesList.filter(d => d.statut === 'EN_ATTENTE').length,
      })
    } catch(e) { console.error(e) }
    finally    { setLoading(false) }
  }

  const handleDemandeAction = async (demandeId, statut) => {
    const res = await fetch(`/api/demandes/${demandeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut }),
    })
    const data = await res.json()
    if (res.ok) {
      setDemandes(d => d.map(x => x.id === demandeId ? { ...x, statut } : x))
      // refresh stats
      setStats(s => ({ ...s, demandes_en_attente: Math.max(0, (s?.demandes_en_attente || 1) - 1) }))
      // if accepted and a negotiation was created, navigate to it
      if (statut === 'ACCEPTEE' && data.negociation_id) {
        router.push(`/negociations/${data.negociation_id}`)
      }
    }
  }

  const handleLogout = () => { logout(); router.push('/') }

  if (!ready || loading) return (
    <div style={{ background: BG_PAGE, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap: 20 }}>
      <div style={{ width: 36, height: 36, border: `1px solid ${GOLD}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.9s linear infinite' }} />
      <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 5, color: TEXT_3 }}>CHARGEMENT…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const displayName = user?.raison_sociale || `${user?.prenom || ''} ${user?.nom || ''}`.trim()
  const unreadCount = stats?.messages_non_lus ?? 0
  const roleLabel   = { CLIENT:'CLIENT', PROPRIETAIRE:'PROPRIÉTAIRE', AGENCE:'AGENCE' }[user?.role] || 'MEMBRE'

  return (
    <>
      <Head><title>Tableau de bord — E-Krili</title></Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@300;400;500;600&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #E4DFD5; }
        ::-webkit-scrollbar-thumb { background: ${GOLD}66; }
        ::-webkit-scrollbar-thumb:hover { background: ${GOLD}; }
      `}</style>

      <div style={{ background: BG_PAGE, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        <Header />
        <div style={{ display:'flex', flex: 1, minHeight: 0 }}>

          <PanelSidebar
            user={user}
            canPublish={canPublish}
            isClient={isClient}
            onLogout={handleLogout}
            unreadCount={unreadCount}
          />

          {/* ── Main content ── */}
          <div style={{ flex: 1, minWidth: 0, overflowY:'auto', background: BG_PAGE }}>

            {/* Hero header */}
            <div style={{
              background: BG_HEADER,
              borderBottom: `1px solid ${BORDER}`,
              padding: '32px 48px 28px',
              position: 'relative', overflow:'hidden',
            }}>
              {/* Subtle gold top line */}
              <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: 2, background:`linear-gradient(to right, ${GOLD}, ${GOLD}44, transparent)`, pointerEvents:'none' }} />

              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', animation:'fadeUp 0.45s ease both' }}>
                <div>
                  <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 5, color: GOLD, marginBottom: 8, fontWeight: 500 }}>
                    {roleLabel}
                  </div>
                  <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 38, fontWeight: 300, color: TEXT_1, margin: 0, lineHeight: 1, marginBottom: 14 }}>
                    Bonjour, <span style={{ fontStyle:'italic', color: GOLD }}>{displayName}</span>
                  </h1>
                  <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                    <div style={{ width: 36, height: 1, background:`linear-gradient(to right, ${GOLD}, transparent)` }} />
                    <div style={{ width: 4, height: 4, background: GOLD, transform:'rotate(45deg)' }} />
                    <div style={{ width: 14, height: 1, background: BORDER }} />
                  </div>
                </div>
                {canPublish && <PublishBtn onClick={() => router.push('/biens/nouveau')} />}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding:'40px 48px 80px', animation:'fadeUp 0.5s 0.08s ease both' }}>

              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(175px, 1fr))', gap: 10, marginBottom: 52 }}>
                <StatCard label="NÉGOCIATIONS ACTIVES"   value={stats?.negs_en_cours ?? 0}          icon={ICONS.chat}  accentColor={GOLD}                                    onClick={() => router.push('/negociations')} />
                {canPublish && <StatCard label="BIENS DISPONIBLES"    value={stats?.biens_actifs ?? 0}       icon={ICONS.home}  accentColor={GREEN}                                   onClick={() => router.push('/biens/mes-biens')} />}
                {canPublish && <StatCard label="DEMANDES EN ATTENTE"  value={stats?.demandes_en_attente ?? 0} icon={ICONS.trend} accentColor={stats?.demandes_en_attente > 0 ? RED : GOLD_DIM} onClick={() => router.push('/demandes')} />}
                <StatCard label="MESSAGES NON LUS"        value={unreadCount}                        icon={ICONS.chat}  accentColor={unreadCount > 0 ? RED : GOLD_DIM}        onClick={() => router.push('/negociations')} />
                {!canPublish && <StatCard label="BIENS SAUVEGARDÉS"   value="—"                      icon={ICONS.star}  accentColor={GOLD_DIM}                               onClick={() => router.push('/favoris')} />}
              </div>

              {/* Quick actions */}
              <div style={{ marginBottom: 52 }}>
                <SectionTitle>ACCÈS RAPIDE</SectionTitle>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(195px, 1fr))', gap: 6 }}>
                  <ActionBtn icon="search" label="Parcourir les biens" href="/biens"                 router={router} />
                  <ActionBtn icon="chat"   label="Mes négociations"    href="/negociations"           router={router} />
                  {canPublish && <>
                    <ActionBtn icon="home"  label="Gérer mes biens"    href="/biens/mes-biens"        router={router} />
                    <ActionBtn icon="plus"  label="Publier un bien"    href="/biens/nouveau"          router={router} highlight />
                    <ActionBtn icon="trend" label="Demandes clients"   href="/demandes"               router={router} highlight={stats?.demandes_en_attente > 0} />
                  </>}
                  <ActionBtn icon="user"  label="Mon profil"           href={`/profil/${user?.id}`}   router={router} />
                  {isClient && <ActionBtn icon="trend" label="Mes demandes" href="/demandes"          router={router} />}
                </div>
              </div>

              <div style={{ height: 1, background:`linear-gradient(to right, ${BORDER}, transparent)`, marginBottom: 52 }} />

              {/* Recent negotiations */}
              <div style={{ marginBottom: 52 }}>
                <SectionTitle action="VOIR TOUT" onAction={() => router.push('/negociations')}>NÉGOCIATIONS RÉCENTES</SectionTitle>
                {negs.length === 0
                  ? <EmptyState label="Aucune négociation pour le moment." />
                  : (
                    <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
                      {negs.slice(0, 5).map(n => {
                        const other     = isClient ? n.proprietaire : n.client
                        const otherName = other?.raison_sociale || `${other?.prenom || ''} ${other?.nom || ''}`.trim()
                        return <NegRow key={n.id} neg={n} otherName={otherName} onClick={() => router.push(`/negociations/${n.id}`)} />
                      })}
                    </div>
                  )
                }
              </div>

              {/* ── Demandes section — visible to PROPRIETAIRE/AGENCE ── */}
              {canPublish && (
                <div style={{ marginBottom: 52 }}>
                  <SectionTitle action="VOIR TOUT" onAction={() => router.push('/demandes')}>
                    DEMANDES DE CLIENTS
                    {stats?.demandes_en_attente > 0 && (
                      <span style={{ marginLeft: 8, background: RED, color: '#fff', fontFamily:"'Raleway',sans-serif", fontSize: 8, padding: '2px 7px', letterSpacing: 2 }}>
                        {stats.demandes_en_attente} NOUVELLE{stats.demandes_en_attente > 1 ? 'S' : ''}
                      </span>
                    )}
                  </SectionTitle>
                  {demandes.length === 0
                    ? <EmptyState label="Aucune demande de client pour le moment." />
                    : (
                      <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
                        {demandes.slice(0, 5).map(d => (
                          <DemandeRow
                            key={d.id}
                            demande={d}
                            isOwner={true}
                            onAccept={() => handleDemandeAction(d.id, 'ACCEPTEE')}
                            onRefuse={() => handleDemandeAction(d.id, 'REFUSEE')}
                            onViewBien={() => router.push(`/biens/${d.bien_id}`)}
                          />
                        ))}
                      </div>
                    )
                  }
                </div>
              )}

              {/* ── Demandes section — visible to CLIENT (their own requests) ── */}
              {isClient && demandes.length > 0 && (
                <div style={{ marginBottom: 52 }}>
                  <SectionTitle action="VOIR TOUT" onAction={() => router.push('/demandes')}>MES DEMANDES</SectionTitle>
                  <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
                    {demandes.slice(0, 3).map(d => (
                      <DemandeRow
                        key={d.id}
                        demande={d}
                        isOwner={false}
                        onViewBien={() => router.push(`/biens/${d.bien_id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent biens */}
              {canPublish && biens.length > 0 && (
                <div>
                  <SectionTitle action="GÉRER TOUT" onAction={() => router.push('/biens/mes-biens')}>MES BIENS RÉCENTS</SectionTitle>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                    {biens.slice(0, 4).map(b => <BienCard key={b.id} bien={b} onClick={() => router.push(`/biens/${b.id}`)} />)}
                  </div>
                </div>
              )}

              {/* Client CTA */}
              {isClient && negs.length === 0 && (
                <div style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
                  padding: '22px 26px',
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap: 24, marginTop: 8,
                }}>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 20, color: TEXT_1, marginBottom: 5 }}>
                      Commencez votre recherche
                    </div>
                    <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 11, color: TEXT_3, fontWeight: 300 }}>
                      Parcourez nos biens et entamez une négociation.
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/biens')}
                    style={{
                      background: GOLD, border:'none', color:'#FAF7F2',
                      fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 3, fontWeight: 500,
                      padding: '12px 22px', cursor:'pointer', flexShrink: 0, transition:'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = GOLD_L}
                    onMouseLeave={e => e.currentTarget.style.background = GOLD}
                  >PARCOURIR →</button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}