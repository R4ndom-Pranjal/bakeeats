import { useState, useEffect, useRef, useCallback } from 'react'
import './Hero.css'

const products = [
  { title: 'MASKAAA', type: 'Cookie', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304510/maska_ht9ri9.png' },
  { title: 'NAAARIYAL', type: 'Cookie', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304473/nariyal_m4bdko.png' },
  { title: 'CHOCO CHASKAAA', type: 'Cookie', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770817215/chocolate_ahb4q3.png' },
  { title: 'JEERAAA', type: 'Cookie', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304407/jeera_uimjxy.png' },
  { title: 'BAAADAM', type: 'Cookie', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304489/baadam_jd8ykx.png' },
  { title: 'AAATTA', type: 'Cookie', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304441/atta_nto4fr.png' },
  { title: 'AAAJWAIN', type: 'Cookie', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304421/ajwain_xfcbnq.png' },
  { title: 'SUJI RUSK', type: 'Rusk', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813837/Suji_rusk.f592fca2c815d8295049-Photoroom_bsoe0c.png' },
  { title: 'MILK RUSK', type: 'Rusk', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813840/Milk_rusk.55cd87e135e384e6656f-Photoroom_zha2la.png' },
  { title: 'GUD RUSK', type: 'Rusk', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813841/gud_rusk.900f91b44fdd4e91af8f-Photoroom_kzr7u1.png' },
  { title: 'ELAICHI RUSK', type: 'Rusk', image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813844/elachi.e857599bde6db2425f0d-Photoroom_h8jfn6.png' },
]

const TOTAL = products.length

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const touchStartX = useRef(0)

  const goTo = useCallback((idx) => {
    setCurrent(((idx % TOTAL) + TOTAL) % TOTAL)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  // Auto-rotate
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % TOTAL)
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Reset timer on manual navigation
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % TOTAL)
    }, 3000)
  }, [])

  const handlePrev = () => { prev(); resetTimer() }
  const handleNext = () => { next(); resetTimer() }

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
  }

  const angleStep = 360 / TOTAL

  return (
    <section className="hero">
      <svg className="hero-blob" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--yellow)" d="M485.5,302.5Q376,105,202,238.5Q28,372,139.5,502Q251,632,393.5,618.5Q536,605,565.5,452.5Q595,300,485.5,302.5Z" />
        <path fill="var(--yellow)" d="M720,150 Q780,250 680,320 Q580,390 600,250 Q620,110 720,150 Z" />
        <path fill="var(--yellow)" d="M100,650 Q150,750 250,700 Q350,650 200,550 Q50,450 100,650 Z" />
      </svg>

      <div className="hero-content">
        <span className="hero-tagline anim-fadeUp" style={{ animationDelay: '0.2s' }}>India's Finest Bakery</span>
        <h1 className="anim-fadeUp" style={{ animationDelay: '0.35s' }}>TASTE MEIN<br /><span className="text-red">A++</span></h1>
        <p className="anim-fadeUp" style={{ animationDelay: '0.5s' }}>Premium ingredients. Quirky flavors. Daily fresh rusks and cookies made with Made-in-India pride. Chai ke saath perfect.</p>
        <a href="#products" className="btn btn-hero anim-fadeUp" style={{ animationDelay: '0.65s' }}>Shop The Range</a>
      </div>

      <div className="hero-visual anim-fadeScale" style={{ animationDelay: '0.4s' }}>
        <div
          className="carousel-scene"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="carousel-ring"
            style={{ transform: `rotateY(${-current * angleStep}deg)` }}
          >
            {products.map((p, i) => {
              const angle = i * angleStep
              // Distance from active item (circular)
              let dist = Math.abs(i - current)
              if (dist > TOTAL / 2) dist = TOTAL - dist

              return (
                <div
                  key={p.title}
                  className={`carousel-item ${i === current ? 'active' : ''}`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(380px)`,
                    opacity: dist === 0 ? 1 : Math.max(0.25, 1 - dist * 0.2),
                    filter: dist === 0 ? 'none' : `blur(${Math.min(dist * 1.5, 4)}px)`,
                  }}
                >
                  <img src={p.image} alt={p.title} />
                  <div className="carousel-label">{p.title}</div>
                  <div className="carousel-type">{p.type}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="carousel-controls">
          <button className="carousel-btn" onClick={handlePrev} aria-label="Previous">&#8249;</button>
          <span className="carousel-counter">
            {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </span>
          <button className="carousel-btn" onClick={handleNext} aria-label="Next">&#8250;</button>
        </div>
      </div>
    </section>
  )
}
