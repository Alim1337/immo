// pages/biens/nouveau.js
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'

const GOLD   = '#B8892A'
const TEXT   = '#1A1713'
const MUTED  = '#5A5248'
const FAINT  = '#8A8278'
const BG     = '#EDE9E1'
const BG2    = '#E4DFD5'
const BORDER = 'rgba(184,137,42,0.22)'

const TYPES        = ['APPARTEMENT','VILLA','MAISON','BUREAU','LOCAL_COMMERCIAL','TERRAIN','STUDIO']
const TRANSACTIONS = ['LOCATION','VENTE','LOCATION_VACANCES']
const ETATS        = ['DISPONIBLE','RESERVE','LOUE','VENDU','SUSPENDU']
const WILAYAS      = ['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane']
const EQUIPEMENTS  = ['WiFi','Parking','Piscine','Ascenseur','Sécurité','Climatisation','Chauffage','Balcon','Terrasse','Jardin','Cave','Garage']

const iStyle = {
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: `1px solid ${BORDER}`, color: TEXT,
  fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 300,
  padding: '10px 0', outline: 'none', transition: 'border-color 0.3s',
  appearance: 'none',
}

function Field({ label, required, children, half }) {
  return (
    <div style={{ marginBottom: 28, gridColumn: half ? 'span 1' : undefined }}>
      <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 6 }}>
        {label.toUpperCase()}{required && <span style={{ color: GOLD }}> *</span>}
      </div>
      {children}
    </div>
  )
}

const STEPS = ['Informations', 'Localisation', 'Détails', 'Photos']

export default function BienNouveau() {
  const router = useRouter()
  const { token, ready, canPublish } = useAuth()

  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [images,  setImages]  = useState([])

  const [form, setForm] = useState({
    titre: '', description: '', type_bien: '', type_transaction: '',
    adresse: '', ville: '', wilaya: '', code_postal: '',
    superficie: '', nbr_chambres: '', nbr_salles_bain: '', nbr_etages: '',
    prix: '', etat: 'DISPONIBLE', est_meuble: false,
    equipements: [],
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const focus = e => e.target.style.borderBottomColor = GOLD
  const blur  = e => e.target.style.borderBottomColor = BORDER

  const toggleEquipement = eq => {
    setForm(f => ({
      ...f,
      equipements: f.equipements.includes(eq)
        ? f.equipements.filter(e => e !== eq)
        : [...f.equipements, eq],
    }))
  }

  const handleImageChange = e => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  const removeImage = idx => setImages(prev => prev.filter((_, i) => i !== idx))

  const validateStep = () => {
    if (step === 0 && (!form.titre || !form.type_bien || !form.type_transaction)) {
      setError('Titre, type de bien et transaction sont obligatoires.'); return false
    }
    if (step === 1 && (!form.ville || !form.wilaya)) {
      setError('Ville et wilaya sont obligatoires.'); return false
    }
    if (step === 2 && !form.prix) {
      setError('Le prix est obligatoire.'); return false
    }
    setError(''); return true
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const prev = () => { setError(''); setStep(s => s - 1) }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/biens', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ ...form, images }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur serveur.'); return }
      router.push(`/biens/${data.id}`)
    } catch {
      setError('Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  if (ready && !canPublish) {
    return (
      <div style={{ background: BG, minHeight: '100vh' }}>
        <Header />
        <div style={{ maxWidth: 480, margin: '100px auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: TEXT, marginBottom: 12 }}>
            Accès refusé
          </div>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: FAINT, marginBottom: 32 }}>
            Seuls les propriétaires et agences peuvent publier un bien.
          </div>
          <button onClick={() => router.push('/biens')} style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '14px 28px', cursor: 'pointer' }}>
            PARCOURIR LES BIENS
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head><title>Publier un bien — E-Krili</title></Head>
      <style jsx global>{`body { background: #EDE9E1 !important; }`}</style>

      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Page header ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, background: BG }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 40px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: MUTED, padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
                ← RETOUR
              </button>
              <span style={{ color: BORDER }}>|</span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, color: FAINT }}>NOUVEAU BIEN</span>
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 5, color: GOLD, marginBottom: 8 }}>PUBLICATION</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: TEXT, margin: 0 }}>Publier un bien</h1>
            <div style={{ width: 36, height: 1, background: GOLD, marginTop: 12 }} />
          </div>
        </div>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px 80px', flex: 1, width: '100%', boxSizing: 'border-box' }}>

          {/* ── Step indicator ── */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48 }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i < step ? GOLD : i === step ? 'transparent' : 'transparent',
                    border: `1px solid ${i <= step ? GOLD : BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Raleway', sans-serif", fontSize: 10,
                    color: i < step ? BG : i === step ? GOLD : FAINT,
                    transition: 'all 0.3s',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 2, color: i === step ? GOLD : FAINT }}>
                    {s.toUpperCase()}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: i < step ? GOLD : BORDER, margin: '0 8px', marginBottom: 22, transition: 'background 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {error && (
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: '#C0392B', borderLeft: '2px solid #C0392B', paddingLeft: 12, marginBottom: 28 }}>
              {error}
            </div>
          )}

          {/* ── Step 0: Informations ── */}
          {step === 0 && (
            <div>
              <Field label="Titre de l'annonce" required>
                <input style={iStyle} value={form.titre} onChange={set('titre')} onFocus={focus} onBlur={blur} placeholder="Ex: Bel appartement F3 vue mer" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Field label="Type de bien" required>
                  <select style={iStyle} value={form.type_bien} onChange={set('type_bien')} onFocus={focus} onBlur={blur}>
                    <option value="">Choisir…</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Type de transaction" required>
                  <select style={iStyle} value={form.type_transaction} onChange={set('type_transaction')} onFocus={focus} onBlur={blur}>
                    <option value="">Choisir…</option>
                    {TRANSACTIONS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  value={form.description} onChange={set('description')}
                  rows={4} onFocus={focus} onBlur={blur}
                  placeholder="Décrivez votre bien en détail…"
                  style={{ ...iStyle, resize: 'vertical', borderBottom: 'none', border: `1px solid ${BORDER}`, padding: '10px', lineHeight: 1.6 }}
                />
              </Field>
            </div>
          )}

          {/* ── Step 1: Localisation ── */}
          {step === 1 && (
            <div>
              <Field label="Adresse">
                <input style={iStyle} value={form.adresse} onChange={set('adresse')} onFocus={focus} onBlur={blur} placeholder="Numéro, rue, quartier" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Field label="Ville" required>
                  <input style={iStyle} value={form.ville} onChange={set('ville')} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="Wilaya" required>
                  <select style={iStyle} value={form.wilaya} onChange={set('wilaya')} onFocus={focus} onBlur={blur}>
                    <option value="">Choisir…</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Code postal">
                <input style={iStyle} value={form.code_postal} onChange={set('code_postal')} onFocus={focus} onBlur={blur} />
              </Field>
            </div>
          )}

          {/* ── Step 2: Détails ── */}
          {step === 2 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Field label="Prix (DZD)" required>
                  <input type="number" style={iStyle} value={form.prix} onChange={set('prix')} onFocus={focus} onBlur={blur} placeholder="0" />
                </Field>
                <Field label="Superficie (m²)">
                  <input type="number" style={iStyle} value={form.superficie} onChange={set('superficie')} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="Nombre de chambres">
                  <input type="number" style={iStyle} value={form.nbr_chambres} onChange={set('nbr_chambres')} onFocus={focus} onBlur={blur} min="0" />
                </Field>
                <Field label="Salles de bain">
                  <input type="number" style={iStyle} value={form.nbr_salles_bain} onChange={set('nbr_salles_bain')} onFocus={focus} onBlur={blur} min="0" />
                </Field>
                <Field label="Nombre d'étages">
                  <input type="number" style={iStyle} value={form.nbr_etages} onChange={set('nbr_etages')} onFocus={focus} onBlur={blur} min="0" />
                </Field>
                <Field label="État">
                  <select style={iStyle} value={form.etat} onChange={set('etat')} onFocus={focus} onBlur={blur}>
                    {ETATS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </Field>
              </div>

              {/* Meublé toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <button onClick={() => setForm(f => ({ ...f, est_meuble: !f.est_meuble }))}
                  style={{ width: 44, height: 24, borderRadius: 12, background: form.est_meuble ? GOLD : BORDER, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <span style={{ position: 'absolute', top: 2, left: form.est_meuble ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </button>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: MUTED }}>Bien meublé</span>
              </div>

              {/* Équipements */}
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 12 }}>ÉQUIPEMENTS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {EQUIPEMENTS.map(eq => (
                    <button key={eq} onClick={() => toggleEquipement(eq)}
                      style={{ background: form.equipements.includes(eq) ? GOLD : 'transparent', border: `1px solid ${form.equipements.includes(eq) ? GOLD : BORDER}`, color: form.equipements.includes(eq) ? BG : MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 1, padding: '7px 14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Photos ── */}
          {step === 3 && (
            <div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, color: FAINT, marginBottom: 16 }}>PHOTOS DU BIEN</div>

              {/* Upload zone */}
              <label style={{ display: 'block', border: `1px dashed ${BORDER}`, padding: '40px', textAlign: 'center', cursor: 'pointer', marginBottom: 24, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = GOLD} onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: TEXT, marginBottom: 8 }}>
                  Cliquez ou déposez vos photos ici
                </div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 2, color: FAINT }}>
                  JPG, PNG — plusieurs fichiers acceptés
                </div>
              </label>

              {/* Preview grid */}
              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                  {images.map((src, i) => (
                    <div key={i} style={{ position: 'relative', height: 120, overflow: 'hidden' }}>
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {i === 0 && (
                        <div style={{ position: 'absolute', top: 6, left: 6, fontFamily: "'Raleway', sans-serif", fontSize: 8, letterSpacing: 2, color: BG, background: GOLD, padding: '3px 8px' }}>
                          PRINCIPALE
                        </div>
                      )}
                      <button onClick={() => removeImage(i)}
                        style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(20,15,10,0.7)', border: 'none', color: '#fff', width: 24, height: 24, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 32, borderTop: `1px solid ${BORDER}` }}>
            {step > 0 ? (
              <button onClick={prev} style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 28px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}>
                ← PRÉCÉDENT
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button onClick={next} style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 28px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                SUIVANT →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                style={{ background: GOLD, border: 'none', color: BG, fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, padding: '13px 28px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                {loading ? 'PUBLICATION…' : 'PUBLIER LE BIEN'}
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  )
}