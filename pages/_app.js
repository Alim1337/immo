// pages/_app.js
import '@/styles/globals.css'
import { useEffect } from 'react'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  // Prevent flash of unstyled content on font load
  useEffect(() => {
    document.documentElement.style.visibility = 'visible'
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="E-Krili — Immobilier de prestige en Algérie" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Raleway:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}