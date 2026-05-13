import { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import Header from '@/components/Header'
import { useRouter } from 'next/router'

/* ─── Tokens ─────────────────────────────────────────────── */
const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BG3    = '#D8D2C6'
const DARK   = '#1A1713'
const BORDER = 'rgba(184,137,42,0.22)'
const GREEN  = '#3A6B47'
const RED    = '#8B2020'

const R = (s) => ({ fontFamily: "'Raleway', sans-serif",    ...s })
const C = (s) => ({ fontFamily: "'Cormorant Garamond', serif", ...s })

/* ─── SVG Icon ───────────────────────────────────────────── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const ICONS = {
  user:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  mail:    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  phone:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2.6h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z',
  calendar:'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  sex:     'M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zM12 17v5M9 19h6',
  edit:    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  check:   'M20 6L9 17l-5-5',
  x:       'M18 6L6 18M6 6l12 12',
  lock:    'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  arrow:   'M19 12H5M12 5l-7 7 7 7',
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  home:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
}

const FIELDS_CLIENT = [
  { key: 'nom',             label: 'Nom',              type: 'text',   icon: 'user'     },
  { key: 'prenom',          label: 'Prénom',            type: 'text',   icon: 'user'     },
  { key: 'email',           label: 'Email',             type: 'email',  icon: 'mail'     },
  { key: 'telephone',       label: 'Téléphone',         type: 'tel',    icon: 'phone'    },
  { key: 'date_naissance',  label: 'Date de naissance', type: 'date',   icon: 'calendar' },
  { key: 'sex',             label: 'Sexe',              type: 'select', icon: 'sex',
    options: [{ value: '', label: 'Sélectionner' }, { value: 'homme', label: 'Homme' }, { value: 'femme', label: 'Femme' }] },
]

const FIELDS_PROPRIO = [
  { key: 'nom',        label: 'Nom',        type: 'text',  icon: 'user'  },
  { key: 'prenom',     label: 'Prénom',     type: 'text',  icon: 'user'  },
  { key: 'email',      label: 'Email',      type: 'email', icon: 'mail'  },
  { key: 'telephone',  label: 'Téléphone',  type: 'tel',   icon: 'phone' },
]

/* ═══════════════════════════════════════════════════════════ */
export default function Profile() {
  const router = useRouter()

  const [client, setClient]       = useState(null)
  const [idClient, setIdClient]   = useState(null)
  const [userType, setUserType]   = useState('client')   // 'client' | 'proprietaire'
  const [statusVIP, setStatusVIP] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)   // 'ok' | 'err' | null
  const [updatedData, setUpdatedData] = useState({})
  const [activeTab, setActiveTab] = useState('info')   // 'info' | 'security'

  /* ── Decode token ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login_client'); return }
    const decoded = jwt.decode(token)
    if (!decoded) return
    setUserType(decoded.userType || 'client')
    setStatusVIP(decoded.statusVIP || false)
    setIdClient(decoded.userType === 'proprietaire' ? decoded.id_client : decoded.id)
  }, [])

  /* ── Fetch profile ── */
  useEffect(() => {
    if (!idClient) return
    fetch(`/api/api_getClient?clientId=${idClient}`)
      .then(r => r.json())
      .then(data => { setClient(data); setUpdatedData(data) })
      .catch(e => console.error(e))
  }, [idClient])

  const isProprio = userType === 'proprietaire'
  const fields    = isProprio ? FIELDS_PROPRIO : FIELDS_CLIENT

  const initials = client
    ? `${(client.nom || '')[0] || ''}${(client.prenom || '')[0] || ''}`.toUpperCase()
    : '?'

  const handleChange = (e) =>
    setUpdatedData(d => ({ ...d, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setSaveStatus(null)
    try {
      const res = await fetch('/api/api_updateClient', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      if (res.ok) {
        setClient(updatedData)
        setIsEditing(false)
        setSaveStatus('ok')
        setTimeout(() => setSaveStatus(null), 3000)
      } else {
        setSaveStatus('err')
      }
    } catch { setSaveStatus('err') }
    finally { setSaving(false) }
  }

  const handleCancel = () => { setIsEditing(false); setUpdatedData(client) }

  /* ── Format date for display ── */
  const fmtDate = (d) => {
    if (!d) return '—'
    try { return new Date(d).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'long', year: 'numeric' }) }
    catch { return d }
  }

  if (!client) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
      <p style={{ ...C({ fontSize: 22, color: MUTED, letterSpacing: 2 }) }}>Chargement…</p>
    </div>
  )

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '48px 40px 80px' }}>

        {/* ── Back link ── */}
        <button
          onClick={() => router.push('/panel')}
          style={{ ...R({ fontSize: 9, letterSpacing: 3, color: MUTED }), background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 36, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = GOLD}
          onMouseLeave={e => e.currentTarget.style.color = MUTED}
        >
          <Icon d={ICONS.arrow} size={12} /> TABLEAU DE BORD
        </button>

        {/* ── Hero section ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginBottom: 48, paddingBottom: 40, borderBottom: `1px solid ${BORDER}` }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 88, height: 88,
              background: `linear-gradient(135deg, rgba(184,137,42,0.15), rgba(184,137,42,0.05))`,
              border: `1px solid rgba(184,137,42,0.35)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...C({ fontSize: 36, fontWeight: 300, color: GOLD_L }),
            }}>{initials}</div>
            {/* Role badge */}
            <div style={{
              position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
              ...R({ fontSize: 7, letterSpacing: 2 }),
              background: isProprio ? DARK : BG3,
              color: isProprio ? GOLD_L : MUTED,
              border: `1px solid ${isProprio ? 'rgba(184,137,42,0.4)' : BORDER}`,
              padding: '2px 8px', whiteSpace: 'nowrap',
            }}>
              {isProprio ? '★ PROPRIÉTAIRE' : 'CLIENT'}
            </div>
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1 }}>
            <div style={{ ...R({ fontSize: 9, letterSpacing: 5, color: GOLD }), marginBottom: 8 }}>
              ESPACE PERSONNEL
            </div>
            <h1 style={{ ...C({ fontSize: 36, fontWeight: 300, color: TEXT }), margin: 0 }}>
              {client.prenom ? `${client.prenom} ${client.nom}` : client.nom || '—'}
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {client.email && (
                <span style={{ ...R({ fontSize: 10, color: FAINT }), display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d={ICONS.mail} size={11} /> {client.email}
                </span>
              )}
              {client.telephone && (
                <span style={{ ...R({ fontSize: 10, color: FAINT }), display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d={ICONS.phone} size={11} /> {client.telephone}
                </span>
              )}
              {statusVIP && (
                <span style={{ ...R({ fontSize: 8, letterSpacing: 2, color: GOLD_L }), display: 'flex', alignItems: 'center', gap: 5, border: `1px solid rgba(184,137,42,0.3)`, padding: '2px 8px' }}>
                  <Icon d={ICONS.star} size={10} /> VIP
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{ ...R({ fontSize: 9, letterSpacing: 3, color: MUTED }), background: 'transparent', border: `1px solid ${BORDER}`, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}
            >
              <Icon d={ICONS.edit} size={13} /> MODIFIER
            </button>
          )}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 36 }}>
          {[
            { key: 'info',     label: 'Informations personnelles', icon: ICONS.user },
            { key: 'security', label: 'Sécurité',                  icon: ICONS.lock },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                ...R({ fontSize: 9, letterSpacing: 3, color: activeTab === tab.key ? GOLD : MUTED }),
                background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab.key ? GOLD : 'transparent'}`,
                padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                transition: 'all 0.2s', marginBottom: -1,
              }}
            >
              <Icon d={tab.icon} size={12} /> {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── Save status banner ── */}
        {saveStatus && (
          <div style={{
            ...R({ fontSize: 10, letterSpacing: 1 }),
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px', marginBottom: 24,
            background: saveStatus === 'ok' ? 'rgba(58,107,71,0.08)' : 'rgba(139,32,32,0.08)',
            border: `1px solid ${saveStatus === 'ok' ? 'rgba(58,107,71,0.3)' : 'rgba(139,32,32,0.3)'}`,
            color: saveStatus === 'ok' ? GREEN : RED,
          }}>
            <Icon d={saveStatus === 'ok' ? ICONS.check : ICONS.x} size={14} />
            {saveStatus === 'ok' ? 'Profil mis à jour avec succès.' : 'Erreur lors de la mise à jour. Veuillez réessayer.'}
          </div>
        )}

        {/* ══ TAB: Info ══════════════════════════════════════════ */}
        {activeTab === 'info' && (
          <>
            {/* Propriétaire notice */}
            {isProprio && (
              <div style={{
                ...R({ fontSize: 10, color: MUTED, lineHeight: 1.7 }),
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '14px 18px', marginBottom: 28,
                border: `1px solid rgba(184,137,42,0.25)`,
                background: 'rgba(184,137,42,0.04)',
              }}>
                <Icon d={ICONS.home} size={16} />
                <span>
                  Vous avez le statut <strong style={{ color: GOLD }}>Propriétaire</strong>.
                  Certains champs sont gérés via votre profil propriétaire.
                </span>
              </div>
            )}

            {/* View mode */}
            {!isEditing && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
                {fields.map(f => (
                  <ProfileRow key={f.key}
                    icon={f.icon}
                    label={f.label}
                    value={f.key === 'date_naissance' ? fmtDate(client[f.key]) : (client[f.key] || '—')}
                  />
                ))}
              </div>
            )}

            {/* Edit mode */}
            {isEditing && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
                  {fields.map(f => (
                    <div key={f.key} style={{ marginBottom: 28 }}>
                      <label style={{ ...R({ fontSize: 9, letterSpacing: 3, color: GOLD }), display: 'block', marginBottom: 8 }}>
                        {f.label.toUpperCase()}
                      </label>

                      {f.type === 'select' ? (
                        <select name={f.key} value={updatedData[f.key] || ''} onChange={handleChange}
                          style={{ ...inputStyle }}>
                          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type} name={f.key}
                          value={f.key === 'date_naissance'
                            ? (updatedData[f.key] ? updatedData[f.key].slice(0, 10) : '')
                            : (updatedData[f.key] || '')}
                          onChange={handleChange}
                          style={{ ...inputStyle }}
                          onFocus={e => e.currentTarget.style.borderBottomColor = GOLD}
                          onBlur={e => e.currentTarget.style.borderBottomColor = 'rgba(184,137,42,0.3)'}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    onClick={handleSave} disabled={saving}
                    style={{ ...R({ fontSize: 9, letterSpacing: 3, color: BG }), background: saving ? BG3 : GOLD, border: 'none', padding: '12px 28px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#9A7020' }}
                    onMouseLeave={e => { if (!saving) e.currentTarget.style.background = GOLD }}
                  >
                    <Icon d={ICONS.check} size={13} />
                    {saving ? 'ENREGISTREMENT…' : 'SAUVEGARDER'}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{ ...R({ fontSize: 9, letterSpacing: 3, color: MUTED }), background: 'transparent', border: `1px solid ${BORDER}`, padding: '12px 24px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = MUTED }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER }}
                  >
                    ANNULER
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ══ TAB: Security ══════════════════════════════════════ */}
        {activeTab === 'security' && (
          <SecurityTab idClient={idClient} />
        )}
      </main>
    </div>
  )
}

/* ── Profile row (view mode) ─────────────────────────────── */
function ProfileRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 0', borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, ...R({ fontSize: 8, letterSpacing: 3, color: FAINT }) }}>
        <Icon d={ICONS[icon]} size={11} /> {label.toUpperCase()}
      </div>
      <div style={{ ...R({ fontSize: 13, color: TEXT, fontWeight: 400, paddingLeft: 17 }) }}>{value}</div>
    </div>
  )
}

/* ── Security tab ────────────────────────────────────────── */
function SecurityTab({ idClient }) {
  const [form, setForm]       = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [status, setStatus]   = useState(null)   // 'ok' | 'err' | 'mismatch'
  const [loading, setLoading] = useState(false)

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirm) { setStatus('mismatch'); return }
    setLoading(true); setStatus(null)
    try {
      const res = await fetch('/api/api_updatePassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idClient, currentPassword: form.currentPassword, newPassword: form.newPassword }),
      })
      setStatus(res.ok ? 'ok' : 'err')
      if (res.ok) setForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch { setStatus('err') }
    finally { setLoading(false) }
  }

  const MSG = {
    ok:       { color: GREEN, border: 'rgba(58,107,71,0.3)',  bg: 'rgba(58,107,71,0.06)',   text: 'Mot de passe mis à jour avec succès.' },
    err:      { color: RED,   border: 'rgba(139,32,32,0.3)',  bg: 'rgba(139,32,32,0.06)',   text: 'Erreur. Vérifiez votre mot de passe actuel.' },
    mismatch: { color: RED,   border: 'rgba(139,32,32,0.3)',  bg: 'rgba(139,32,32,0.06)',   text: 'Les mots de passe ne correspondent pas.' },
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <div style={{ ...R({ fontSize: 9, letterSpacing: 5, color: GOLD }), marginBottom: 24 }}>CHANGER LE MOT DE PASSE</div>

      {status && (
        <div style={{ ...R({ fontSize: 10 }), padding: '11px 14px', marginBottom: 20, background: MSG[status].bg, border: `1px solid ${MSG[status].border}`, color: MSG[status].color, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon d={status === 'ok' ? ICONS.check : ICONS.x} size={13} />
          {MSG[status].text}
        </div>
      )}

      {[
        { key: 'currentPassword', label: 'Mot de passe actuel' },
        { key: 'newPassword',     label: 'Nouveau mot de passe' },
        { key: 'confirm',         label: 'Confirmer le nouveau mot de passe' },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: 24 }}>
          <label style={{ ...R({ fontSize: 9, letterSpacing: 3, color: GOLD }), display: 'block', marginBottom: 8 }}>
            {f.label.toUpperCase()}
          </label>
          <input
            type="password" value={form[f.key]} onChange={update(f.key)}
            placeholder="••••••••"
            style={{ ...inputStyle }}
            onFocus={e => e.currentTarget.style.borderBottomColor = GOLD}
            onBlur={e => e.currentTarget.style.borderBottomColor = 'rgba(184,137,42,0.3)'}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit} disabled={loading}
        style={{ ...R({ fontSize: 9, letterSpacing: 3, color: BG }), background: loading ? BG3 : GOLD, border: 'none', padding: '12px 28px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#9A7020' }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = GOLD }}
      >
        <Icon d={ICONS.lock} size={13} />
        {loading ? 'ENREGISTREMENT…' : 'METTRE À JOUR'}
      </button>
    </div>
  )
}

/* ── Shared input style ──────────────────────────────────── */
const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(184,137,42,0.3)',
  color: '#1A1713',
  fontFamily: "'Raleway', sans-serif",
  fontSize: 13,
  fontWeight: 300,
  padding: '9px 0',
  outline: 'none',
  transition: 'border-color 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
  colorScheme: 'light',
}