import { useEffect, useRef } from 'react'
import './Story.css'

export default function Story() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08 }
    )

    const targets = sectionRef.current?.querySelectorAll('.story-img-wrap, .story-content')
    targets?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="story" id="story" ref={sectionRef}>
      <svg className="story-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.4,-46C91,-32.9,97.3,-16.4,96.5,-0.5C95.7,15.5,87.8,30.9,77.7,44.4C67.6,57.9,55.2,69.5,40.8,77.1C26.4,84.7,10,88.2,-5.6,86.4C-21.2,84.7,-35.9,77.7,-48.9,68.2C-61.9,58.7,-73.2,46.7,-81.2,32.2C-89.2,17.7,-93.8,0.7,-91.1,-15C-88.4,-30.7,-78.4,-45,-65.4,-54.6C-52.4,-64.2,-36.4,-69.1,-21.8,-73.4C-7.2,-77.7,6.1,-81.4,20.6,-79.8C35.1,-78.2,46.3,-71.3,44.7,-76.4Z" transform="translate(100 100)" />
      </svg>

      <div className="story-img-wrap">
        <img
          src="/story/founder.jpg"
          alt="Pankaj Mishra - Founder of Bakeats"
          className="story-img"
        />
      </div>

      <div className="story-content">
        <h2>THE BAKEATS KAHANI</h2>
        <p>It started in Noida with a simple realization by our founder, Pankaj Mishra: everyday Indians deserve premium bakery quality without the premium price tag.</p>
        <p>We saw plain packaging hiding average ingredients. So we flipped it. At Bakeats, our ingredients are literally <em>hugging the product</em>. You see what you eat. We use premium butter, real jeera, finest coconut, and pack it with a whole lot of Made-in-India attitude.</p>
        <p>From our ovens to your chai cup, we promise just one thing:</p>
        <span className="story-signature">Taste Mein A++</span>
      </div>
    </section>
  )
}
