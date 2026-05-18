import React, { useState } from 'react'
import { useRouter } from 'next/router'

const GOLD    = '#B8892A'
const GOLD_L  = '#D4A84B'
const TEXT    = '#F5EFE3'
const MUTED   = 'rgba(245,239,227,0.55)'
const FAINT   = 'rgba(245,239,227,0.28)'
const SIDEBAR = '#16120D'
const BORDER  = 'rgba(184,137,42,0.18)'

const Icon = ({ d, size = 15, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  search:   'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  chat:     'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  building: 'M3 9h18M3 15h18M9 3v18M15 3v18M3 3h18v18H3z',
  plus:     'M12 5v14M5 12h14',
  user:     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  logout:   'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  chevronL: 'M15 18l-6-6 6-6',
  chevronR: 'M9 18l6-6-6-6',
}

export default function PanelSidebar({ user, canPublish, isClient, onLogout, unreadCount = 0 }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { icon: 'home',     label: 'Tableau de bord', href: '/panel'            },
    { icon: 'search',   label: 'Parcourir',        href: '/biens'        },
    { icon: 'chat',     label: 'Négociations',     href: '/negociations',    badge: unreadCount },
    ...(canPublish ? [
      { icon: 'building', label: 'Mes biens',       href: '/biens/mes-biens' },
      { icon: 'plus',     label: 'Publier un bien', href: '/biens/nouveau'   },
    ] : []),
    { icon: 'user',     label: 'Mon profil',       href: `/profil/${user?.id}` },
  ]

  const isActive = (href) =>
    router.pathname === href || router.pathname.startsWith(href + '/')

  const W = collapsed ? 64 : 220

  return (
    <aside style={{
      width: W, flexShrink: 0,
      background: SIDEBAR,
      borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column',
      minHeight: '100%',
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Top bar: brand + collapse toggle ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '14px 0' : '14px 14px 14px 18px',
        borderBottom: `1px solid ${BORDER}`,
        flexShrink: 0,
        minHeight: 56,
      }}>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: GOLD_L, letterSpacing: 2, whiteSpace: 'nowrap' }}>
              E-KRILI
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 7, letterSpacing: 3, color: 'rgba(212,168,75,0.4)', marginTop: 2, whiteSpace: 'nowrap' }}>
              IMMOBILIER DE PRESTIGE
            </div>
          </div>
        )}
        <CollapseBtn collapsed={collapsed} onClick={() => setCollapsed(c => !c)} />
      </div>

      {/* ── User identity ── */}
      {!collapsed ? (
        <div style={{
          padding: '18px 18px 16px',
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}>
          <div style={{
            width: 38, height: 38,
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_L} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: '#fff' }}>
              {(user?.prenom?.[0] || user?.raison_sociale?.[0] || '?').toUpperCase()}
            </span>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 400, color: TEXT, lineHeight: 1.25, marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.raison_sociale || `${user?.prenom || ''} ${user?.nom || ''}`.trim()}
          </div>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 7, letterSpacing: 3, color: GOLD }}>
            {{ CLIENT: 'CLIENT', PROPRIETAIRE: 'PROPRIÉTAIRE', AGENCE: 'AGENCE' }[user?.role] || 'MEMBRE'}
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32,
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_L} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 400, color: '#fff' }}>
              {(user?.prenom?.[0] || user?.raison_sociale?.[0] || '?').toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* ── Nav items ── */}
<nav style={{ padding: '10px 0', overflow: 'hidden' }}>
          {navItems.map(item => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={isActive(item.href)}
            collapsed={collapsed}
            onClick={() => router.push(item.href)}
          />
        ))}
      </nav>

      {/* ── Bottom: logout ── */}
<div style={{ borderTop: `1px solid ${BORDER}`, flexShrink: 0, marginBottom: 32 }}>
          <NavItem
          icon="logout"
          label="Déconnexion"
          active={false}
          collapsed={collapsed}
          onClick={onLogout}
          danger
        />
      </div>
    </aside>
  )
}

function CollapseBtn({ collapsed, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={collapsed ? 'Développer' : 'Réduire'}
      style={{
        width: 28, height: 28,
        background: hover ? 'rgba(184,137,42,0.18)' : 'rgba(184,137,42,0.08)',
        border: `1px solid ${hover ? 'rgba(184,137,42,0.45)' : 'rgba(184,137,42,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        color: hover ? GOLD_L : 'rgba(212,168,75,0.45)',
        transition: 'all 0.2s',
      }}
    >
      <Icon d={collapsed ? ICONS.chevronR : ICONS.chevronL} size={13} stroke="currentColor" />
    </button>
  )
}

function NavItem({ icon, label, badge, active, collapsed, onClick, danger }) {
  const [hover, setHover] = useState(false)

  const color = danger
    ? (hover ? 'rgba(210,100,100,0.85)' : 'rgba(200,90,90,0.5)')
    : active
      ? GOLD
      : hover
        ? MUTED
        : FAINT

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={collapsed ? label : undefined}
        style={{
          width: '100%',
          background: active
            ? 'rgba(184,137,42,0.1)'
            : hover
              ? (danger ? 'rgba(180,60,60,0.07)' : 'rgba(184,137,42,0.05)')
              : 'none',
          border: 'none',
          borderLeft: `2px solid ${active ? GOLD : 'transparent'}`,
          padding: collapsed ? '12px 0' : '11px 18px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 11, cursor: 'pointer',
          transition: 'all 0.15s',
          textAlign: 'left',
        }}
      >
        <span style={{ color, flexShrink: 0, transition: 'color 0.15s', display: 'flex' }}>
          <Icon d={ICONS[icon]} size={15} stroke={color} />
        </span>

        {!collapsed && (
          <span style={{
            fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2.5,
            color, transition: 'color 0.15s', whiteSpace: 'nowrap', textTransform: 'uppercase',
          }}>
            {label}
          </span>
        )}

        {badge > 0 && !collapsed && (
          <span style={{
            marginLeft: 'auto',
            background: GOLD, color: '#1A1713',
            fontFamily: "'Raleway', sans-serif", fontSize: 8, fontWeight: 700,
            minWidth: 17, height: 17,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', flexShrink: 0,
          }}>
            {badge}
          </span>
        )}

        {badge > 0 && collapsed && (
          <span style={{
            position: 'absolute', top: 7, right: 9,
            background: GOLD, color: '#1A1713',
            fontFamily: "'Raleway', sans-serif", fontSize: 7, fontWeight: 700,
            minWidth: 14, height: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px',
          }}>
            {badge}
          </span>
        )}
      </button>

      {/* Tooltip when collapsed */}
      {collapsed && hover && (
        <div style={{
          position: 'absolute', left: 70, top: '50%', transform: 'translateY(-50%)',
          background: '#2A2218', color: GOLD_L,
          fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2,
          padding: '7px 12px',
          border: `1px solid rgba(184,137,42,0.3)`,
          whiteSpace: 'nowrap', zIndex: 100, pointerEvents: 'none',
          textTransform: 'uppercase',
        }}>
          {label}
        </div>
      )}
    </div>
  )
}