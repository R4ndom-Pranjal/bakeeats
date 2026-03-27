import { useRef, useEffect, useState } from 'react'
import './AsSeenOn.css'

const pressItems = [
  {
    name: 'ANI News',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769966414/Screenshot_2026-02-01_224935_z0lpfv.png',
  },
  {
    name: 'thePrint',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769966651/Screenshot_2026-02-01_225355_awepgs.png',
  },
  {
    name: 'Startuppedia',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769966552/Screenshot_2026-02-01_225152_ewydwt.png',
  },
  {
    name: 'News Track',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769967459/Screenshot_2026-02-01_230633_uxqidw.png',
  },
  {
    name: 'Lokmat Times',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769968454/Screenshot_2026-02-01_232341_ppbeg6.png',
  },
  {
    name: 'Startup Media',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769969222/Screenshot_2026-02-01_233440_u48jae.png',
  },
]

export default function AsSeenOn() {
  const scrollRef = useRef(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let raf
    const speed = 0.8

    function step() {
      if (!paused) {
        container.scrollLeft += speed
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0
        }
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  return (
    <section className="as-seen-on" id="as-seen-on">
      <div className="section-header">
        <h2>AS SEEN ON</h2>
      </div>

      <div
        className="press-scroll"
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {pressItems.map((item) => (
          <div className="press-card" key={item.name}>
            <div className="press-img-wrap">
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <span className="press-name">{item.name}</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {pressItems.map((item) => (
          <div className="press-card" key={item.name + '-dup'}>
            <div className="press-img-wrap">
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <span className="press-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
