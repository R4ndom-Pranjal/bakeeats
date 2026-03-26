import { useState, useEffect } from 'react'
import './PageLoader.css'

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 2000)
    const remove = setTimeout(() => setVisible(false), 2600)
    return () => {
      clearTimeout(timer)
      clearTimeout(remove)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`page-loader ${fading ? 'fade-out' : ''}`}>
      <img
        src="https://res.cloudinary.com/ddtifclgr/image/upload/v1770035808/logo.5586e616d663e63711b3-Photoroom_ksprww.png"
        alt="Bakeats"
        className="loader-logo"
      />
      <p className="loader-tagline">TASTE MEIN A++</p>
    </div>
  )
}
