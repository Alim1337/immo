// pages/biens/[id]/index.js
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const TYPE_IMAGES = {
  VILLA:            'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  APPARTEMENT:      'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
  MAISON:           'https://www.livehome3d.com/assets/img/articles/design-house/how-to-design-a-house@2x.jpg',
  TERRAIN:          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
  BUREAU:           'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  LOCAL_COMMERCIAL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  STUDIO:           'https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3',
}

export default function BienDetail() {
  const router = useRouter()
  const { id } = router.query
  const { user, token, ready, isLoggedIn, isClient, canPublish } = useAuth()

  const [bien,       setBien]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [isFav,      setIsFav]      = useState(false)
  const [activeImg,  setActiveImg]  = useState(0)
  const [showNeg,    setShowNeg]    = useState(false)
  const [negForm,    setNegForm]    = useState({ prix_propose: '', commentaire: '', duree_proposee: '' })
  const [negLoading, setNegLoading] = useState(false)
  const [negError,   setNegError]   = useState('')
  const [negSuccess, setNegSuccess] = useState(false)
  const [copied,     setCopied]     = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/biens/${id}`)
      .then(r => r.json())
      .then(data => { setBien(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!isLoggedIn || !token || !id) return
    fetch('/api/favoris', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setIsFav((data || []).some(f => f.bien_id === parseInt(id))))
      .catch(() => {})
  }, [isLoggedIn, token, id])

  const toggleFav = async () => {
    if (!token) return router.push('/login')
    const method = isFav ? 'DELETE' : 'POST'
    await fetch('/api/favoris', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ bien_id: parseInt(id) }),
    })
    setIsFav(f => !f)
  }

  const handleNeg = async e => {
    e.preventDefault()
    setNegError('')
    if (!negForm.prix_propose) { setNegError('Le prix proposé est obligatoire.'); return }
    setNegLoading(true)
    try {
      const res  = await fetch('/api/negociations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ bien_id: parseInt(id), ...negForm }),
      })
      const data = await res.json()
      if (!res.ok) { setNegError(data.error || 'Erreur.'); return }
      setNegSuccess(true)
      setTimeout(() => router.push(`/negociations/${data.id}`), 1500)
    } catch {
      setNegError('Erreur réseau.')
    } finally {
      setNegLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isOwner = user && bien && user.id === bien.proprietaire_id

  if (loading) return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 3 }}>
          <div style={{ height: 500, background: BG2, animationName: 'pulse', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          <div style={{ height: 500, background: BG2, animationName: 'pulse', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        </div>
      </div>
      <style jsx>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )

  if (!bien || bien.error) return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: TEXT, marginBottom: 12 }}>Bien introuvable</div>
        <button onClick={() => router.push('/biens')} style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 28px', cursor: 'pointer', marginTop: 24 }}>
          RETOUR AU CATALOGUE
        </button>
      </div>
    </div>
  )

  const images = bien.images?.length ? bien.images : [TYPE_IMAGES[bien.type_bien] || TYPE_IMAGES.APPARTEMENT]
  const owner  = bien.proprietaire
  const ownerName = owner?.raison_sociale || `${owner?.prenom || ''} ${owner?.nom || ''}`.trim()

  return (
    <>
      <Head><title>{bien.titre} — E-Krili</title></Head>
      <style jsx global>{`body { background: #EDE9E1 !important; } @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Breadcrumb ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => router.push('/biens')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
              ← CATALOGUE
            </button>
            <span style={{ color: BORDER }}>|</span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>{bien.type_bien}</span>
            <span style={{ color: BORDER }}>|</span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bien.titre}</span>
          </div>
        </div>

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

            {/* ── LEFT: Images + Details ── */}
            <div>
              {/* Main image */}
              <div style={{ position: 'relative', height: 480, overflow: 'hidden', marginBottom: 4 }}>
                <Image src={images[activeImg]} alt={bien.titre} fill style={{ objectFit: 'cover' }} priority />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,10,0.3) 0%, transparent 40%)', pointerEvents: 'none' }} />

                {/* badges */}
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: '#F5F0E8', background: 'rgba(20,15,10,0.65)', padding: '5px 12px', backdropFilter: 'blur(4px)' }}>
                    {bien.type_bien}
                  </div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD, background: 'rgba(20,15,10,0.65)', padding: '5px 12px' }}>
                    {bien.type_transaction?.replace('_', ' ')}
                  </div>
                  {bien.est_meuble && (
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: '#F5F0E8', background: `rgba(184,137,42,0.8)`, padding: '5px 12px' }}>
                      MEUBLÉ
                    </div>
                  )}
                </div>

                {/* nav arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                      style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(237,233,225,0.9)', border: 'none', width: 36, height: 36, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ‹
                    </button>
                    <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(237,233,225,0.9)', border: 'none', width: 36, height: 36, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ›
                    </button>
                  </>
                )}

                {/* image counter */}
                <div style={{ position: 'absolute', bottom: 14, right: 14, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: '#F5F0E8', background: 'rgba(20,15,10,0.6)', padding: '4px 10px' }}>
                  {activeImg + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 3, marginBottom: 32 }}>
                  {images.map((src, i) => (
                    <div key={i} onClick={() => setActiveImg(i)}
                      style={{ position: 'relative', width: 80, height: 56, cursor: 'pointer', flexShrink: 0, overflow: 'hidden', border: `1px solid ${i === activeImg ? GOLD : 'transparent'}`, transition: 'border-color 0.2s' }}>
                      <Image src={src} alt="" fill style={{ objectFit: 'cover', opacity: i === activeImg ? 1 : 0.65 }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Title + location */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 10 }}>
                  {bien.wilaya?.toUpperCase()}
                </div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: TEXT, margin: '0 0 12px' }}>
                  {bien.titre}
                </h1>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {[bien.adresse, bien.ville, bien.wilaya, bien.code_postal].filter(Boolean).join(', ')}
                </div>
              </div>

              {/* Key stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 3, marginBottom: 40 }}>
                {[
                  { label: 'PRIX',       value: `${Number(bien.prix).toLocaleString('fr-DZ')} DZD` },
                  bien.superficie    && { label: 'SUPERFICIE',  value: `${bien.superficie} m²` },
                  bien.nbr_chambres  && { label: 'CHAMBRES',    value: bien.nbr_chambres },
                  bien.nbr_salles_bain && { label: 'SALLES DE BAIN', value: bien.nbr_salles_bain },
                  bien.nbr_etages    && { label: 'ÉTAGES',      value: bien.nbr_etages },
                  { label: 'ÉTAT',       value: bien.etat },
                  { label: 'VUES',       value: bien._count?.visites || 0 },
                ].filter(Boolean).map(s => (
                  <div key={s.label} style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '16px 14px' }}>
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: FAINT, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, color: TEXT }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {bien.description && (
                <div style={{ marginBottom: 40 }}>
                  <SectionTitle>DESCRIPTION</SectionTitle>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300, color: MUTED, lineHeight: 1.8, margin: 0 }}>
                    {bien.description}
                  </p>
                </div>
              )}

              {/* Équipements */}
              {bien.equipements?.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <SectionTitle>ÉQUIPEMENTS</SectionTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {bien.equipements.map(eq => (
                      <div key={eq} style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 1, color: MUTED, border: `1px solid ${BORDER}`, padding: '5px 12px' }}>
                        {eq}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avis */}
              {bien.avis?.length > 0 && (
                <div>
                  <SectionTitle>AVIS ({bien.avis.length})</SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {bien.avis.map(a => (
                      <div key={a.id} style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: TEXT }}>
                            {a.auteur?.nom}
                          </div>
                          <div style={{ color: GOLD, fontSize: 12 }}>
                            {'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}
                          </div>
                        </div>
                        {a.commentaire && (
                          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300, color: MUTED, margin: 0 }}>
                            {a.commentaire}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Sticky sidebar ── */}
            <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* Price card */}
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '28px 24px' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: GOLD, marginBottom: 4 }}>
                  {Number(bien.prix).toLocaleString('fr-DZ')} DZD
                </div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 24 }}>
                  {bien.type_transaction?.replace('_', ' ')}
                </div>

                {/* Action buttons */}
                {isOwner ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={() => router.push(`/biens/${id}/modifier`)}
                      style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px', cursor: 'pointer', transition: 'opacity 0.2s', width: '100%' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                      MODIFIER CE BIEN
                    </button>
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: GOLD, border: `1px solid ${BORDER}`, padding: '10px', textAlign: 'center' }}>
                      VOTRE BIEN · {bien._count?.negotiations || 0} NÉGOCIATION(S)
                    </div>
                  </div>
                ) : isClient ? (
                  <div>
                    {!showNeg ? (
                      <button onClick={() => setShowNeg(true)}
                        style={{ width: '100%', background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '15px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        JE SUIS INTÉRESSÉ
                      </button>
                    ) : negSuccess ? (
                      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: '#2ECC71', textAlign: 'center', padding: '20px 0' }}>
                        ✓ Négociation créée ! Redirection…
                      </div>
                    ) : (
                      <form onSubmit={handleNeg} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD }}>PROPOSITION</div>
                        {negError && <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: '#C0392B', borderLeft: `2px solid #C0392B`, paddingLeft: 8 }}>{negError}</div>}
                        <div>
                          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, marginBottom: 4 }}>PRIX PROPOSÉ (DZD) *</div>
                          <input type="number" value={negForm.prix_propose} onChange={e => setNegForm(f => ({ ...f, prix_propose: e.target.value }))}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${BORDER}`, color: TEXT, fontFamily: "'Raleway', sans-serif", fontSize: 13, padding: '8px 0', outline: 'none' }}
                            onFocus={e => e.target.style.borderBottomColor = GOLD} onBlur={e => e.target.style.borderBottomColor = BORDER} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, marginBottom: 4 }}>DURÉE PROPOSÉE</div>
                          <input value={negForm.duree_proposee} onChange={e => setNegForm(f => ({ ...f, duree_proposee: e.target.value }))} placeholder="Ex: 12 mois"
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${BORDER}`, color: TEXT, fontFamily: "'Raleway', sans-serif", fontSize: 13, padding: '8px 0', outline: 'none' }}
                            onFocus={e => e.target.style.borderBottomColor = GOLD} onBlur={e => e.target.style.borderBottomColor = BORDER} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, marginBottom: 4 }}>MESSAGE</div>
                          <textarea value={negForm.commentaire} onChange={e => setNegForm(f => ({ ...f, commentaire: e.target.value }))} rows={3}
                            placeholder="Présentez-vous et précisez vos besoins…"
                            style={{ width: '100%', background: 'transparent', border: `1px solid ${BORDER}`, color: TEXT, fontFamily: "'Raleway', sans-serif", fontSize: 12, padding: '8px 10px', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                            onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="button" onClick={() => setShowNeg(false)}
                            style={{ flex: 1, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, padding: '11px', cursor: 'pointer' }}>
                            ANNULER
                          </button>
                          <button type="submit" disabled={negLoading}
                            style={{ flex: 2, background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, padding: '11px', cursor: negLoading ? 'not-allowed' : 'pointer', opacity: negLoading ? 0.6 : 1 }}>
                            {negLoading ? 'ENVOI…' : 'ENVOYER'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : !isLoggedIn ? (
                  <button onClick={() => router.push('/login')}
                    style={{ width: '100%', background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '15px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = BG }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = GOLD }}>
                    CONNEXION REQUISE
                  </button>
                ) : null}

                {/* Fav + share */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {isLoggedIn && (
                    <button onClick={toggleFav}
                      style={{ flex: 1, background: 'transparent', border: `1px solid ${BORDER}`, color: isFav ? GOLD : MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={isFav ? GOLD : 'none'} stroke={isFav ? GOLD : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {isFav ? 'SAUVEGARDÉ' : 'SAUVEGARDER'}
                    </button>
                  )}
                  <button onClick={copyLink}
                    style={{ flex: 1, background: 'transparent', border: `1px solid ${BORDER}`, color: copied ? GOLD : MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, padding: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {copied ? '✓ COPIÉ' : 'PARTAGER'}
                  </button>
                </div>
              </div>

              {/* Owner card */}
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '20px 24px' }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 14 }}>PUBLIÉ PAR</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, background: BORDER, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: GOLD, flexShrink: 0 }}>
                    {ownerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 1, color: TEXT }}>
                      {ownerName}
                      {owner?.est_verifie && <span style={{ marginLeft: 6, color: GOLD, fontSize: 10 }}>✓</span>}
                    </div>
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: FAINT, marginTop: 2 }}>
                      {bien._count?.negotiations || 0} négociation(s) · {bien._count?.visites || 0} vue(s)
                    </div>
                  </div>
                </div>
                <button onClick={() => router.push(`/profil/${owner?.id}`)}
                  style={{ width: '100%', background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, padding: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}>
                  VOIR LE PROFIL
                </button>
              </div>

              {/* Published date */}
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: FAINT, textAlign: 'center', padding: '10px 0' }}>
                Publié le {new Date(bien.date_publication).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: FAINT, whiteSpace: 'nowrap' }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  )
}