import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

const GOLD = '#B8892A'
const TEXT = '#1A1713'
const MUTED = '#5A5248'
const BG = '#EDE9E1'

/** @param {import('next').InferGetStaticPropsType<typeof getStaticProps>} props */
export default function Home({ exploreData, cardsData }) {
  const router = useRouter()

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Head>
        <title>E-Krili — Immobilier de Prestige</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Raleway:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header />
      <Banner />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>

        {/* ── EXPLORE NEARBY ── */}
        <section style={{ paddingTop: 72 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>
                DESTINATIONS PRISÉES
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: TEXT, margin: 0 }}>
                Explorer à proximité
              </h2>
              <div style={{ width: 40, height: 1, background: GOLD, marginTop: 14 }} />
            </div>
            <button
              onClick={() => router.push('/homesList')}
              style={{
                background: 'transparent', border: 'none',
                color: MUTED, fontFamily: "'Raleway', sans-serif",
                fontSize: 10, letterSpacing: 3, cursor: 'pointer',
                borderBottom: `1px solid rgba(184,137,42,0.35)`, paddingBottom: 2,
              }}
            >
              VOIR TOUT
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            {exploreData?.map((item) => (
              <div
                key={item.img}
                className="small-card"
                onClick={() => router.push({ pathname: '/homesList', query: { location: item.location } })}
              >
                <div style={{ position: 'relative', height: 220 }}>
                  <Image src={item.img} fill style={{ objectFit: 'cover' }} alt={item.location} />
                </div>
                <div className="small-card-border" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,10,0.72) 0%, transparent 52%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px' }}>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, fontWeight: 400, color: '#F5F0E8', letterSpacing: 1 }}>
                    {item.location}
                  </div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: '#D4A84B', marginTop: 3 }}>
                    {item.distance.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div style={{ height: 1, margin: '72px 0', background: 'linear-gradient(to right, transparent, rgba(184,137,42,0.35), transparent)' }} />

        {/* ── VIP SECTION ── */}
        <section style={{ paddingBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>
                COLLECTION EXCLUSIVE
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: TEXT, margin: 0 }}>
                Explorer les biens VIP
              </h2>
              <div style={{ width: 40, height: 1, background: GOLD, marginTop: 14 }} />
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: GOLD }}>
              ★ SÉLECTION PRESTIGE
            </div>
          </div>

          <div className="scroll-track" style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 8 }}>
            {cardsData?.map(({ img, title }) => (
              <div key={img} className="medium-card">
                <Image src={img} fill style={{ objectFit: 'cover' }} alt={title} />
                <div className="medium-card-border" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,10,0.82) 0%, rgba(20,15,10,0.08) 60%)' }} />
                <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: '#D4A84B' }}>
                  ★ VIP
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 300, color: '#F5F0E8', letterSpacing: 1 }}>
                    {title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div style={{ height: 1, marginBottom: 72, background: 'linear-gradient(to right, transparent, rgba(184,137,42,0.35), transparent)' }} />

        {/* ── LARGE PROMO ── */}
        <div style={{ position: 'relative', height: 340, marginBottom: 88, overflow: 'hidden', border: '1px solid rgba(184,137,42,0.18)' }}>
          <Image
            src="https://cdn.thespaces.com/wp-content/uploads/2023/01/MED439BFB92B97F4F45A30524FFADED34B5.jpeg"
            fill
            style={{ objectFit: 'cover', filter: 'brightness(0.38) saturate(0.55)' }}
            alt="Meilleur endroit"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(20,15,10,0.78) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px' }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: '#D4A84B', marginBottom: 14 }}>
              OFFRE EXCLUSIVE
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: '#F5F0E8', margin: 0, lineHeight: 1.1 }}>
              Le meilleur endroit<br />
              <span style={{ fontStyle: 'italic', color: '#D4A84B' }}>pour vous</span>
            </h2>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 3, color: '#9A9080', margin: '12px 0 28px' }}>
              PRENEZ VOTRE TEMPS
            </p>
            <div>
              <button
                className="large-cta"
                onClick={() => router.push('/homesList')}
                style={{
                  background: GOLD, border: 'none', color: '#EDE9E1',
                  fontFamily: "'Raleway', sans-serif", fontSize: 10,
                  fontWeight: 500, letterSpacing: 4, padding: '14px 40px',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
              >
                DÉCOUVRIR
              </button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  const exploreData = [
    { img: 'https://img.freepik.com/free-photo/old-buildings-port-evening_1268-14340.jpg', location: 'Bordj El Bahri', distance: '20 min' },
    { img: 'https://img.freepik.com/free-photo/design-house-modern-villa-with-open-plan-living_1258-169741.jpg', location: 'Aïn Benian', distance: '25 min' },
    { img: 'https://img.freepik.com/free-photo/3d-electric-car-building_23-2148972401.jpg', location: 'Hydra', distance: '15 min' },
    { img: 'https://img.freepik.com/free-photo/analog-landscape-city-with-buildings_23-2149661457.jpg', location: 'Dar El Beïda', distance: '30 min' },
    { img: 'https://img.freepik.com/free-photo/restaurant-complex-seashore-among-rocks_169016-12915.jpg', location: 'Aïn Taya', distance: '35 min' },
    { img: 'https://img.freepik.com/free-photo/beautiful-white-mosque-blue-sky_181624-39804.jpg', location: 'Birkhadem', distance: '20 min' },
    { img: 'https://img.freepik.com/free-photo/streets-with-architecture-resort-town_627829-8262.jpg', location: 'Zéralda', distance: '45 min' },
    { img: 'https://img.freepik.com/premium-photo/apartment-modern-houses-residential-buildings_250132-5234.jpg', location: 'Rouïba', distance: '40 min' },
  ]
  const cardsData = [
    { img: 'https://i.pinimg.com/originals/37/7e/6a/377e6a3255de4a183afbd9df0e32a1ce.jpg', title: 'Escapades en plein air' },
    { img: 'https://i.pinimg.com/564x/77/71/c1/7771c19e37d5d94526fc9b40c843192d.jpg', title: 'Des séjours uniques' },
    { img: 'https://i.pinimg.com/564x/a8/53/28/a85328fb6291717655363543beef809d.jpg', title: 'Maisons entières' },
    { img: 'https://i.pinimg.com/originals/84/0a/05/840a053cca1d1d54db7fb7b8ec1658ac.jpg', title: 'À découvrir' },
    { img: 'https://cdn.thespaces.com/wp-content/uploads/2023/01/MED439BFB92B97F4F45A30524FFADED34B5.jpeg', title: 'Le meilleur pour vous' },
  ]
  return { props: { exploreData, cardsData } }
}