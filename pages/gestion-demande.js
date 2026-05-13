import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import Header from '@/components/Header'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const ICONS = {
  edit:   'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:  'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  plus:   'M12 5v14M5 12h14',
  lock:   'M12 17v-2M8 11V7a4 4 0 0 1 8 0v4M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z',
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => v ? Number(v).toLocaleString('fr-DZ') + ' DA' : '—'
const fmtDate = (v) => v ? new Date(v).toLocaleDateString('fr-DZ') : '—'

function StatusBadge({ statut, hasInteresse }) {
  const locked = hasInteresse
  const color  = locked ? '#B8892A' : statut === 'on' ? '#4A7C59' : FAINT
  const bg     = locked ? 'rgba(184,137,42,0.1)' : statut === 'on' ? 'rgba(74,124,89,0.1)' : 'rgba(138,130,120,0.1)'
  const label  = locked ? 'Négociation en cours' : statut === 'on' ? 'Active' : 'Clôturée'
  return (
    <span style={{
      fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2,
      color, background: bg, padding: '3px 10px', border: `1px solid ${color}`,
    }}>
      {label.toUpperCase()}
    </span>
  )
}

// ── Styled form elements ──────────────────────────────────────────────────────
function MiniInput({ label, value, onChange, type = 'text', placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 7 }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          display: 'block', width: '100%', boxSizing: 'border-box',
          background: focused ? BG : 'rgba(237,233,225,0.5)',
          border: `1px solid ${focused ? GOLD : BORDER}`,
          padding: '10px 12px',
          fontFamily: "'Raleway', sans-serif", fontSize: 11, color: TEXT,
          outline: 'none', transition: 'all 0.2s',
        }}
      />
    </div>
  )
}

function MiniSelect({ label, value, onChange, children }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 7 }}>
        {label}
      </label>
      <select
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          display: 'block', width: '100%', boxSizing: 'border-box',
          backgroundColor: focused ? BG : 'rgba(237,233,225,0.5)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8278' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
          border: `1px solid ${focused ? GOLD : BORDER}`,
          padding: '10px 12px',
          fontFamily: "'Raleway', sans-serif", fontSize: 11, color: value ? TEXT : FAINT,
          outline: 'none', transition: 'all 0.2s', appearance: 'none', cursor: 'pointer',
        }}
      >
        {children}
      </select>
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ demande, onClose, onSaved }) {
  const [typeBien,          setTypeBien]          = useState(demande.type_bien || '')
  const [prixMax,           setPrixMax]            = useState(demande.prix_maximum || '')
  const [surface,           setSurface]            = useState(demande.surface_minimum || '')
  const [nbrChambre,        setNbrChambre]         = useState(demande.nbr_chambre_minimum || '')
  const [saving,            setSaving]             = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/api_modifier_demande_client', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          id: demande.id_demande_client,
          demandeClient: { id_demande_client: demande.id_demande_client },
          type_bien: typeBien,
          prix_maximum: prixMax,
          surface_minimum: surface,
          nbr_chambre_minimum: nbrChambre,
        }),
      })
      if (res.ok) {
        toast.success('Demande modifiée avec succès', { position: 'top-center' })
        onSaved()
      } else {
        const d = await res.json()
        toast.error(d.error || 'Erreur lors de la modification', { position: 'top-center' })
      }
    } catch {
      toast.error('Erreur réseau', { position: 'top-center' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(20,15,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: BG, border: `1px solid ${BORDER}`, padding: '36px 32px', width: '100%', maxWidth: 440, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', fontSize: 18, color: FAINT, cursor: 'pointer' }}>×</button>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, marginBottom: 24 }} />

        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: GOLD_L, textAlign: 'center', marginBottom: 10 }}>
          MODIFIER LA DEMANDE
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: TEXT, textAlign: 'center', margin: '0 0 24px' }}>
          Demande #{demande.id_demande_client}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <MiniSelect label="TYPE DE BIEN" value={typeBien} onChange={e => setTypeBien(e.target.value)}>
            <option value="">Sélectionner</option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="autre">Autre</option>
          </MiniSelect>
          <MiniSelect label="CHAMBRES MIN." value={nbrChambre} onChange={e => setNbrChambre(e.target.value)}>
            <option value="">Sélectionner</option>
            {['F3','F4','F5','F6','F7','F8','F9','F10'].map(f => <option key={f} value={f}>{f}</option>)}
          </MiniSelect>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <MiniInput label="PRIX MAXIMUM (DA)" value={prixMax} onChange={e => setPrixMax(e.target.value)} type="number" placeholder="Ex. 30 000" />
          <MiniInput label="SURFACE MIN. (m²)" value={surface} onChange={e => setSurface(e.target.value)} type="number" placeholder="Ex. 120" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <ModalBtn primary onClick={handleSave} disabled={saving}>
            {saving ? 'ENREGISTREMENT...' : 'ENREGISTRER'}
          </ModalBtn>
          <ModalBtn onClick={onClose}>ANNULER</ModalBtn>
        </div>
      </div>
    </div>
  )
}

function ModalBtn({ children, onClick, primary, disabled }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, padding: '12px 0',
        background: primary ? (disabled ? MUTED : hover ? '#9A7020' : GOLD) : 'transparent',
        border: primary ? 'none' : `1px solid ${hover ? MUTED : BORDER}`,
        color: primary ? BG : MUTED,
        fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
      }}
    >{children}</button>
  )
}

// ── Demande Card ──────────────────────────────────────────────────────────────
function DemandeCard({ demande, onDelete, onEdit }) {
  const [hoverEdit,   setHoverEdit]   = useState(false)
  const [hoverDelete, setHoverDelete] = useState(false)

  const hasInteresse = demande.interesse && demande.interesse.length > 0
  const canEdit      = demande.statut_demande === 'on' && !hasInteresse

  const rows = [
    { label: 'Type de bien',     value: demande.type_bien || '—' },
    { label: 'Transaction',      value: demande.type_de_transaction || '—' },
    { label: 'Prix minimum',     value: fmt(demande.prix_minimum) },
    { label: 'Prix maximum',     value: fmt(demande.prix_maximum) },
    { label: 'Surface min.',     value: demande.surface_minimum ? `${demande.surface_minimum} m²` : '—' },
    { label: 'Chambres min.',    value: demande.nbr_chambre_minimum || '—' },
    { label: 'Début recherche',  value: fmtDate(demande.date_debut_rechercher) },
  ]

  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '28px 28px 22px' }}>

      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: FAINT, marginBottom: 5 }}>
            DEMANDE #{demande.id_demande_client}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: TEXT }}>
            {demande.type_bien
              ? demande.type_bien.charAt(0).toUpperCase() + demande.type_bien.slice(1)
              : 'Bien non spécifié'}
          </div>
        </div>
        <StatusBadge statut={demande.statut_demande} hasInteresse={hasInteresse} />
      </div>

      <div style={{ height: 1, background: BORDER, marginBottom: 18 }} />

      {/* Detail rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 22 }}>
        {rows.map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: FAINT, marginBottom: 3 }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: TEXT, fontWeight: 400 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
        {canEdit ? (
          <button
            onClick={() => onEdit(demande)}
            onMouseEnter={() => setHoverEdit(true)}
            onMouseLeave={() => setHoverEdit(false)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px 0',
              background: hoverEdit ? GOLD : 'transparent',
              border: `1px solid ${hoverEdit ? GOLD : BORDER}`,
              color: hoverEdit ? BG : MUTED,
              fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2.5,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Icon d={ICONS.edit} size={13} />
            MODIFIER
          </button>
        ) : (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '10px 0', border: `1px solid ${BORDER}`,
            fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2.5, color: FAINT,
          }}>
            <Icon d={ICONS.lock} size={13} />
            {hasInteresse ? 'NÉGOCIATION EN COURS' : 'NON MODIFIABLE'}
          </div>
        )}

        <button
          onClick={() => onDelete(demande.id_demande_client)}
          onMouseEnter={() => setHoverDelete(true)}
          onMouseLeave={() => setHoverDelete(false)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '10px 0',
            background: hoverDelete ? '#8B2020' : 'transparent',
            border: `1px solid ${hoverDelete ? '#8B2020' : BORDER}`,
            color: hoverDelete ? BG : MUTED,
            fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2.5,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <Icon d={ICONS.trash} size={13} />
          SUPPRIMER
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ModifierDemandeClient() {
  const [demandes,      setDemandes]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [editDemande,   setEditDemande]   = useState(null)
  const [clientId,      setClientId]      = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    const decoded = jwt.decode(token)
    if (decoded?.id) {
      setClientId(decoded.id)
      fetchDemandes(decoded.id)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchDemandes = async (id) => {
    try {
      const res = await fetch(`/api/api_modifier_demande_client?id_client=${id}`)
      if (res.ok) {
        const data = await res.json()
        setDemandes(data.demandes || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette demande ?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/api_modifier_demande_client?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        toast.success('Demande supprimée', { position: 'top-center' })
        setDemandes(prev => prev.filter(d => d.id_demande_client !== id))
      } else {
        toast.error('Erreur lors de la suppression', { position: 'top-center' })
      }
    } catch {
      toast.error('Erreur réseau', { position: 'top-center' })
    }
  }

  const handleSaved = () => {
    setEditDemande(null)
    fetchDemandes(clientId)
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Header />

      <main style={{ flex: 1, padding: '52px 56px 72px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>
              ESPACE CLIENT
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1 }}>
              Gestion des demandes
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 14 }} />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, marginTop: 14, fontWeight: 300, letterSpacing: 0.3 }}>
              {loading ? 'Chargement…' : `${demandes.length} demande${demandes.length !== 1 ? 's' : ''} en cours`}
            </p>
          </div>
          {!loading && (
            <NewDemandeBtn onClick={() => router.push('/Demande_Client')} />
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: BG2, border: `1px solid ${BORDER}`, height: 320, opacity: 0.5 }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && demandes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: TEXT, marginBottom: 10 }}>
              Aucune demande en cours
            </div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, fontWeight: 300, marginBottom: 32, lineHeight: 1.8 }}>
              Vous n'avez pas encore soumis de demande personnalisée.
            </p>
            <NewDemandeBtn onClick={() => router.push('/Demande_Client')} />
          </div>
        )}

        {/* Cards grid */}
        {!loading && demandes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {demandes.map(d => (
              <DemandeCard
                key={d.id_demande_client}
                demande={d}
                onDelete={handleDelete}
                onEdit={setEditDemande}
              />
            ))}
          </div>
        )}

        {/* Bottom bar */}
        {!loading && (
          <div style={{ marginTop: 64, paddingTop: 20, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT }}>
              © {new Date().getFullYear()} E-KRILI — IMMOBILIER DE PRESTIGE
            </span>
            <span
              onClick={() => router.push('/clientHouses')}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = FAINT}
            >
              ← RETOUR AU TABLEAU DE BORD
            </span>
          </div>
        )}

      </main>

      {/* Edit modal */}
      {editDemande && (
        <EditModal demande={editDemande} onClose={() => setEditDemande(null)} onSaved={handleSaved} />
      )}

      <ToastContainer toastStyle={{ background: BG2, color: TEXT, border: `1px solid ${BORDER}` }} />
    </div>
  )
}

function NewDemandeBtn({ onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 20px',
        background: hover ? '#9A7020' : GOLD,
        border: 'none', color: BG, flexShrink: 0,
        fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3,
        cursor: 'pointer', transition: 'background 0.2s',
      }}
    >
      <Icon d={ICONS.plus} size={12} />
      NOUVELLE DEMANDE
    </button>
  )
}