// pages/admin/index.js
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const DARK   = '#1E1A14'
const BORDER = 'rgba(184,137,42,0.22)'
const RED    = '#C0392B'

const Ico = ({ d, size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const ICONS = {
  users:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  home:   'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  neg:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  trash:  'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  check:  'M20 6 9 17l-5-5',
  ban:    'M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636',
  eye:    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
}

function StatCard({ label, value, sub, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? '#DDD8CE' : BG2, border: `1px solid ${hover ? GOLD : BORDER}`, padding: '28px 24px', cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: GOLD, lineHeight: 1 }}>{value ?? '—'}</div>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginTop: 8 }}>{label.toUpperCase()}</div>
      {sub && <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: FAINT }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  )
}

function Badge({ label, color, bg }) {
  return (
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color, background: bg, padding: '2px 8px', border: `1px solid ${color}44` }}>
      {label.toUpperCase()}
    </span>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, token, loading: authLoading } = useAuth()

  const [tab,    setTab]    = useState('users')   // 'users' | 'biens' | 'negociations'
  const [data,   setData]   = useState([])
  const [stats,  setStats]  = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page,   setPage]   = useState(1)
  const PER_PAGE = 15

  // Guard: only admins — in production add a proper admin role check
  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return }
    // Simple check: could extend User model with `is_admin` boolean
    // For now any logged-in user can access (add proper guard later)
  }, [authLoading, user])

  useEffect(() => {
    if (!token) return
    fetchStats()
  }, [token])

  useEffect(() => {
    if (!token) return
    fetchTab()
    setPage(1)
  }, [tab, token])

  const fetchStats = async () => {
    try {
      const res  = await fetch('/api/admin', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setStats(data.stats || data)
    } catch (e) { console.error(e) }
  }

  const fetchTab = async () => {
    setLoading(true)
    try {
      const endpoints = {
        users:        '/api/admin?resource=users',
        biens:        '/api/admin?resource=biens',
        negociations: '/api/admin?resource=negociations',
      }
      const res  = await fetch(endpoints[tab], { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      setData(json.items || json.users || json.biens || json.negociations || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleToggleUser = async (userId, isActive) => {
    if (!confirm(`${isActive ? 'Désactiver' : 'Réactiver'} cet utilisateur ?`)) return
    await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ est_actif: !isActive }),
    })
    fetchTab()
  }

  const handleDeleteBien = async (bienId) => {
    if (!confirm('Supprimer définitivement ce bien ?')) return
    await fetch(`/api/biens/${bienId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchTab()
  }

  const filtered = data.filter(item => {
    const q = search.toLowerCase()
    if (!q) return true
    if (tab === 'users')        return item.email?.toLowerCase().includes(q) || item.nom?.toLowerCase().includes(q)
    if (tab === 'biens')        return item.titre?.toLowerCase().includes(q) || item.ville?.toLowerCase().includes(q)
    if (tab === 'negociations') return String(item.id).includes(q)
    return true
  })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  if (authLoading) return null

  return (
    <>
      <Head><title>Administration — E-Krili</title></Head>
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* Page header */}
        <div style={{ background: DARK, borderBottom: `1px solid rgba(184,137,42,0.2)`, padding: '36px 0 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>BACK-OFFICE</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: '#F5F0E8', margin: 0 }}>
              Administration
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12, marginBottom: 32 }} />

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2 }}>
              {[
                { key: 'users',        icon: ICONS.users, label: 'Utilisateurs' },
                { key: 'biens',        icon: ICONS.home,  label: 'Biens' },
                { key: 'negociations', icon: ICONS.neg,   label: 'Négociations' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.key ? GOLD : 'transparent'}`, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: tab === t.key ? GOLD_L : 'rgba(255,255,255,0.4)', padding: '12px 20px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, marginBottom: -1 }}
                  onMouseEnter={e => { if (tab !== t.key) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                  onMouseLeave={e => { if (tab !== t.key) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                  <Ico d={t.icon} size={13} stroke="currentColor" />
                  {t.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box' }}>

          {/* Stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 3, marginBottom: 48 }}>
              <StatCard label="Utilisateurs"   value={stats.total_users}         />
              <StatCard label="Biens actifs"   value={stats.total_biens}         />
              <StatCard label="Négociations"   value={stats.total_negociations}  />
              <StatCard label="Nouveaux (7j)"  value={stats.new_users_week}      />
            </div>
          )}

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: BG2, border: `1px solid ${BORDER}`, padding: '10px 16px' }}>
              <Ico d={ICONS.search} size={14} stroke={FAINT} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder={`Rechercher dans ${tab}…`}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: "'Raleway', sans-serif", fontSize: 12, color: TEXT }} />
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT, whiteSpace: 'nowrap' }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 4, color: FAINT, padding: '40px 0' }}>CHARGEMENT…</div>
          ) : paginated.length === 0 ? (
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: FAINT, padding: '40px 0' }}>Aucun résultat.</div>
          ) : (
            <div style={{ border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: tab === 'users' ? '1fr 1fr 120px 100px 100px' : tab === 'biens' ? '2fr 1fr 120px 120px 80px' : '60px 1fr 1fr 120px 100px', background: DARK, padding: '12px 20px', gap: 12 }}>
                {tab === 'users' && ['Nom', 'Email', 'Rôle', 'Statut', 'Actions'].map(h => (
                  <span key={h} style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.45)' }}>{h.toUpperCase()}</span>
                ))}
                {tab === 'biens' && ['Titre', 'Ville', 'Prix', 'État', 'Actions'].map(h => (
                  <span key={h} style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.45)' }}>{h.toUpperCase()}</span>
                ))}
                {tab === 'negociations' && ['ID', 'Client', 'Propriétaire', 'Statut', 'Prix proposé'].map(h => (
                  <span key={h} style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.45)' }}>{h.toUpperCase()}</span>
                ))}
              </div>

              {/* Rows */}
              {paginated.map((item, i) => (
                <div key={item.id}
                  style={{ display: 'grid', gridTemplateColumns: tab === 'users' ? '1fr 1fr 120px 100px 100px' : tab === 'biens' ? '2fr 1fr 120px 120px 80px' : '60px 1fr 1fr 120px 100px', padding: '14px 20px', gap: 12, background: i % 2 === 0 ? BG : BG2, borderBottom: `1px solid ${BORDER}`, alignItems: 'center', transition: 'background 0.15s' }}>

                  {tab === 'users' && (<>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: TEXT }}>
                      {item.raison_sociale || `${item.prenom || ''} ${item.nom || ''}`.trim()}
                    </span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED }}>{item.email}</span>
                    <Badge label={item.role} color={item.role === 'AGENCE' ? GOLD_L : item.role === 'PROPRIETAIRE' ? GOLD : FAINT} bg="transparent" />
                    <Badge label={item.est_actif ? 'Actif' : 'Désactivé'} color={item.est_actif ? '#3D7A52' : RED} bg={item.est_actif ? 'rgba(61,122,82,0.08)' : 'rgba(192,57,43,0.08)'} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => router.push(`/profil/${item.id}`)} title="Voir profil"
                        style={{ width: 30, height: 30, background: 'transparent', border: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                        <Ico d={ICONS.eye} size={12} stroke={FAINT} />
                      </button>
                      <button onClick={() => handleToggleUser(item.id, item.est_actif)} title={item.est_actif ? 'Désactiver' : 'Réactiver'}
                        style={{ width: 30, height: 30, background: 'transparent', border: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = item.est_actif ? RED : '#3D7A52' }}
                        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                        <Ico d={item.est_actif ? ICONS.ban : ICONS.check} size={12} stroke={item.est_actif ? RED : '#3D7A52'} />
                      </button>
                    </div>
                  </>)}

                  {tab === 'biens' && (<>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.titre}</span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED }}>{item.ville}, {item.wilaya}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: GOLD }}>{Number(item.prix).toLocaleString('fr-DZ')} DZD</span>
                    <Badge label={item.etat} color={item.etat === 'DISPONIBLE' ? '#3D7A52' : FAINT} bg={item.etat === 'DISPONIBLE' ? 'rgba(61,122,82,0.08)' : 'transparent'} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => router.push(`/biens/${item.id}`)} title="Voir"
                        style={{ width: 30, height: 30, background: 'transparent', border: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                        <Ico d={ICONS.eye} size={12} stroke={FAINT} />
                      </button>
                      <button onClick={() => handleDeleteBien(item.id)} title="Supprimer"
                        style={{ width: 30, height: 30, background: 'transparent', border: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = RED}
                        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                        <Ico d={ICONS.trash} size={12} stroke={RED} />
                      </button>
                    </div>
                  </>)}

                  {tab === 'negociations' && (<>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: FAINT }}>#{item.id}</span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED }}>{item.client?.nom || '—'}</span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: MUTED }}>{item.proprietaire?.nom || item.proprietaire?.raison_sociale || '—'}</span>
                    <Badge
                      label={item.statut}
                      color={item.statut === 'EN_COURS' ? GOLD : item.statut === 'ACCEPTEE' ? '#3D7A52' : item.statut === 'REFUSEE' ? RED : FAINT}
                      bg="transparent"
                    />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: GOLD }}>{Number(item.prix_propose).toLocaleString('fr-DZ')}</span>
                  </>)}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 32 }}>
              <PagBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</PagBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - page) <= 2)
                .map(p => (
                  <PagBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PagBtn>
                ))}
              <PagBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</PagBtn>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

function PagBtn({ children, onClick, disabled, active }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 36, height: 36, background: active ? GOLD : hover ? 'rgba(184,137,42,0.08)' : 'transparent', border: `1px solid ${active ? GOLD : BORDER}`, color: active ? '#FFF' : disabled ? BORDER : MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 11, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </button>
  )
}