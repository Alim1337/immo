// pages/index.js — E-Krili landing page
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header'

const GOLD   = '#B8892A'
const GOLD_L = '#D4A84B'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const DARK   = '#1E1A14'
const BORDER = 'rgba(184,137,42,0.22)'

const STATS = [
  { value: '2 400+', label: 'Biens disponibles' },
  { value: '580+',   label: 'Propriétaires actifs' },
  { value: '48',     label: 'Wilayas couvertes' },
  { value: '94%',    label: 'Satisfaction client' },
]

const TYPES = [
  { label: 'Appartement', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10', filter: 'APPARTEMENT' },
  { label: 'Villa',       icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10', filter: 'VILLA' },
  { label: 'Bureau',      icon: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM8 21V7m8 14V7', filter: 'BUREAU' },
  { label: 'Terrain',     icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 0 0 6.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 0 0 6.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', filter: 'TERRAIN' },
]

const HOW = [
  { n: '01', title: 'Créez votre compte',     body: 'Inscrivez-vous en tant que client, propriétaire ou agence en quelques secondes.' },
  { n: '02', title: 'Parcourez le catalogue', body: 'Filtrez par wilaya, type, prix et superficie. Sauvegardez vos coups de cœur.' },
  { n: '03', title: 'Négociez directement',   body: 'Contactez le propriétaire, échangez des messages et fixez un rendez-vous.' },
]

const Ico = ({ d, size = 22, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

function GoldRule({ width = 40 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
      <div style={{ width, height: 1, background: GOLD }} />
      <div style={{ width: 4, height: 4, background: GOLD, transform: 'rotate(45deg)', flexShrink: 0 }} />
    </div>
  )
}

export default function Index() {
  const router = useRouter()
  const [searchType, setSearchType] = useState('LOCATION')
  const [searchWilaya, setSearchWilaya] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType)  params.set('type_transaction', searchType)
    if (searchWilaya) params.set('wilaya', searchWilaya)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <>
      <Head><title>E-Krili — Immobilier de prestige en Algérie</title></Head>
      <div style={{ background: BG, minHeight: '100vh' }}>
        <Header />

        {/* ── Hero ── */}
        <section style={{ position: 'relative', height: '88vh', minHeight: 560, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          {/* Background image */}
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=70"
            alt="Luxury property"
            fill
            style={{ objectFit: 'cover', filter: 'brightness(0.5) saturate(0.75)' }}
            priority
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,15,10,0.75) 0%, rgba(20,15,10,0.25) 60%, transparent 100%)' }} />
          {/* Gold top rule */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${GOLD}, transparent 50%)` }} />

          <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 56px', width: '100%' }}>
            <div style={{ maxWidth: 560 }}>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 6, color: GOLD_L, marginBottom: 20 }}>
                IMMOBILIER DE PRESTIGE · ALGÉRIE
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 58, fontWeight: 300, color: '#F5F0E8', margin: 0, lineHeight: 1.05 }}>
                Trouvez le bien
                <br />
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>qui vous ressemble</em>
              </h1>
              <GoldRule width={56} />
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(245,240,232,0.7)', marginTop: 20, lineHeight: 1.9, letterSpacing: 0.5 }}>
                Des appartements, villas et locaux d'exception<br />partout en Algérie — location et vente.
              </p>

              {/* Search bar */}
              <div style={{ marginTop: 36, display: 'flex', gap: 0, background: 'rgba(237,233,225,0.1)', backdropFilter: 'blur(10px)', border: `1px solid rgba(184,137,42,0.35)` }}>
                {/* Transaction toggle */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {['LOCATION', 'VENTE'].map(t => (
                    <button key={t} onClick={() => setSearchType(t)}
                      style={{ flex: 1, padding: '0 18px', background: searchType === t ? GOLD : 'transparent', border: 'none', color: searchType === t ? '#FFF' : 'rgba(245,240,232,0.5)', fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {t}
                    </button>
                  ))}
                </div>
                {/* Wilaya input */}
                <input
                  value={searchWilaya}
                  onChange={e => setSearchWilaya(e.target.value)}
                  placeholder="Wilaya, ville…"
                  style={{ flex: 1, background: 'transparent', border: 'none', borderLeft: `1px solid rgba(184,137,42,0.25)`, padding: '18px 20px', fontFamily: "'Raleway', sans-serif", fontSize: 12, color: '#F5F0E8', outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                {/* Search button */}
                <button onClick={handleSearch}
                  style={{ padding: '0 28px', background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#9A7020'}
                  onMouseLeave={e => e.currentTarget.style.background = GOLD}
                >
                  RECHERCHER
                </button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: scrolled ? 0 : 0.6, transition: 'opacity 0.4s' }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: 'rgba(245,240,232,0.7)' }}>DÉFILER</div>
            <div style={{ width: 1, height: 40, background: 'rgba(245,240,232,0.4)', animation: 'scrollBar 1.5s ease-in-out infinite' }} />
          </div>
        </section>

        {/* ── Stats band ── */}
        <section style={{ background: DARK, borderTop: `1px solid rgba(184,137,42,0.2)`, borderBottom: `1px solid rgba(184,137,42,0.2)` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '36px 0', borderRight: i < 3 ? '1px solid rgba(184,137,42,0.12)' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: GOLD_L }}>{s.value}</div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Browse by type ── */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>CATALOGUE</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: TEXT, margin: 0 }}>
                Parcourez par type de bien
              </h2>
              <GoldRule />
            </div>
            <button onClick={() => router.push('/biens')}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: GOLD, background: 'none', border: `1px solid ${BORDER}`, padding: '12px 24px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(184,137,42,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = 'none' }}
            >
              VOIR TOUT →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            {TYPES.map(t => (
              <TypeCard key={t.label} {...t} onClick={() => router.push(`/biens?type_bien=${t.filter}`)} />
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 56px' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 10 }}>COMMENT ÇA MARCHE</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: TEXT, margin: 0 }}>Simple, rapide, transparent</h2>
              <div style={{ width: 40, height: 1, background: GOLD, margin: '16px auto 0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
              {HOW.map(h => (
                <div key={h.n} style={{ padding: '36px 32px', background: BG, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: GOLD, lineHeight: 1, marginBottom: 20, opacity: 0.5 }}>{h.n}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: TEXT, marginBottom: 12 }}>{h.title}</div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, fontWeight: 300, lineHeight: 1.8 }}>{h.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band ── */}
        <section style={{ background: DARK, padding: '88px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(-55deg, transparent, transparent 80px, rgba(184,137,42,0.03) 80px, rgba(184,137,42,0.03) 81px)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 5, color: GOLD, marginBottom: 16 }}>PROPRIÉTAIRES & AGENCES</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: '#F5F0E8', margin: '0 0 16px', lineHeight: 1.1 }}>
              Publiez votre bien<br /><em>gratuitement</em>
            </h2>
            <div style={{ width: 40, height: 1, background: GOLD, margin: '0 auto 24px' }} />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(245,240,232,0.6)', lineHeight: 1.9, marginBottom: 40 }}>
              Rejoignez des centaines de propriétaires et agences qui font confiance à E-Krili pour trouver leurs locataires et acheteurs.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <CTABtn primary onClick={() => router.push('/inscription')}>CRÉER UN COMPTE</CTABtn>
              <CTABtn onClick={() => router.push('/biens')}>PARCOURIR LES BIENS</CTABtn>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: '#16120D', borderTop: `1px solid rgba(184,137,42,0.15)`, padding: '48px 56px 32px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, letterSpacing: 5, color: GOLD_L }}>E-KRILI</div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 4, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>IMMOBILIER DE PRESTIGE</div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 300, marginTop: 16, maxWidth: 240, lineHeight: 1.8 }}>
                  La plateforme immobilière de référence en Algérie.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 64 }}>
                {[
                  { title: 'Plateforme', links: [['Parcourir les biens', '/biens'], ['Publier un bien', '/inscription'], ['Mon espace', '/panel']] },
                  { title: 'Compte',     links: [['Se connecter', '/login'], ["S'inscrire", '/inscription'], ['Aide', '/support']] },
                ].map(col => (
                  <div key={col.title}>
                    <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 16 }}>{col.title.toUpperCase()}</div>
                    {col.links.map(([label, href]) => (
                      <div key={label} onClick={() => router.push(href)}
                        style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = GOLD_L}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                      >{label}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: `1px solid rgba(184,137,42,0.1)`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.2)' }}>
                © {new Date().getFullYear()} E-KRILI — TOUS DROITS RÉSERVÉS
              </span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.2)' }}>
                ALGÉRIE
              </span>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes scrollBar { 0%,100%{opacity:0.4;transform:scaleY(0.7)} 50%{opacity:1;transform:scaleY(1)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </div>
    </>
  )
}

function TypeCard({ label, icon, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? BG2 : BG, border: `1px solid ${hover ? GOLD : BORDER}`, padding: '36px 28px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.2s', transform: hover ? 'translateY(-2px)' : 'none', boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.07)' : 'none' }}
    >
      <div style={{ color: hover ? GOLD : FAINT, transition: 'color 0.2s' }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: hover ? TEXT : MUTED, fontWeight: 500, transition: 'color 0.2s' }}>{label.toUpperCase()}</div>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: GOLD, opacity: hover ? 1 : 0, transition: 'opacity 0.2s', marginTop: 8 }}>VOIR →</div>
      </div>
    </button>
  )
}

function CTABtn({ children, onClick, primary }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ padding: '14px 32px', background: primary ? (hover ? '#9A7020' : GOLD) : 'transparent', border: primary ? 'none' : `1px solid rgba(184,137,42,0.4)`, color: primary ? '#FFF' : (hover ? GOLD_L : 'rgba(245,240,232,0.6)'), fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, cursor: 'pointer', transition: 'all 0.2s' }}
    >{children}</button>
  )
}