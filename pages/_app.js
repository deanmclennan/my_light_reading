import '@/styles/globals.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved)
      setTheme(saved)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    let newTheme
    if (current === 'dark') {
      newTheme = 'light'
    } else if (current === 'light') {
      newTheme = 'dark'
    } else {
      newTheme = prefersDark ? 'light' : 'dark'
    }

    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  const isDark = theme === 'dark' ||
    (theme === null && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bungee&display=swap" rel="stylesheet" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M8Q2V5G7NE"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M8Q2V5G7NE');
            `,
          }}
        />
      </Head>
      <Component {...pageProps} theme={theme} isDark={isDark} toggleTheme={toggleTheme} />
    </>
  )
}
