// components/NotifBell.js
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'
const DARK   = '#1A1713'

const fmtRelative = (d) => {
  const diff = Date.now() - new Date(d).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'À l\'instant'
  if (mins  < 60) return `il y a ${mins} min`
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${days}j`
}

const TYPE_COLORS = {
  MESSAGE:     GOLD,
  NEGOCIATION: '#3D7A52',
  FAVORI:      '#C0392B',
  SYSTEME:     MUTED,
}

/**
 * NotifBell — notification bell icon with dropdown.
 *
 * Props:
 *   token — JWT string (to call the API)
 *   count — optional pre-loaded unread count
 */
export default function NotifBell({ token, count: initialCount = 0 }) {
  const router = useRouter()
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])
  const [unread, setUnread] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Poll unread count every 30s
  useEffect(() => {
    if (!token) return
    const poll = async () => {
      try {
        const res  = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        setUnread(Array.isArray(data) ? data.filter(n => !n.lu).length : 0)
      } catch {}
    }
    poll()
    const id = setInterval(poll, 30000)
    return () => clearInterval(id)
  }, [token])

  const fetchAndOpen = async () => {
    if (open) { setOpen(false); return }
    setOpen(true)
    setLoading(true)
    try {
      const res  = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setNotifs(Array.isArray(data) ? data : [])
      setUnread(0)
      // Mark all as read
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }).catch(() => {})
    } catch {}
    finally { setLoading(false) }
  }

  const handleClick = (notif) => {
    setOpen(false)
    if (notif.lien) router.push(notif.lien)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={fetchAndOpen}
        style={{
          position: 'relative', background: 'transparent', border: 'none',
          cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center',
          color: MUTED, transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = GOLD}
        onMouseLeave={e => e.currentTarget.style.color = MUTED}
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Badge */}
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            background: GOLD, color: BG,
            fontFamily: "'Raleway', sans-serif",
            fontSize: 8, fontWeight: 600,
            width: 16, height: 16, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 340, background: BG, border: `1px solid ${BORDER}`,
          boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          zIndex: 100, maxHeight: 420, overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: FAINT }}>NOTIFICATIONS</span>
            {notifs.length > 0 && (
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: GOLD, cursor: 'pointer' }}
                onClick={() => router.push('/panel')}>
                TOUT VOIR
              </span>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>
              CHARGEMENT…
            </div>
          ) : notifs.length === 0 ? (
            <div style={{ padding: '36px 18px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: TEXT, marginBottom: 8 }}>
                Tout est à jour
              </div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT }}>
                Aucune notification pour le moment.
              </div>
            </div>
          ) : (
            notifs.map(n => (
              <div key={n.id} onClick={() => handleClick(n)}
                style={{
                  padding: '14px 18px', borderBottom: `1px solid ${BORDER}`,
                  cursor: n.lien ? 'pointer' : 'default',
                  background: n.lu ? 'transparent' : 'rgba(184,137,42,0.04)',
                  transition: 'background 0.15s',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}
                onMouseEnter={e => { if (n.lien) e.currentTarget.style.background = BG2 }}
                onMouseLeave={e => e.currentTarget.style.background = n.lu ? 'transparent' : 'rgba(184,137,42,0.04)'}
              >
                {/* Type dot */}
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                  background: TYPE_COLORS[n.type] || MUTED,
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: TEXT, fontWeight: n.lu ? 300 : 500, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.titre}
                  </div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED, fontWeight: 300, lineHeight: 1.5, marginBottom: 5 }}>
                    {n.message}
                  </div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: FAINT, letterSpacing: 0.5 }}>
                    {fmtRelative(n.date_creation)}
                  </div>
                </div>

                {!n.lu && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0, marginTop: 5 }} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}