// pages/profil/[id].js
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import PanelSidebar from '@/components/PanelSidebar'
import { useAuth } from '@/hooks/useAuth'

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD     = '#B8892A'
const GOLD_L   = '#D4A84B'
const GOLD_DIM = 'rgba(184,137,42,0.6)'
const BG_PAGE  = '#F5F0E8'
const BG_HEAD  = '#FAF7F2'
const BG_CARD  = '#EDE9E1'
const BG_CARD2 = '#E4DFD5'
const TEXT_1   = '#1A1713'
const TEXT_2   = '#5A5248'
const TEXT_3   = '#8A8278'
const BORDER   = 'rgba(184,137,42,0.18)'
const BORDER_H = 'rgba(184,137,42,0.5)'
const GREEN    = '#3D7A52'
const GREEN_BG = 'rgba(61,122,82,0.1)'

const Icon = ({ d, size = 14, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
  
)

const ICONS = {
  pin:     'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  phone:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z',
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  home:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  check:   'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  edit:    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  chat:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  arrow:   'M5 12h14M12 5l7 7-7 7',
  calendar:'M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18',
  back: 'M19 12H5M12 19l-7-7 7-7', // Nouvelle icône
}

function SectionTitle({ children, action, onAction }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
        <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 4, color: TEXT_3, fontWeight: 500 }}>
          {children}
        </span>
        <div style={{ width: 24, height: 1, background: BORDER }} />
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

function StarRating({ note, size = 12 }) {
  return (
    <div style={{ display:'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(note) ? GOLD : 'rgba(184,137,42,0.2)', fontSize: size }}>★</span>
      ))}
    </div>
  )
}

function BienCard({ bien, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? BG_CARD2 : BG_CARD,
        border: `1px solid ${hover ? BORDER_H : BORDER}`,
        cursor:'pointer', overflow:'hidden', transition:'all 0.2s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 8px 24px rgba(26,23,19,0.09)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{ height: 140, background: BG_CARD2, position:'relative', overflow:'hidden' }}>
        {bien.images?.[0]
          ? <img src={bien.images[0]} alt={bien.titre} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s', transform: hover ? 'scale(1.04)' : 'none' }} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon d={ICONS.home} size={28} stroke="rgba(184,137,42,0.25)" />
            </div>
        }
        <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: 2, background:`linear-gradient(to right, ${GOLD}, transparent)` }} />
        <span style={{
          position:'absolute', bottom: 8, right: 8,
          background:'rgba(26,23,19,0.75)', color: '#FAF7F2',
          fontFamily:"'Raleway',sans-serif", fontSize: 7, letterSpacing: 2,
          padding:'3px 8px', backdropFilter:'blur(4px)',
        }}>
          {bien.type_transaction === 'VENTE' ? 'VENTE' : bien.type_transaction === 'LOCATION' ? 'LOCATION' : 'VACANCES'}
        </span>
      </div>

      <div style={{ padding:'14px 16px' }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 15, color: hover ? TEXT_1 : TEXT_2, marginBottom: 3, lineHeight: 1.3, transition:'color 0.2s', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {bien.titre}
        </div>
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 9, color: TEXT_3, letterSpacing: 1, marginBottom: 12 }}>
          {bien.ville}, {bien.wilaya}
        </div>
        <div style={{ height: 1, background: BORDER, marginBottom: 10 }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 15, color: GOLD }}>
            {Number(bien.prix).toLocaleString('fr-DZ')} <span style={{ fontSize: 10, color: GOLD_DIM }}>DZD</span>
          </div>
          {bien.superficie && (
            <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, color: TEXT_3 }}>
              {Number(bien.superficie)} m²
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function AvisCard({ avis }) {
  return (
    <div style={{
      background: BG_CARD,
      border: `1px solid ${BORDER}`,
      padding:'18px 20px',
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 12 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background:`${GOLD}18`, border:`1px solid ${GOLD}44`,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 14, color: GOLD }}>
              {(avis.auteur?.prenom?.[0] || avis.auteur?.raison_sociale?.[0] || '?').toUpperCase()}
            </span>
          </div>
          <div>
            <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 11, color: TEXT_1, fontWeight: 500 }}>
              {avis.auteur?.raison_sociale || `${avis.auteur?.prenom || ''} ${avis.auteur?.nom || ''}`.trim()}
            </div>
            <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, color: TEXT_3, letterSpacing: 1, marginTop: 2 }}>
              {new Date(avis.date).toLocaleDateString('fr-DZ', { year:'numeric', month:'long', day:'numeric' })}
            </div>
          </div>
        </div>
        <StarRating note={avis.note} size={11} />
      </div>

      {avis.bien && (
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 1.5, color: GOLD_DIM, marginBottom: 8 }}>
          {avis.bien.titre}
        </div>
      )}

      {avis.commentaire && (
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 12, color: TEXT_2, fontWeight: 300, lineHeight: 1.7 }}>
          {avis.commentaire}
        </div>
      )}
    </div>
  )
}

// ── Edit modal ────────────────────────────────────────────────────────────────
function EditModal({ user, token, onClose, onSaved }) {
  const [form, setForm] = useState({
    nom:            user.nom            || '',
    prenom:         user.prenom         || '',
    raison_sociale: user.raison_sociale || '',
    telephone:      user.telephone      || '',
    ville:          user.ville          || '',
    wilaya:         user.wilaya         || '',
    sexe:           user.sexe           || '',
    date_naissance: user.date_naissance
      ? new Date(user.date_naissance).toISOString().split('T')[0]
      : '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur'); return }
      onSaved(data)
      onClose()
    } catch { setError('Erreur réseau') }
    finally  { setSaving(false) }
  }

  return (
    <div style={{
      position:'fixed', inset: 0, background:'rgba(26,23,19,0.6)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex: 200, padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: BG_HEAD, border:`1px solid ${BORDER}`,
        width:'100%', maxWidth: 520,
        maxHeight:'90vh', overflowY:'auto',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:'24px 28px 20px', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 4, color: GOLD, marginBottom: 6 }}>MODIFIER</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 22, color: TEXT_1 }}>Mon profil</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${BORDER}`, width: 32, height: 32, cursor:'pointer', color: TEXT_3, fontSize: 16, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = BORDER_H; e.currentTarget.style.color = TEXT_1 }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER;   e.currentTarget.style.color = TEXT_3 }}
          >×</button>
        </div>

        <div style={{ padding:'24px 28px 28px' }}>
          {error && (
            <div style={{ background:'rgba(160,64,64,0.1)', border:'1px solid rgba(160,64,64,0.3)', color:'#A04040', fontFamily:"'Raleway',sans-serif", fontSize: 11, padding:'10px 14px', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '0 20px' }}>
            {[
              { label:'Nom',           key:'nom',            type:'text' },
              { label:'Prénom',        key:'prenom',         type:'text' },
              { label:'Raison sociale',key:'raison_sociale', type:'text', full: user.role === 'AGENCE' },
              { label:'Téléphone',     key:'telephone',      type:'tel'  },
              { label:'Ville',         key:'ville',          type:'text' },
              { label:'Wilaya',        key:'wilaya',         type:'text' },
              { label:'Date de naissance', key:'date_naissance', type:'date' },
            ].filter(f => f.key !== 'raison_sociale' || user.role === 'AGENCE').map(field => (
              <div key={field.key} style={{ gridColumn: field.full ? '1 / -1' : 'auto', marginBottom: 24 }}>
                <label style={{ display:'block', fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 2, color: TEXT_3, marginBottom: 8 }}>
                  {field.label.toUpperCase()}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => set(field.key, e.target.value)}
                  style={{
                    width:'100%', background:'transparent',
                    border:'none', borderBottom:`1px solid ${BORDER}`,
                    color: TEXT_1, fontFamily:"'Raleway',sans-serif",
                    fontSize: 13, fontWeight: 300,
                    padding:'8px 0', outline:'none',
                    transition:'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = GOLD}
                  onBlur={e  => e.target.style.borderBottomColor = BORDER}
                />
              </div>
            ))}

            {/* Sexe select */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display:'block', fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 2, color: TEXT_3, marginBottom: 8 }}>SEXE</label>
              <select value={form.sexe} onChange={e => set('sexe', e.target.value)}
                style={{
                  width:'100%', background:'transparent',
                  border:'none', borderBottom:`1px solid ${BORDER}`,
                  color: form.sexe ? TEXT_1 : TEXT_3,
                  fontFamily:"'Raleway',sans-serif", fontSize: 13, fontWeight: 300,
                  padding:'8px 0', outline:'none', cursor:'pointer',
                  appearance:'none',
                }}>
                <option value="">—</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', gap: 12, marginTop: 8 }}>
            <button onClick={onClose} style={{
              background:'transparent', border:`1px solid ${BORDER}`,
              fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 3,
              color: TEXT_2, padding:'12px 24px', cursor:'pointer', transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BORDER_H; e.currentTarget.style.color = TEXT_1 }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER;   e.currentTarget.style.color = TEXT_2 }}
            >ANNULER</button>

            <button onClick={handleSave} disabled={saving} style={{
              background: saving ? GOLD_DIM : GOLD,
              border:'none', color:'#FAF7F2',
              fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 3, fontWeight: 500,
              padding:'12px 28px', cursor: saving ? 'not-allowed' : 'pointer', transition:'background 0.2s',
            }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = GOLD_L }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background = GOLD  }}
            >
              {saving ? 'ENREGISTREMENT…' : 'ENREGISTRER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProfilPage() {
  const router  = useRouter()
  const { id }  = router.query
  const { user: authUser, token, ready, isLoggedIn, isClient, canPublish, logout } = useAuth()

  const [profile,    setProfile]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [editOpen,   setEditOpen]   = useState(false)
  const [notFound,   setNotFound]   = useState(false)

  const isOwn = authUser && profile && authUser.id === profile.id

  useEffect(() => {
    if (!id) return
    fetchProfile()
  }, [id]) // eslint-disable-line

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/users/${id}`)
      if (res.status === 404) { setNotFound(true); return }
      const data = await res.json()
      setProfile(data)
    } catch (e) { console.error(e) }
    finally     { setLoading(false) }
  }

  const handleLogout = () => { logout(); router.push('/') }

  const handleSaved = (updated) => {
    setProfile(p => ({ ...p, ...updated }))
  }

  const roleLabel = { CLIENT:'CLIENT', PROPRIETAIRE:'PROPRIÉTAIRE', AGENCE:'AGENCE' }

  // ── Loading ──
  if (!ready || loading) return (
    <div style={{ background: BG_PAGE, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap: 20 }}>
      <div style={{ width: 36, height: 36, border:`1px solid ${GOLD}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.9s linear infinite' }} />
      <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 5, color: TEXT_3 }}>CHARGEMENT…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  // ── Not found ──
  if (notFound) return (
    <>
      <Head><title>Profil introuvable — E-Krili</title></Head>
      <Header />
      <div style={{ background: BG_PAGE, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap: 16 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 48, color:'rgba(184,137,42,0.25)', fontWeight: 300 }}>404</div>
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 10, letterSpacing: 4, color: TEXT_3 }}>PROFIL INTROUVABLE</div>
        <button onClick={() => router.back()} style={{
          marginTop: 16, background:'transparent', border:`1px solid ${BORDER}`,
          fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 3,
          color: GOLD, padding:'12px 28px', cursor:'pointer',
        }}>← RETOUR</button>
      </div>
    </>
  )

  const displayName = profile?.raison_sociale || `${profile?.prenom || ''} ${profile?.nom || ''}`.trim()

  return (
    <>
      <Head><title>{displayName} — E-Krili</title></Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Raleway:wght@300;400;500;600&display=swap');
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

          {/* Show sidebar only if logged in */}
          {isLoggedIn && (
            <PanelSidebar
              user={authUser}
              canPublish={canPublish}
              isClient={isClient}
              onLogout={handleLogout}
              unreadCount={0}
            />
          )}

          <div style={{ flex: 1, minWidth: 0, overflowY:'auto' }}>

            {/* ── Profile header ── */}
            <div style={{ background: BG_HEAD, borderBottom:`1px solid ${BORDER}`, padding:'36px 48px 32px', position:'relative', animation:'fadeUp 0.4s ease both' }}>
              <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: 2, background:`linear-gradient(to right, ${GOLD}, ${GOLD}44, transparent)` }} />
{/* BOUTON RETOUR POSITIONNÉ ICI */}
  <button 
    onClick={() => router.back()}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      padding: '0',
      marginBottom: '24px', // Espace avec l'avatar
      cursor: 'pointer',
      fontFamily: "'Raleway', sans-serif",
      fontSize: 8,
      letterSpacing: 3,
      color: TEXT_3,
      transition: 'all 0.2s',
      opacity: 0.8
    }}
    onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.opacity = 1 }}
    onMouseLeave={e => { e.currentTarget.style.color = TEXT_3; e.currentTarget.style.opacity = 0.8 }}
  >
    <Icon d={ICONS.back} size={11} stroke="currentColor" />
    RETOUR
  </button>
              <div style={{ display:'flex', alignItems:'flex-start', gap: 28, flexWrap:'wrap' }}>
                
                {/* Avatar */}
                <div style={{ flexShrink: 0 }}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt={displayName} style={{ width: 80, height: 80, objectFit:'cover', border:`2px solid ${GOLD}44` }} />
                    : (
                      <div style={{
                        width: 80, height: 80,
                        background:`linear-gradient(135deg, ${GOLD} 0%, ${GOLD_L} 100%)`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 34, fontWeight: 400, color:'#fff' }}>
                          {(profile?.prenom?.[0] || profile?.raison_sociale?.[0] || '?').toUpperCase()}
                        </span>
                      </div>
                    )
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    
                  <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 6, flexWrap:'wrap' }}>
                    <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD }}>
                      {roleLabel[profile?.role] || 'MEMBRE'}
                    </div>
                    {profile?.est_verifie && (
                      <span style={{ display:'flex', alignItems:'center', gap: 4, background: GREEN_BG, border:`1px solid ${GREEN}33`, color: GREEN, fontFamily:"'Raleway',sans-serif", fontSize: 7, letterSpacing: 2, padding:'3px 8px' }}>
                        <Icon d={ICONS.check} size={10} stroke={GREEN} /> VÉRIFIÉ
                      </span>
                    )}
                    
                  </div>

                  <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 34, fontWeight: 300, color: TEXT_1, margin:'0 0 12px', lineHeight: 1 }}>
                    {displayName}
                  </h1>

                  <div style={{ display:'flex', alignItems:'center', gap: 20, flexWrap:'wrap' }}>
                    {(profile?.ville || profile?.wilaya) && (
                      <span style={{ display:'flex', alignItems:'center', gap: 6, fontFamily:"'Raleway',sans-serif", fontSize: 11, color: TEXT_3 }}>
                        <Icon d={ICONS.pin} size={12} stroke={TEXT_3} />
                        {[profile.ville, profile.wilaya].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {profile?.note_moyenne && (
                      <span style={{ display:'flex', alignItems:'center', gap: 8 }}>
                        <StarRating note={profile.note_moyenne} size={12} />
                        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 16, color: GOLD }}>
                          {profile.note_moyenne}
                        </span>
                        <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 9, color: TEXT_3 }}>
                          ({profile.nombre_avis} avis)
                        </span>
                      </span>
                    )}
                    <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 9, color: TEXT_3, display:'flex', alignItems:'center', gap: 6 }}>
                      <Icon d={ICONS.calendar} size={11} stroke={TEXT_3} />
                      Membre depuis {new Date(profile?.date_inscription).toLocaleDateString('fr-DZ', { year:'numeric', month:'long' })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap: 10, flexShrink: 0, alignItems:'flex-start' }}>
                  {isOwn && (
                    <button onClick={() => setEditOpen(true)} style={{
                      background:'transparent', border:`1px solid ${BORDER}`,
                      fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 3,
                      color: TEXT_2, padding:'11px 22px', cursor:'pointer', transition:'all 0.2s',
                      display:'flex', alignItems:'center', gap: 8,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = BORDER_H; e.currentTarget.style.color = GOLD }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER;   e.currentTarget.style.color = TEXT_2 }}
                    >
                      <Icon d={ICONS.edit} size={12} stroke="currentColor" />
                      MODIFIER
                    </button>
                  )}
                  {!isOwn && isLoggedIn && (
                    <button onClick={() => router.push(`/negociations/nouvelle?proprietaire_id=${profile.id}`)} style={{
                      background: GOLD, border:'none', color:'#FAF7F2',
                      fontFamily:"'Raleway',sans-serif", fontSize: 9, letterSpacing: 3, fontWeight: 500,
                      padding:'11px 22px', cursor:'pointer', transition:'background 0.2s',
                      display:'flex', alignItems:'center', gap: 8,
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = GOLD_L}
                      onMouseLeave={e => e.currentTarget.style.background = GOLD}
                    >
                      <Icon d={ICONS.chat} size={12} stroke="#FAF7F2" />
                      CONTACTER
                    </button>
                  )}
                </div>
              </div>

              {/* Stats strip */}
              <div style={{ display:'flex', gap: 0, marginTop: 28, borderTop:`1px solid ${BORDER}`, paddingTop: 20 }}>
                {[
                  { label:'BIENS PUBLIÉS',    value: profile?._count?.biens    ?? 0 },
                  { label:'AVIS REÇUS',       value: profile?.nombre_avis       ?? 0 },
                  { label:'NOTE MOYENNE',     value: profile?.note_moyenne ? `${profile.note_moyenne}/5` : '—' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, borderRight: i < 2 ? `1px solid ${BORDER}` : 'none', paddingRight: 24, marginRight: 24 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, color: GOLD, lineHeight: 1, marginBottom: 4 }}>
                      {s.value}
                    </div>
                    <div style={{ fontFamily:"'Raleway',sans-serif", fontSize: 7, letterSpacing: 3, color: TEXT_3 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Content ── */}
            <div style={{ padding:'40px 48px 80px', animation:'fadeUp 0.5s 0.08s ease both' }}>

              {/* Biens */}
              {profile?.biens?.length > 0 && (
                <div style={{ marginBottom: 52 }}>
                  <SectionTitle>BIENS DISPONIBLES</SectionTitle>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
                    {profile.biens.map(b => (
                      <BienCard key={b.id} bien={b} onClick={() => router.push(`/biens/${b.id}`)} />
                    ))}
                  </div>
                </div>
              )}

              {profile?.biens?.length === 0 && profile?.role !== 'CLIENT' && (
                <div style={{ marginBottom: 52 }}>
                  <SectionTitle>BIENS DISPONIBLES</SectionTitle>
                  <div style={{ padding:'32px 0', display:'flex', alignItems:'center', gap: 14, borderTop:`1px solid ${BORDER}` }}>
                    <div style={{ width: 24, height: 1, background: BORDER }} />
                    <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 11, color: TEXT_3 }}>Aucun bien disponible pour le moment.</span>
                  </div>
                </div>
              )}

              <div style={{ height: 1, background:`linear-gradient(to right, ${BORDER}, transparent)`, marginBottom: 52 }} />

              {/* Avis */}
              <div>
                <SectionTitle>AVIS REÇUS</SectionTitle>
                {profile?.avis_recus?.length > 0
                  ? (
                    <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                      {profile.avis_recus.map(a => <AvisCard key={a.id} avis={a} />)}
                    </div>
                  )
                  : (
                    <div style={{ padding:'32px 0', display:'flex', alignItems:'center', gap: 14, borderTop:`1px solid ${BORDER}` }}>
                      <div style={{ width: 24, height: 1, background: BORDER }} />
                      <span style={{ fontFamily:"'Raleway',sans-serif", fontSize: 11, color: TEXT_3 }}>Aucun avis pour le moment.</span>
                    </div>
                  )
                }
              </div>

            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditModal
          user={authUser}
          token={token}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}