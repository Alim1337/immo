import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

function Banner() {
  const router = useRouter()
  return (
    <div style={{ position: 'relative', height: '620px', overflow: 'hidden', background: '#EDE9E1' }}>
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80"
        fill
        style={{ objectFit: 'cover', opacity: 0.55, filter: 'saturate(0.8)' }}
        alt="Banner"
        priority
      />
      {/* Warm overlay — stronger on left for text legibility, lighter on right to show image */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(237,233,225,0.92) 0%, rgba(237,233,225,0.55) 45%, rgba(237,233,225,0.3) 100%)' }} />

      {/* Decorative rings */}
      <div style={{ position: 'absolute', right: -80, top: -80, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(184,137,42,0.1)' }} />
      <div style={{ position: 'absolute', right: 30, top: 30, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(184,137,42,0.13)' }} />

      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #B8892A, transparent)' }} />

      {/* Text content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', maxWidth: 760 }}>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 6, color: '#B8892A', marginBottom: 20 }}>
          PROPRIÉTÉS D&apos;EXCEPTION · ALGÉRIE
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 68, fontWeight: 300, color: '#1A1713', lineHeight: 1.05, margin: 0 }}>
          Vous ne savez<br />
          <span style={{ fontStyle: 'italic', color: '#B8892A' }}>où aller ?</span>
        </h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300, color: '#5A5248', letterSpacing: 0.8, lineHeight: 1.9, marginTop: 20, maxWidth: 440 }}>
          Des biens soigneusement sélectionnés pour une clientèle exigeante.<br />
          Luxe, prestige et raffinement — à votre portée.
        </p>
        <div>
          <button
            className="banner-cta"
            onClick={() => router.push({ pathname: 'homesList', query: { location: 'Discover' } })}
          >
            DÉCOUVRIR
          </button>
        </div>
      </div>

      {/* Stats bottom-right */}
      <div style={{ position: 'absolute', bottom: 50, right: 80, display: 'flex', gap: 2 }}>
        <div className="banner-stat">
          <div className="banner-stat-num">500+</div>
          <div className="banner-stat-label">BIENS</div>
        </div>
        <div className="banner-stat">
          <div className="banner-stat-num">12+</div>
          <div className="banner-stat-label">QUARTIERS</div>
        </div>
        <div className="banner-stat">
          <div className="banner-stat-num">★ VIP</div>
          <div className="banner-stat-label">SÉLECTION</div>
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,137,42,0.45), transparent)' }} />
    </div>
  )
}

export default Banner