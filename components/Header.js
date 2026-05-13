import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useRouter } from 'next/router';
import { GlobeAltIcon, Bars3Icon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import { FaCrown } from 'react-icons/fa';
import { HiOutlineHome } from 'react-icons/hi';
import jwt from 'jsonwebtoken';

// ── Tokens ────────────────────────────────────────────────────────────────────
const GOLD    = '#B8892A';
const GOLD_L  = '#D4A84B';
const CREAM   = '#F5F0E8';
const TEXT    = '#1A1713';
const MUTED   = '#5A5248';
const FAINT   = '#8A8278';
const BORDER  = 'rgba(184,137,42,0.25)';
const BORDER_H= 'rgba(184,137,42,0.55)';
const HERO    = '#EDE9E1';   // light warm cream header bg
const HERO_2  = '#E4DFD5';   // dropdown bg

const selectStyle = {
  background: 'transparent',
  border: 'none',
  borderRight: `1px solid ${BORDER}`,
  color: '#5A5248',
  fontFamily: "'Raleway', sans-serif",
  fontSize: '10px',
  letterSpacing: '1.5px',
  padding: '0 14px',
  height: '100%',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
  transition: 'color 0.2s',
};

// ── Locations / options ───────────────────────────────────────────────────────
const LOCATION_OPTS = ['Toutes les willaya', 'Alger', 'Oran', 'Constantine', 'Annaba'];
const ADRESSE_OPTS  = [
  'Toutes les villes', 'Aïn Benian', 'Aïn Taya', 'Alger-Centre', 'Baba Hassen',
  'Bab El Oued', 'Bab Ezzouar', 'Bachdjerrah', 'Baraki', 'Belouizdad',
  'Ben Aknoun', 'Beni Messous', 'Birkhadem', 'Bir Mourad Raïs', 'Birtouta',
  'Bologhine', 'Bordj El Bahri', 'Bordj El Kiffan', 'Bourouba', 'Bouzareah',
  'Casbah', 'Chéraga', 'Dar El Beïda', 'Dely Ibrahim', 'Douera', 'Draria',
  'El Achour', 'El Biar', 'El Hammamet', 'El Harrach', 'El Madania', 'El Marsa',
  'El Mouradia', 'Hraoua', 'Hussein-Dey', 'Hydra', 'Khraïssia', 'Kouba',
  'Mahelma', 'Mohammadia', 'Oued Koriche', 'Oued Smar', 'Rahmania', 'Réghaïa',
  'Rouïba', 'Saoula', 'Sidi MHamed', 'Sidi Moussa', 'Souidania', 'Staoueli',
  'Tessala El Merdja', 'Zéralda',
];
const TYPE_OPTS  = ['Type de bien', 'Appartement', 'Villa', 'Terrain', 'Local'];
const SIZE_OPTS  = ['Taille', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8+'];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Header() {
  const router = useRouter();

  const [proprietaireName, setProprietaireName] = useState('');
  const [loggedIn, setLoggedIn]                 = useState(false);
  const [statusVIP, setStatusVIP]               = useState(false);
  const [scrolled, setScrolled]                 = useState(false);

  const [searchLocation, setSearchLocation]         = useState('');
  const [searchAdresse, setSearchAdresse]           = useState('');
  const [searchPropertyType, setSearchPropertyType] = useState('');
  const [searchNumBedrooms, setSearchNumBedrooms]   = useState('');

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Decode token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded) {
        setStatusVIP(decoded.statusVIP || false);
        if (decoded.nom) { setProprietaireName(decoded.nom); setLoggedIn(true); }
      }
    }
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({
      location:     searchLocation,
      address:      searchAdresse,
      propertyType: searchPropertyType,
      numBedrooms:  searchNumBedrooms,
    });
    window.location.href = `/homesList_filtred?${params.toString()}`;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setProprietaireName('');
    router.push('/');
  };

  const handleDashboard = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.userType) router.push(decoded.statusVIP ? '/Vip' : '/panel');
    }
  };

  return (
    <>
      {/* ── Global header styles ── */}
      <style>{`
        .lux-header {
          background: ${HERO};
          border-bottom: 1px solid ${BORDER};
        }
        .lux-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, ${GOLD}, rgba(184,137,42,0.3) 60%, transparent 100%);
          pointer-events: none;
        }
        .lux-select option { background: ${HERO_2}; color: ${TEXT}; }
        .lux-select:hover, .lux-select:focus { color: ${TEXT} !important; }
        .lux-search-btn:hover { background: ${GOLD_L} !important; }
        .lux-outline-btn {
          border: 1px solid ${BORDER};
          color: ${MUTED};
          transition: border-color 0.2s, color 0.2s;
        }
        .lux-outline-btn:hover { border-color: ${GOLD_L}; color: ${GOLD_L}; }
        .lux-gold-btn {
          background: ${GOLD};
          color: ${CREAM};
          transition: background 0.2s;
        }
        .lux-gold-btn:hover { background: ${GOLD_L}; }
        .lux-menu-items {
          background: ${HERO_2};
          border: 1px solid ${BORDER};
          box-shadow: 0 20px 50px rgba(0,0,0,0.55);
        }
        .lux-menu-item:hover { color: ${GOLD_L} !important; background: rgba(184,137,42,0.07) !important; }
        .lux-menu-item-danger:hover { color: #e07070 !important; }
      `}</style>

      <header
        className="lux-header"
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          height: 64,
          transition: 'box-shadow 0.3s',
          boxShadow: scrolled ? '0 2px 20px rgba(26,23,19,0.1)' : 'none',
        }}
      >

        {/* ── LOGO ── */}
        <div
          onClick={() => router.push('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
        >
          <HiOutlineHome style={{ color: GOLD, fontSize: 22 }} />
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 300,
              letterSpacing: 5, color: GOLD, lineHeight: 1,
            }}>
              E-KRILI
            </div>
            <div style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 7, letterSpacing: 4, color: FAINT, marginTop: 2,
            }}>
              IMMOBILIER DE PRESTIGE
            </div>
          </div>
        </div>

        {/* ── SEARCH ── */}
        <SearchBar
          searchLocation={searchLocation}       setSearchLocation={setSearchLocation}
          searchAdresse={searchAdresse}         setSearchAdresse={setSearchAdresse}
          searchPropertyType={searchPropertyType} setSearchPropertyType={setSearchPropertyType}
          searchNumBedrooms={searchNumBedrooms} setSearchNumBedrooms={setSearchNumBedrooms}
          onSearch={handleSearch}
        />

        {/* ── RIGHT ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <GlobeAltIcon style={{ height: 17, color: FAINT, cursor: 'pointer' }} />

          {/* Separator */}
          <div style={{ width: 1, height: 18, background: BORDER }} />

          {loggedIn ? (
            <UserMenu
              name={proprietaireName}
              isVip={statusVIP}
              onDashboard={handleDashboard}
              onDisconnect={handleDisconnect}
            />
          ) : (
            <GuestButtons router={router} />
          )}
        </div>
      </header>
    </>
  );
}

// ── Search bar ────────────────────────────────────────────────────────────────
function SearchBar({
  searchLocation, setSearchLocation,
  searchAdresse, setSearchAdresse,
  searchPropertyType, setSearchPropertyType,
  searchNumBedrooms, setSearchNumBedrooms,
  onSearch,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        display: 'flex', alignItems: 'stretch',
        height: 40,
        border: `1px solid ${focused ? BORDER_H : BORDER}`,
        background: focused ? '#F5F1EA' : 'rgba(237,233,225,0.6)',
        transition: 'border-color 0.25s',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {[
        { value: searchLocation,     setter: setSearchLocation,     opts: LOCATION_OPTS, last: false },
        { value: searchAdresse,      setter: setSearchAdresse,      opts: ADRESSE_OPTS,  last: false },
        { value: searchPropertyType, setter: setSearchPropertyType, opts: TYPE_OPTS,     last: false },
        { value: searchNumBedrooms,  setter: setSearchNumBedrooms,  opts: SIZE_OPTS,     last: true  },
      ].map(({ value, setter, opts, last }, i) => (
        <select
          key={i}
          value={value}
          onChange={e => setter(e.target.value)}
          className="lux-select"
          style={{ ...selectStyle, borderRight: last ? 'none' : `1px solid ${BORDER}` }}
        >
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ))}
      <button
        onClick={onSearch}
        className="lux-search-btn"
        style={{
          background: GOLD, border: 'none', color: CREAM,
          fontFamily: "'Raleway', sans-serif", fontSize: 9,
          fontWeight: 500, letterSpacing: 3, padding: '0 22px',
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'background 0.2s',
        }}
      >
        RECHERCHE
      </button>
    </div>
  );
}

// ── Logged-in user menu ───────────────────────────────────────────────────────
function UserMenu({ name, isVip, onDashboard, onDisconnect }) {
  return (
    <Menu as="div" style={{ position: 'relative' }}>
      {/* Trigger */}
      <Menu.Button
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent',
          border: `1px solid ${BORDER}`,
          padding: '7px 14px',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = BORDER_H}
        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
      >
        {isVip && <FaCrown style={{ color: GOLD, fontSize: 11 }} />}
        <span style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 11, letterSpacing: 2, color: TEXT,
        }}>
          {name}
        </span>
        <UserCircleIcon style={{ height: 16, color: FAINT }} />
        <Bars3Icon style={{ height: 16, color: FAINT }} />
      </Menu.Button>

      {/* Dropdown */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-120"
        enterFrom="transform opacity-0 translate-y-1"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-80"
        leaveFrom="transform opacity-100 translate-y-0"
        leaveTo="transform opacity-0 translate-y-1"
      >
        <Menu.Items
          className="lux-menu-items"
          style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            width: 220, outline: 'none', padding: '8px 0',
          }}
        >
          {[
            { label: 'Paramètres du compte', action: null },
            { label: 'Tableau de bord',      action: onDashboard },
            { label: 'Mes annonces',         action: null },
            { label: 'Favoris',              action: null },
            { label: 'Support',              action: null },
          ].map(({ label, action }) => (
            <Menu.Item key={label}>
              {({ active }) => (
                <button
                  onClick={action}
                  className="lux-menu-item"
                  style={{
                    width: '100%', textAlign: 'left',
                    background: active ? 'rgba(184,137,42,0.07)' : 'transparent',
                    border: 'none', padding: '10px 18px',
                    cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: 10, letterSpacing: 2,
                    color: active ? GOLD_L : MUTED,
                    transition: 'all 0.15s',
                  }}
                >
                  {label.toUpperCase()}
                </button>
              )}
            </Menu.Item>
          ))}

          {/* Divider + disconnect */}
          <div style={{ height: 1, background: BORDER, margin: '8px 18px' }} />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDisconnect}
                className="lux-menu-item lux-menu-item-danger"
                style={{
                  width: '100%', textAlign: 'left',
                  background: 'transparent', border: 'none',
                  padding: '10px 18px', cursor: 'pointer',
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 10, letterSpacing: 2,
                  color: active ? '#e07070' : 'rgba(220,100,100,0.7)',
                  transition: 'color 0.15s',
                }}
              >
                DÉCONNEXION
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

// ── Guest auth buttons ────────────────────────────────────────────────────────
function GuestButtons({ router }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        className="lux-outline-btn"
        onClick={() => router.push('/login_client')}
        style={{
          background: 'transparent',
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9, letterSpacing: 3,
          padding: '8px 18px', cursor: 'pointer',
        }}
      >
        CONNEXION
      </button>
      <button
        className="lux-gold-btn"
        onClick={() => router.push('/signup_client')}
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9, letterSpacing: 3,
          padding: '8px 18px', cursor: 'pointer', border: 'none',
        }}
      >
        CRÉER UN COMPTE
      </button>
    </div>
  );
}