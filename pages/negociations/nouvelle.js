// pages/negociations/nouvelle.js
// Reached via: router.push(`/negociations/nouvelle?proprietaire_id=X&bien_id=Y`)
// bien_id is optional — if omitted the user picks from the owner's available biens.

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
const BORDER = 'rgba(184,137,42,0.22)'
const RED    = '#E74C3C'

export default function NouvelleNegociation() {
  const router = useRouter()
  const { proprietaire_id, bien_id: queryBienId } = router.query
  const { user, token, ready, isLoggedIn } = useAuth()

  const [biens,        setBiens]        = useState([])
  const [proprietaire, setProprietaire] = useState(null)
  const [selectedBien, setSelectedBien] = useState(queryBienId || '')
  const [prix,         setPrix]         = useState('')
  const [commentaire,  setCommentaire]  = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [error,        setError]        = useState('')
  const [loadingPage,  setLoadingPage]  = useState(true)

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    if (!ready) return
    if (!isLoggedIn) { router.push('/login'); return }
    if (!proprietaire_id) return

    const load = async () => {
      try {
        // Load the owner's profile + their biens
        const res  = await fetch(`/api/users/${proprietaire_id}`, { headers })
        const data = await res.json()
        setProprietaire(data)
        const available = (data.biens || []).filter(b => b.statut !== 'VENDU' && b.statut !== 'LOUE')
        setBiens(available)

        // Pre-select if a bien_id was provided in query
        if (queryBienId) {
          setSelectedBien(queryBienId)
          const bien = available.find(b => String(b.id) === String(queryBienId))
          if (bien) setPrix(String(bien.prix))
        }
      } catch (e) {
        setError('Impossible de charger les informations.')
      } finally {
        setLoadingPage(false)
      }
    }
    load()
  }, [ready, isLoggedIn, proprietaire_id, queryBienId])

  const selectedBienObj = biens.find(b => String(b.id) === String(selectedBien))

  const handleBienChange = (e) => {
    const val  = e.target.value
    setSelectedBien(val)
    const bien = biens.find(b => String(b.id) === val)
    if (bien) setPrix(String(bien.prix)) // pre-fill with listed price
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedBien) return setError('Veuillez sélectionner un bien.')
    if (!prix || isNaN(parseFloat(prix)) || parseFloat(prix) <= 0) {
      return setError('Veuillez entrer un prix valide.')
    }

    setSubmitting(true)
    try {
      const res  = await fetch('/api/negociations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body:    JSON.stringify({
          bien_id:         parseInt(selectedBien),
          proprietaire_id: parseInt(proprietaire_id),
          prix_propose:    parseFloat(prix),
          commentaire:     commentaire.trim() || undefined,
        }),
      })
      const data = await res.json()

      if (res.status === 409) {
        // Already an open negociation — redirect to it
        return router.push(`/negociations/${data.id}`)
      }
      if (!res.ok) return setError(data.error || 'Erreur lors de la création.')

      router.push(`/negociations/${data.id}`)
    } catch {
      setError('Erreur réseau, veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  const ownerName = proprietaire
    ? proprietaire.raison_sociale || `${proprietaire.prenom || ''} ${proprietaire.nom || ''}`.trim()
    : '…'

  if (!ready || loadingPage) return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 60, background: BG2, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
      <style jsx>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )

  return (
    <>
      <Head><title>Nouvelle négociation — E-Krili</title></Head>
      <style jsx global>{`body { background: #EDE9E1 !important; }`}</style>

      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* Breadcrumb */}
        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => router.back()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = MUTED}>
              ← RETOUR
            </button>
            <span style={{ color: BORDER }}>|</span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>NOUVELLE NÉGOCIATION</span>
          </div>
        </div>

        <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 40px 80px', width: '100%', boxSizing: 'border-box' }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>
              CONTACTER UN PROPRIÉTAIRE
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: TEXT, margin: '0 0 8px' }}>
              {ownerName}
            </h1>
            <div style={{ width: 36, height: 1, background: GOLD }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Bien selector */}
            <div>
              <label style={{ display: 'block', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 10 }}>
                BIEN CONCERNÉ *
              </label>
              {biens.length === 0 ? (
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: FAINT, padding: '14px 0' }}>
                  Ce propriétaire n'a aucun bien disponible pour le moment.
                </div>
              ) : (
                <select value={selectedBien} onChange={handleBienChange} required
                  style={{ width: '100%', background: BG2, border: `1px solid ${BORDER}`, fontFamily: "'Raleway', sans-serif", fontSize: 13, color: TEXT, padding: '14px 16px', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                  <option value="">— Sélectionner un bien —</option>
                  {biens.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.titre} — {b.ville} ({Number(b.prix).toLocaleString('fr-DZ')} DZD)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selected bien info */}
            {selectedBienObj && (
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: TEXT, marginBottom: 4 }}>
                    {selectedBienObj.titre}
                  </div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: FAINT, letterSpacing: 1 }}>
                    {selectedBienObj.ville}{selectedBienObj.wilaya ? `, ${selectedBienObj.wilaya}` : ''}
                    {' · '}{selectedBienObj.type_transaction}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: FAINT, marginBottom: 2 }}>PRIX AFFICHÉ</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: GOLD }}>
                    {Number(selectedBienObj.prix).toLocaleString('fr-DZ')} DZD
                  </div>
                </div>
              </div>
            )}

            {/* Prix proposé */}
            <div>
              <label style={{ display: 'block', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 10 }}>
                VOTRE OFFRE (DZD) *
              </label>
              <input
                type="number" min="1" step="1000"
                value={prix} onChange={e => setPrix(e.target.value)}
                placeholder="Ex : 15000000"
                required
                style={{ width: '100%', background: BG2, border: `1px solid ${BORDER}`, fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: GOLD, padding: '14px 16px', outline: 'none', boxSizing: 'border-box' }}
              />
              {selectedBienObj && prix && !isNaN(parseFloat(prix)) && (
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: FAINT, marginTop: 6 }}>
                  {parseFloat(prix) < selectedBienObj.prix
                    ? `↓ ${((1 - parseFloat(prix) / selectedBienObj.prix) * 100).toFixed(1)}% en dessous du prix affiché`
                    : parseFloat(prix) > selectedBienObj.prix
                    ? `↑ ${((parseFloat(prix) / selectedBienObj.prix - 1) * 100).toFixed(1)}% au-dessus du prix affiché`
                    : '= Prix affiché'}
                </div>
              )}
            </div>

            {/* Message initial */}
            <div>
              <label style={{ display: 'block', fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 10 }}>
                MESSAGE INITIAL (optionnel)
              </label>
              <textarea
                value={commentaire} onChange={e => setCommentaire(e.target.value)}
                rows={4}
                placeholder="Présentez-vous et expliquez votre intérêt pour ce bien…"
                style={{ width: '100%', background: BG2, border: `1px solid ${BORDER}`, fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300, color: TEXT, padding: '14px 16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: RED, borderLeft: `2px solid ${RED}`, paddingLeft: 12 }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={submitting || biens.length === 0}
              style={{ background: submitting ? MUTED : GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '16px 32px', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s', alignSelf: 'flex-start' }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = GOLD_L }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = GOLD }}>
              {submitting ? 'ENVOI EN COURS…' : 'ENVOYER MA DEMANDE'}
            </button>

          </form>
        </main>
      </div>
    </>
  )
}