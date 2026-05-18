// components/ChatMessage.js
import { useState } from 'react'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.18)'

const fmtTime = (d) => {
  if (!d) return ''
  const date = new Date(d)
  const now  = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) return date.toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

/**
 * ChatMessage — renders a single chat bubble.
 *
 * Props:
 *   message  — { id, contenu, date, lu, expediteur: { id, nom, prenom, avatar_url } }
 *   isMine   — boolean (true if the current user sent this message)
 *   showAvatar — boolean (show sender avatar, useful for first msg in a group)
 */
export default function ChatMessage({ message, isMine, showAvatar = true }) {
  const [hover, setHover] = useState(false)

  const initials = message.expediteur
    ? `${(message.expediteur.prenom || '')[0] || ''}${(message.expediteur.nom || '')[0] || ''}`.toUpperCase()
    : '?'

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:       'flex',
        flexDirection: isMine ? 'row-reverse' : 'row',
        alignItems:    'flex-end',
        gap:           10,
        marginBottom:  4,
      }}
    >
      {/* Avatar */}
      {showAvatar ? (
        <div style={{
          width: 30, height: 30, flexShrink: 0,
          background: isMine ? `rgba(184,137,42,0.15)` : BG2,
          border: `1px solid ${isMine ? 'rgba(184,137,42,0.3)' : BORDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13, color: isMine ? GOLD_L : MUTED,
          flexShrink: 0,
        }}>
          {message.expediteur?.avatar_url
            ? <img src={message.expediteur.avatar_url} alt={initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials
          }
        </div>
      ) : (
        <div style={{ width: 30, flexShrink: 0 }} />
      )}

      {/* Bubble + time */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', maxWidth: '68%' }}>
        {showAvatar && !isMine && (
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: FAINT, marginBottom: 5, paddingLeft: 2 }}>
            {message.expediteur?.prenom || message.expediteur?.nom || '—'}
          </div>
        )}

        <div style={{
          background:   isMine ? DARK : BG2,
          border:       `1px solid ${isMine ? 'rgba(184,137,42,0.2)' : BORDER}`,
          padding:      '10px 14px',
          position:     'relative',
          transition:   'box-shadow 0.15s',
          boxShadow:    hover ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
        }}>
          {/* Gold top line on own messages */}
          {isMine && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
          )}

          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize:   13,
            fontWeight: 300,
            color:      isMine ? '#F5F0E8' : TEXT,
            margin:     0,
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
            wordBreak:  'break-word',
          }}>
            {message.contenu}
          </p>
        </div>

        {/* Time + read status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, paddingLeft: 2, paddingRight: 2 }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: FAINT, letterSpacing: 0.5 }}>
            {fmtTime(message.date)}
          </span>
          {isMine && (
            <span style={{ fontSize: 10, color: message.lu ? GOLD : FAINT }}>
              {message.lu ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * DateSeparator — shown between messages on different days.
 */
export function DateSeparator({ date }) {
  const label = new Date(date).toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: FAINT, whiteSpace: 'nowrap' }}>
        {label.toUpperCase()}
      </span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  )
}

/**
 * SystemMessage — status changes (ACCEPTEE, REFUSEE, etc.)
 */
export function SystemMessage({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: GOLD, border: `1px solid rgba(184,137,42,0.25)`, padding: '4px 12px', whiteSpace: 'nowrap' }}>
        {text.toUpperCase()}
      </span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  )
}