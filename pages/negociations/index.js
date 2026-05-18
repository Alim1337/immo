// pages/negociations/index.js
import React, { useState, useEffect } from 'react'
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
const BORDER = 'rgba(184,137,42,0.22)'

const STATUS_COLORS = {
  EN_COURS:  { color: GOLD,      label: 'En cours' },
  ACCEPTEE:  { color: '#2ECC71', label: 'Acceptée' },
  REFUSEE:   { color: '#E74C3C', label: 'Refusée'  },
  ANNULEE:   { color: FAINT,     label: 'Annulée'  },
  FINALISEE: { color: MUTED,     label: 'Finalisée'},
}

const FILTERS = ['Toutes', 'En cours', 'Acceptée', 'Refusée', 'Finalisée']

export default function NegociationsIndex() {
  const router = useRouter()
  const { user, token, ready, isLoggedIn, isClient } = useAuth()

  const [negs,    setNegs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('Toutes')

  useEffect(() => {
    if (!ready) return
    if (!isLoggedIn) { router.push('/login'); return }
    fetch('/api/negociations', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setNegs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [ready, isLoggedIn])

  const filtered = negs.filter(n => {
    if (filter === 'Toutes')    return true
    if (filter === 'En cours')  return n.statut === 'EN_COURS'
    if (filter === 'Acceptée')  return n.statut === 'ACCEPTEE'
    if (filter === 'Refusée')   return n.statut === 'REFUSEE'
    if (filter === 'Finalisée') return n.statut === 'FINALISEE'
    return true
  })

  const unread = negs.reduce((acc, n) => {
    const count = (n.messages || []).filter(m => !m.lu && m.expediteur_id !== user?.id).length
    return acc + count
  }, 0)

  if (!ready || loading) return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 900, margin: '80px auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ height: 90, background: BG2, animationName: 'pulse', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />)}
      </div>
      <style jsx>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )

  return (
    <>
      <Head><title>Mes négociations — E-Krili</title></Head>
      <style jsx global>{`body { background: #EDE9E1 !important; } @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Page header ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <button onClick={() => router.push('/panel')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
                ← TABLEAU DE BORD
              </button>
              <span style={{ color: BORDER }}>|</span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>NÉGOCIATIONS</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>ESPACE PERSONNEL</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: TEXT, margin: 0 }}>
                  Mes négociations
                  {unread > 0 && (
                    <span style={{ marginLeft: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: GOLD, borderRadius: '50%', fontFamily: "'Raleway', sans-serif", fontSize: 10, color: BG, verticalAlign: 'middle' }}>
                      {unread}
                    </span>
                  )}
                </h1>
                <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12 }} />
              </div>
              {isClient && (
                <button onClick={() => router.push('/biens')}
                  style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '12px 24px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  PARCOURIR LES BIENS
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 0 }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ background: 'none', border: 'none', borderBottom: `2px solid ${filter === f ? GOLD : 'transparent'}`, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: filter === f ? GOLD : MUTED, padding: '12px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── List ── */}
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT, marginBottom: 28 }}>
            {filtered.length} NÉGOCIATION{filtered.length !== 1 ? 'S' : ''}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 12 }}>
                Aucune négociation
              </div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT, marginBottom: 32 }}>
                {isClient ? 'Parcourez les biens et faites une offre.' : 'Vos clients verront vos biens ici.'}
              </div>
              {isClient && (
                <button onClick={() => router.push('/biens')} style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 28px', cursor: 'pointer' }}>
                  VOIR LES BIENS
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {filtered.map(neg => {
                const other     = isClient ? neg.proprietaire : neg.client
                const otherName = other?.raison_sociale || `${other?.prenom || ''} ${other?.nom || ''}`.trim()
                const status    = STATUS_COLORS[neg.statut] || { color: FAINT, label: neg.statut }
                const lastMsg   = neg.messages?.[0]
                const myUnread  = (neg.messages || []).filter(m => !m.lu && m.expediteur_id !== user?.id).length
                const isActive  = neg.statut === 'EN_COURS'

                return (
                  <div key={neg.id} onClick={() => router.push(`/negociations/${neg.id}`)}
                    style={{ background: BG2, border: `1px solid ${myUnread > 0 ? GOLD : BORDER}`, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = '#DDD8CE' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = myUnread > 0 ? GOLD : BORDER; e.currentTarget.style.background = BG2 }}>

                    <div>
                      {/* Bien title */}
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 400, color: TEXT, marginBottom: 4 }}>
                        {neg.bien?.titre || '—'}
                      </div>

                      {/* Counterpart */}
                      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT, marginBottom: 10 }}>
                        {isClient ? 'Propriétaire' : 'Client'} : <span style={{ color: MUTED }}>{otherName}</span>
                        {' · '}{neg.bien?.ville}
                      </div>

                      {/* Last message preview */}
                      {lastMsg && (
                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 500 }}>
                          {lastMsg.expediteur_id === user?.id ? 'Vous : ' : `${otherName} : `}
                          {lastMsg.contenu}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      {/* Status badge */}
                      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: status.color, border: `1px solid ${status.color}`, padding: '4px 10px', opacity: 0.9 }}>
                        {status.label.toUpperCase()}
                      </div>

                      {/* Price */}
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: GOLD }}>
                        {Number(neg.prix_propose).toLocaleString('fr-DZ')} DZD
                      </div>

                      {/* Unread badge */}
                      {myUnread > 0 && (
                        <div style={{ background: GOLD, color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 9, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {myUnread}
                        </div>
                      )}

                      {/* Arrow */}
                      <span style={{ color: GOLD, fontSize: 16 }}>→</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </>
  )
}