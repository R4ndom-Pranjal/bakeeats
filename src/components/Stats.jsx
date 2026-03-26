import { useEffect, useRef, useState } from 'react'
import './Stats.css'

const statsData = [
  { number: 10000, suffix: '+', label: 'Happy Customers', prefix: '' },
  { number: 100, suffix: '%', label: 'Vegetarian', prefix: '' },
  { number: 11, suffix: '+', label: 'Flavors', prefix: '' },
  { number: null, display: 'Made in', label: 'Noida, India \u{1F1EE}\u{1F1F3}', prefix: '' },
]

function useCountUp(target, isVisible, duration = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible || target === null) return

    let start = 0
    const increment = target / (duration / 16)
    let raf

    function step() {
      start += increment
      if (start >= target) {
        setCount(target)
        return
      }
      setCount(Math.floor(start))
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [isVisible, target, duration])

  return count
}

function StatItem({ stat, isVisible }) {
  const count = useCountUp(stat.number, isVisible)

  const displayNumber = stat.number === null
    ? stat.display
    : `${count.toLocaleString()}${stat.suffix}`

  return (
    <div className="stat-item">
      <span className="stat-number">{displayNumber}</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  )
}

export default function Stats() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="stats" ref={sectionRef}>
      <div className="stats-grid">
        {statsData.map((stat) => (
          <StatItem key={stat.label} stat={stat} isVisible={isVisible} />
        ))}
      </div>
    </section>
  )
}
