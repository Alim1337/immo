// pages/negociations/[id].js
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BG3    = '#D8D2C6'
const BORDER = 'rgba(184,137,42,0.22)'

const STATUS_CONFIG = {
  EN_COURS:  { color: GOLD,      label: 'En cours',  canAct: true  },
  ACCEPTEE:  { color: '#2ECC71', label: 'Acceptée',  canAct: false },
  REFUSEE:   { color: '#E74C3C', label: 'Refusée',   canAct: false },
  ANNULEE:   { color: FAINT,     label: 'Annulée',   canAct: false },
  FINALISEE: { color: MUTED,     label: 'Finalisée', canAct: false },
}

export default function NegociationDetail() {
  const router = useRouter()
  const { id } = router.query
  const { user, token, ready, isLoggedIn, isClient } = useAuth()
  const bottomRef = useRef(null)

  const [neg,       setNeg]       = useState(null)
  const [messages,  setMessages]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [msgText,   setMsgText]   = useState('')
  const [sending,   setSending]   = useState(false)
  const [acting,    setActing]    = useState(false)
  const [error,     setError]     = useState('')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    if (!ready) return
    if (!isLoggedIn) { router.push('/login'); return }
    if (!id) return
    loadAll()
  }, [ready, isLoggedIn, id])

  // Poll for new messages every 5s
  useEffect(() => {
    if (!id || !token) return
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [id, token])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadAll = async () => {
    try {
      const [negRes, msgRes] = await Promise.all([
        fetch(`/api/biens/${0}`, { headers }).catch(() => null), // placeholder
        fetch(`/api/negociations/${id}/messages`, { headers }),
      ])
      // Fetch neg from negociations list
      const negsRes = await fetch('/api/negociations', { headers })
      const negsData = await negsRes.json()
      const found = (Array.isArray(negsData) ? negsData : []).find(n => n.id === parseInt(id))
      setNeg(found || null)

      const msgData = await msgRes.json()
      setMessages(Array.isArray(msgData) ? msgData : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const loadMessages = async () => {
    try {
      const res  = await fetch(`/api/negociations/${id}/messages`, { headers })
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {}
  }

  const sendMessage = async e => {
    e.preventDefault()
    if (!msgText.trim() || sending) return
    setSending(true)
    try {
      const res  = await fetch(`/api/negociations/${id}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body:    JSON.stringify({ contenu: msgText.trim() }),
      })
      const msg = await res.json()
      if (res.ok) {
        setMessages(prev => [...prev, msg])
        setMsgText('')
      }
    } catch {}
    finally { setSending(false) }
  }

  const handleAction = async (action) => {
    setActing(true)
    setError('')
    try {
      // Map action to statut
      const statutMap = { accept: 'ACCEPTEE', refuse: 'REFUSEE', cancel: 'ANNULEE', finalize: 'FINALISEE' }
      const res = await fetch(`/api/negociations/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body:    JSON.stringify({ statut: statutMap[action] }),
      })
      const data = await res.json()
      if (res.ok) setNeg(prev => ({ ...prev, statut: data.statut }))
      else setError(data.error || 'Erreur.')
    } catch {
      setError('Erreur réseau.')
    } finally {
      setActing(false)
    }
  }

  if (loading || !ready) return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 1100, margin: '80px auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 3 }}>
        <div style={{ height: 500, background: BG2, animationName: 'pulse', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        <div style={{ height: 500, background: BG2, animationName: 'pulse', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
      </div>
      <style jsx>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )

  if (!neg) return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 24 }}>Négociation introuvable</div>
        <button onClick={() => router.push('/negociations')} style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 28px', cursor: 'pointer' }}>
          MES NÉGOCIATIONS
        </button>
      </div>
    </div>
  )

  const isOwner     = user?.id === neg.proprietaire_id
  const other       = isClient ? neg.proprietaire : neg.client
  const otherName   = other?.raison_sociale || `${other?.prenom || ''} ${other?.nom || ''}`.trim()
  const statusCfg   = STATUS_CONFIG[neg.statut] || STATUS_CONFIG.EN_COURS
  const canAct      = statusCfg.canAct
  const isProprio   = !isClient

  return (
    <>
      <Head><title>Négociation — {neg.bien?.titre} — E-Krili</title></Head>
      <style jsx global>{`body { background: #EDE9E1 !important; } @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Breadcrumb ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => router.push('/negociations')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
              ← NÉGOCIATIONS
            </button>
            <span style={{ color: BORDER }}>|</span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {neg.bien?.titre}
            </span>
          </div>
        </div>

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: Chat ── */}
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 500 }}>

            {/* Chat header */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: TEXT }}>
                  {otherName}
                </div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, marginTop: 2 }}>
                  {isClient ? 'Propriétaire' : 'Client'} · {neg.bien?.ville}
                </div>
              </div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: statusCfg.color, border: `1px solid ${statusCfg.color}`, padding: '5px 12px' }}>
                {statusCfg.label.toUpperCase()}
              </div>
            </div>

            {/* Messages area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, background: BG, border: `1px solid ${BORDER}`, borderTop: 'none', borderBottom: 'none' }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: TEXT }}>Démarrez la conversation</div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT }}>Envoyez votre premier message</div>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.expediteur_id === user?.id
                  const time = new Date(msg.date_envoi).toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' })
                  const date = new Date(msg.date_envoi).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })

                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '72%' }}>
                        {!isMe && (
                          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: FAINT, marginBottom: 4, paddingLeft: 4 }}>
                            {otherName}
                          </div>
                        )}
                        <div style={{
                          background: isMe ? GOLD : BG2,
                          color:      isMe ? BG   : TEXT,
                          padding: '10px 14px',
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: 13, fontWeight: 300, lineHeight: 1.6,
                          border: `1px solid ${isMe ? 'transparent' : BORDER}`,
                        }}>
                          {msg.contenu}
                        </div>
                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 1, color: FAINT, marginTop: 4, paddingLeft: 4, paddingRight: 4, textAlign: isMe ? 'right' : 'left' }}>
                          {date} · {time} {isMe && (msg.lu ? '· Lu' : '')}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Message input */}
            {canAct ? (
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: 0, border: `1px solid ${BORDER}`, borderTop: 'none', background: BG2 }}>
                <input
                  value={msgText} onChange={e => setMsgText(e.target.value)}
                  placeholder="Écrivez votre message…"
                  style={{ flex: 1, background: 'transparent', border: 'none', fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300, color: TEXT, padding: '16px 18px', outline: 'none' }}
                />
                <button type="submit" disabled={sending || !msgText.trim()}
                  style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '0 24px', cursor: msgText.trim() ? 'pointer' : 'not-allowed', opacity: msgText.trim() ? 1 : 0.5, transition: 'opacity 0.2s', flexShrink: 0 }}>
                  {sending ? '…' : 'ENVOYER'}
                </button>
              </form>
            ) : (
              <div style={{ border: `1px solid ${BORDER}`, borderTop: 'none', padding: '14px 18px', background: BG2, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT, textAlign: 'center' }}>
                Cette négociation est {statusCfg.label.toLowerCase()} — messages désactivés
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'sticky', top: 90 }}>

            {/* Bien card */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '20px' }}>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 12 }}>BIEN CONCERNÉ</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: TEXT, marginBottom: 6 }}>{neg.bien?.titre}</div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT, marginBottom: 14 }}>{neg.bien?.ville}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: FAINT, marginBottom: 2 }}>PRIX AFFICHÉ</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: TEXT }}>{Number(neg.bien?.prix || 0).toLocaleString('fr-DZ')} DZD</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: FAINT, marginBottom: 2 }}>PRIX PROPOSÉ</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: GOLD }}>{Number(neg.prix_propose).toLocaleString('fr-DZ')} DZD</div>
                </div>
              </div>
              {neg.duree_proposee && (
                <div style={{ marginTop: 10, fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED }}>
                  Durée : {neg.duree_proposee}
                </div>
              )}
              <button onClick={() => router.push(`/biens/${neg.bien_id}`)}
                style={{ width: '100%', marginTop: 14, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}>
                VOIR LE BIEN
              </button>
            </div>

            {/* Initial message */}
            {neg.commentaire && (
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '16px 20px' }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 8 }}>MESSAGE INITIAL</div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300, color: MUTED, margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>
                  "{neg.commentaire}"
                </p>
              </div>
            )}

            {/* Actions (for owner) */}
            {isProprio && canAct && (
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '20px' }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 14 }}>ACTIONS</div>
                {error && <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: '#E74C3C', borderLeft: '2px solid #E74C3C', paddingLeft: 8, marginBottom: 12 }}>{error}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => handleAction('accept')} disabled={acting}
                    style={{ background: '#2ECC71', border: 'none', color: '#fff', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '12px', cursor: 'pointer', opacity: acting ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    ✓ ACCEPTER L'OFFRE
                  </button>
                  <button onClick={() => handleAction('refuse')} disabled={acting}
                    style={{ background: 'transparent', border: '1px solid #E74C3C', color: '#E74C3C', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '12px', cursor: 'pointer', opacity: acting ? 0.6 : 1, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#E74C3C'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E74C3C' }}>
                    ✕ REFUSER L'OFFRE
                  </button>
                </div>
              </div>
            )}

            {/* Cancel (for client, if EN_COURS) */}
            {isClient && canAct && (
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '20px' }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 14 }}>ACTIONS</div>
                <button onClick={() => handleAction('cancel')} disabled={acting}
                  style={{ width: '100%', background: 'transparent', border: `1px solid rgba(192,57,43,0.4)`, color: '#C0392B', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '12px', cursor: 'pointer', opacity: acting ? 0.6 : 1, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#C0392B'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C0392B' }}>
                  ANNULER MA DEMANDE
                </button>
              </div>
            )}

            {/* Date info */}
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, textAlign: 'center', padding: '8px 0' }}>
              Créée le {new Date(neg.date_creation).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}