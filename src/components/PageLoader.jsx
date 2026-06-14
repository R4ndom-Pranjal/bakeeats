import { useState, useEffect } from 'react'
import './PageLoader.css'

const MESSAGES = [
  'Preheating the oven…',
  'Mixing the dough…',
  'Baking fresh cookies…',
  'Almost ready! 🍪',
]

const TAGLINE = 'TASTE MEIN A++'

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 950)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const MIN = 3800
    const start = Date.now()

    const hide = () => {
      setFading(true)
      setTimeout(() => setVisible(false), 700)
    }

    const maybeHide = () => {
      const wait = Math.max(0, MIN - (Date.now() - start))
      setTimeout(hide, wait)
    }

    if (document.readyState === 'complete') {
      maybeHide()
      return
    }

    window.addEventListener('load', maybeHide)
    const fallback = setTimeout(hide, 6000)

    return () => {
      window.removeEventListener('load', maybeHide)
      clearTimeout(fallback)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`page-loader ${fading ? 'fade-out' : ''}`}>
      <img src="/logo.png" alt="Bakeats" className="loader-logo" />

      <p className="loader-tagline" aria-label={TAGLINE}>
        {TAGLINE.split('').map((char, i) => (
          <span
            key={i}
            className="loader-letter"
            style={{ animationDelay: `${0.7 + i * 0.07}s` }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </p>

      <p className="loader-message" key={msgIndex}>{MESSAGES[msgIndex]}</p>

      <div className="loader-dots">
        <span /><span /><span />
      </div>
    </div>
  )
}
