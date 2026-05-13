import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Header from '@/components/Header';
import CardHouseModifier from '@/components/CardHouse_Modifier';
import CardHouseModifiervip from '@/components/CardHouse_Modifier_vip';
import Footer from '@/components/Footer';

/* ── Design tokens ── */
const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'
const VIP    = '#7A6030'

const TABS = ['Tous', 'Standard', 'VIP']

export default function GestionBienModify() {
  const [biens,          setBiens]          = useState([])
  const [biensVip,       setBiensVip]       = useState([])
  const [activeTab,      setActiveTab]      = useState('Tous')
  const [loading,        setLoading]        = useState(true)
  const [idProprietaire, setIdProprietaire] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const decoded = jwt.decode(token)
      if (decoded?.id) {
        setIdProprietaire(decoded.id)
        fetchBiens(decoded.id)
      }
    } catch (e) {
      console.error('Token decode error:', e)
    }
  }, [])

  const fetchBiens = async (id_proprietaire) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/api_modifier_bien?id_proprietaire=${id_proprietaire}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.ok) {
        const { biens, biens_vip } = await res.json()
        setBiens(biens || [])
        setBiensVip(biens_vip || [])
      }
    } catch (e) {
      console.error('Fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  const displayStandard = activeTab === 'Tous' || activeTab === 'Standard'
  const displayVip      = activeTab === 'Tous' || activeTab === 'VIP'
  const total = (displayStandard ? biens.length : 0) + (displayVip ? biensVip.length : 0)

  return (
    <div className="gestion-page" style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <style jsx global>{`
        body { background: #EDE9E1 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        /* Hide the full-viewport hero banner - it is a sibling of the header
           rendered by CardHouseModifier or a parent layout component.
           It appears as a block-level image spanning 100% width right after
           the sticky header. We target it by its structural position. */
        .gestion-page > img,
        .gestion-page > div > img,
        .gestion-page > span > img {
          display: none !important;
        }
        /* Also hide any next/image full-bleed block directly inside the page root */
        .gestion-page > span[style],
        .gestion-page > div[style*="width: 100vw"],
        .gestion-page > div[style*="width:100vw"] {
          display: none !important;
        }
      `}</style>

      <Header />

      {/* ── Page header ── */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, background: BG }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 0' }}>

          {/* breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => router.back()}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Raleway', sans-serif", fontSize: 10,
                letterSpacing: 3, color: MUTED, display: 'flex', alignItems: 'center', gap: 6,
                padding: 0, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = MUTED}
            >
              ← RETOUR
            </button>
            <span style={{ color: BORDER, fontSize: 12 }}>|</span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>
              MES BIENS
            </span>
          </div>

          {/* title row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>
                ESPACE PROPRIÉTAIRE
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1.1 }}>
                Gestion de vos biens
              </h1>
              <div style={{ width: 40, height: 1, background: GOLD, marginTop: 14 }} />
            </div>

            <button
              onClick={() => router.push('/ajout-bien')}
              style={{
                background: GOLD, border: 'none', cursor: 'pointer',
                fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                color: '#FFF8EE', padding: '14px 28px',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              + AJOUTER UN BIEN
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: `2px solid ${activeTab === t ? GOLD : 'transparent'}`,
                  fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                  color: activeTab === t ? GOLD : MUTED, padding: '12px 20px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box' }}>

        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT, marginBottom: 32 }}>
          {loading
            ? 'CHARGEMENT…'
            : `${total} BIEN${total !== 1 ? 'S' : ''} TROUVÉ${total !== 1 ? 'S' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 3 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 340, background: BG2, animationName: 'pulse', animationDuration: '1.5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
            ))}
          </div>
        ) : total === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: TEXT, marginBottom: 12 }}>
              Aucun bien enregistré
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, color: FAINT, marginBottom: 40 }}>
              Commencez par ajouter votre premier bien immobilier
            </div>
            <button
              onClick={() => router.push('/ajout-bien')}
              style={{
                background: 'none', border: `1px solid ${GOLD}`, cursor: 'pointer',
                fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3,
                color: GOLD, padding: '14px 32px', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#FFF8EE' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = GOLD }}
            >
              + AJOUTER UN BIEN
            </button>
          </div>
        ) : (
          <>
            {/* VIP section */}
            {displayVip && biensVip.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{
                    fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5,
                    color: VIP, padding: '5px 12px', border: `1px solid ${VIP}`,
                  }}>
                    ★ BIENS VIP
                  </div>
                  <div style={{ flex: 1, height: 1, background: BORDER }} />
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT }}>
                    {biensVip.length} BIEN{biensVip.length !== 1 ? 'S' : ''}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 3 }}>
                  {biensVip.map(bien => (
                    <CardHouseModifiervip
                      key={bien.id_biens}
                      id_biens={bien.id_biens}
                      description={bien.description}
                      type_bien={bien.type_bien}
                      nbrChambre={bien.nbrChambre}
                      type_location_vip={bien.type_location_vip}
                      adresse={bien.adresse}
                      ville={bien.ville}
                      code_postal={bien.code_postal}
                      prix_estime={bien.prix_estime}
                      etat={bien.etat}
                      Proprietaire={bien.Proprietaire}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Standard section */}
            {displayStandard && biens.length > 0 && (
              <div>
                {activeTab === 'Tous' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{
                      fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5,
                      color: MUTED, padding: '5px 12px', border: `1px solid ${BORDER}`,
                    }}>
                      BIENS STANDARD
                    </div>
                    <div style={{ flex: 1, height: 1, background: BORDER }} />
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT }}>
                      {biens.length} BIEN{biens.length !== 1 ? 'S' : ''}
                    </span>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 3 }}>
                  {biens.map(bien => (
                    <CardHouseModifier
                      key={bien.id_biens}
                      id_biens={bien.id_biens}
                      description={bien.description}
                      type_bien={bien.type_bien}
                      nbrChambre={bien.nbrChambre}
                      adresse={bien.adresse}
                      ville={bien.ville}
                      code_postal={bien.code_postal}
                      prix_estime={bien.prix_estime}
                      etat={bien.etat}
                      Proprietaire={bien.Proprietaire}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

    </div>
  )
}