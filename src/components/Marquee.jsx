import './Marquee.css'

export default function Marquee() {
  const text = '🍪 FESTIVE DELIGHT 🍪 SWEET & SALTY 🍪 DRY FRUIT COOKIES 🍪 SWEET CRAVINGS 🍪 CLASSIC RUSKS 🍪 CUSTOM COMBO 🍪 MASKAAA 🍪 NAAARIYAL 🍪 CHOCO CHASKAAA 🍪 JEERAAA'

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <div className="marquee-item">{text}</div>
        <div className="marquee-item">{text}</div>
      </div>
    </div>
  )
}
