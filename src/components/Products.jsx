import { useEffect, useRef } from 'react'
import BundleCard from './BundleCard'
import ProductCard from './ProductCard'
import './Products.css'

const cookieBundles = [
  {
    name: 'Festive Delight',
    items: ['CHOCO CHASKAAA', 'NAAARIYAL', 'MASKAAA'],
    weight: '180 g each',
    price: 299,
    images: [
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770817215/chocolate_ahb4q3.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304473/nariyal_m4bdko.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304510/maska_ht9ri9.png',
    ],
    accent: 'var(--red)',
    type: 'Cookie Bundle',
  },
  {
    name: 'Sweet & Salty',
    items: ['AAAJWAIN', 'JEERAAA', 'FRUITY MASKAAA', 'MASKAAA'],
    weight: '270 g each',
    price: 399,
    images: [
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304421/ajwain_xfcbnq.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304407/jeera_uimjxy.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304510/maska_ht9ri9.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304510/maska_ht9ri9.png',
    ],
    accent: 'var(--yellow)',
    type: 'Cookie Bundle',
  },
  {
    name: 'Dry Fruit Cookies',
    items: ['Almond', 'Cashew', 'Mix', 'Honey Almond'],
    weight: '270 g each',
    price: 429,
    images: [
      '/dryfruit/almond.png',
      '/dryfruit/cashew.png',
      '/dryfruit/mix.png',
      '/dryfruit/honey-almond.png',
    ],
    accent: 'var(--green)',
    type: 'Cookie Bundle',
  },
  {
    name: 'Sweet Cravings',
    items: ['CHOCO CHASKAAA', 'NAAARIYAL', 'FRUITY MASKAAA', 'MASKAAA'],
    weight: '270 g each',
    price: 499,
    images: [
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770817215/chocolate_ahb4q3.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304473/nariyal_m4bdko.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304510/maska_ht9ri9.png',
      'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304510/maska_ht9ri9.png',
    ],
    accent: 'var(--red)',
    type: 'Cookie Bundle',
  },
]

const ruskBundle = {
  name: 'Classic Rusks',
  items: ['Elaichi', 'Suji', 'Milk', 'Gud'],
  weight: '300 g each',
  price: null,
  images: [
    'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813844/elachi.e857599bde6db2425f0d-Photoroom_h8jfn6.png',
    'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813837/Suji_rusk.f592fca2c815d8295049-Photoroom_bsoe0c.png',
    'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813840/Milk_rusk.55cd87e135e384e6656f-Photoroom_zha2la.png',
    'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813841/gud_rusk.900f91b44fdd4e91af8f-Photoroom_kzr7u1.png',
  ],
  accent: 'var(--yellow)',
  type: 'Pack of 4',
}

const cookies = [
  {
    type: 'Premium Cookies',
    title: 'MASKAAA',
    description: 'Classic maska cookies with rich buttery flavor and a satisfying crisp bite.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304510/maska_ht9ri9.png',
    ingredients: ['🧈', '🌾'],
  },
  {
    type: 'Premium Cookies',
    title: 'NAAARIYAL',
    description: 'Delicious coconut cookies packed with tropical flavor and a light, crunchy texture.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304473/nariyal_m4bdko.png',
    ingredients: ['🥥', '✨'],
  },
  {
    type: 'Premium Cookies',
    title: 'CHOCO CHASKAAA',
    description: 'Chocolate chip cookies filled with rich cocoa chunks for full-on chocolate satisfaction.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770817215/chocolate_ahb4q3.png',
    ingredients: ['🍫', '🍪'],
  },
  {
    type: 'Premium Cookies',
    title: 'JEERAAA',
    description: 'Crispy jeera cookies infused with aromatic cumin for a bold, savoury crunch.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304407/jeera_uimjxy.png',
    ingredients: ['🫘', '☕'],
  },
  {
    type: 'Premium Cookies',
    title: 'BAAADAM',
    description: 'Premium badam cookies packed with roasted almond goodness and satisfying nutty crunch.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304489/baadam_jd8ykx.png',
    ingredients: ['🥜', '✨'],
  },
  {
    type: 'Premium Cookies',
    title: 'AAATTA',
    description: 'Whole wheat flour cookies for a light, balanced crunch and an everyday feel-good snack.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304441/atta_nto4fr.png',
    ingredients: ['🌾', '🧈'],
  },
  {
    type: 'Premium Cookies',
    title: 'AAAJWAIN',
    description: 'Aromatic ajwain cookies with a bold, herby crunch that pairs perfectly with chai.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770304421/ajwain_xfcbnq.png',
    ingredients: ['🌿', '✨'],
  },
  {
    type: 'Dry Fruit Cookies',
    title: 'ALMOND',
    description: 'Premium almond cookies loaded with roasted almonds for a rich, nutty crunch.',
    image: '/dryfruit/almond.png',
    ingredients: ['🥜', '✨'],
  },
  {
    type: 'Dry Fruit Cookies',
    title: 'CASHEW',
    description: 'Buttery cashew cookies packed with creamy cashew goodness in every bite.',
    image: '/dryfruit/cashew.png',
    ingredients: ['🥜', '🧈'],
  },
  {
    type: 'Dry Fruit Cookies',
    title: 'MIX DRY FRUIT',
    description: 'Wholesome mix of almonds, cashews and raisins baked into a crunchy delight.',
    image: '/dryfruit/mix.png',
    ingredients: ['🥜', '🍇'],
  },
  {
    type: 'Dry Fruit Cookies',
    title: 'HONEY ALMOND',
    description: 'Honey-kissed almond cookies with a natural sweetness and satisfying crunch.',
    image: '/dryfruit/honey-almond.png',
    ingredients: ['🍯', '🥜'],
  },
]

const rusks = [
  {
    type: 'Classic Rusk',
    title: 'SUJI RUSK',
    description: 'Perfectly baked suji rusk with a golden crunch. The ultimate chai companion.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813837/Suji_rusk.f592fca2c815d8295049-Photoroom_bsoe0c.png',
    ingredients: ['☕', '🌾'],
    bgColor: 'var(--yellow)',
  },
  {
    type: 'Classic Rusk',
    title: 'MILK RUSK',
    description: 'Creamy milk-infused rusk with a soft bite and rich flavor. Dunk it, love it.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813840/Milk_rusk.55cd87e135e384e6656f-Photoroom_zha2la.png',
    ingredients: ['🥛', '🧈'],
    bgColor: 'var(--yellow)',
  },
  {
    type: 'Classic Rusk',
    title: 'GUD RUSK',
    description: 'Sweetened with natural jaggery for a wholesome, earthy crunch in every bite.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813841/gud_rusk.900f91b44fdd4e91af8f-Photoroom_kzr7u1.png',
    ingredients: ['🍯', '🌾'],
    bgColor: 'var(--yellow)',
  },
  {
    type: 'Classic Rusk',
    title: 'ELAICHI RUSK',
    description: 'The ultimate chai dip. Perfectly baked suji rusk with a hint of green cardamom.',
    image: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813844/elachi.e857599bde6db2425f0d-Photoroom_h8jfn6.png',
    ingredients: ['🌿', '☕'],
    bgColor: 'var(--yellow)',
  },
]

export default function Products() {
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

    const cards = sectionRef.current?.querySelectorAll('.bundle-card, .product-card')
    cards?.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.07}s`
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="products" id="products" ref={sectionRef}>
      <div className="section-header">
        <h2>OUR BAKED BABIES</h2>
      </div>

      <h3 className="product-section-title">COOKIE BUNDLES</h3>
      <div className="bundle-grid">
        {cookieBundles.map((bundle) => (
          <BundleCard key={bundle.name} bundle={bundle} />
        ))}
      </div>

      <h3 className="product-section-title" style={{ marginTop: '5rem' }}>RUSK BUNDLE</h3>
      <div className="bundle-grid">
        <BundleCard bundle={ruskBundle} />
      </div>

      <div className="customize-section">
        <div className="customize-card">
          <span className="customize-icon">🍪</span>
          <h3>CUSTOMIZE YOUR COMBO</h3>
          <p>Want a custom mix? Pick your own flavors and we'll pack it fresh for you.</p>
          <a href="https://wa.me/919266565336?text=Hi!%20I'd%20like%20to%20customize%20my%20Bakeats%20combo.%20Can%20you%20help?" className="btn" target="_blank" rel="noreferrer">
            Request Custom Combo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <h3 className="product-section-title" style={{ marginTop: '5rem' }}>COOKIES</h3>
      <div className="product-grid">
        {cookies.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>

      <h3 className="product-section-title" style={{ marginTop: '5rem' }}>RUSKS</h3>
      <div className="product-grid">
        {rusks.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </section>
  )
}
