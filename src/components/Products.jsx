import { useEffect, useRef, useState } from 'react'
import BundleCard from './BundleCard'
import ProductCard from './ProductCard'
import CustomComboPicker from './CustomComboPicker'
import { useCart } from '../context/CartContext'
import './Products.css'

const cookieBundles = [
  {
    name: 'Festive Delight',
    items: ['CHOCO CHASKAAA', 'NAAARIYAL', 'MASKAAA'],
    weight: '180 g each',
    price: 299,
    images: [
      '/products/cookies/choco.png',
      '/products/cookies/nariyal.png',
      '/products/cookies/maska.png',
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
      '/products/cookies/ajwain.png',
      '/products/cookies/jeera.png',
      '/products/cookies/maska.png',
      '/products/cookies/maska.png',
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
      '/products/cookies/choco.png',
      '/products/cookies/nariyal.png',
      '/products/cookies/maska.png',
      '/products/cookies/maska.png',
    ],
    accent: 'var(--red)',
    type: 'Cookie Bundle',
  },
]

const ruskBundle = {
  name: 'Classic Rusks',
  items: ['Elaichi', 'Suji', 'Milk', 'Gud'],
  weight: '300 g each',
  price: 335,
  images: [
    '/products/rusks/elaichi.png',
    '/products/rusks/suji.png',
    '/products/rusks/milk.png',
    '/products/rusks/gud.png',
  ],
  accent: 'var(--yellow)',
  type: 'Pack of 4',
}

const cookies = [
  {
    type: 'Premium Cookies',
    title: 'MASKAAA',
    description: 'Classic maska cookies with rich buttery flavor and a satisfying crisp bite.',
    image: '/products/cookies/maska.png',
    ingredients: ['🧈', '🌾'],
  },
  {
    type: 'Premium Cookies',
    title: 'NAAARIYAL',
    description: 'Delicious coconut cookies packed with tropical flavor and a light, crunchy texture.',
    image: '/products/cookies/nariyal.png',
    ingredients: ['🥥', '✨'],
  },
  {
    type: 'Premium Cookies',
    title: 'CHOCO CHASKAAA',
    description: 'Chocolate chip cookies filled with rich cocoa chunks for full-on chocolate satisfaction.',
    image: '/products/cookies/choco.png',
    ingredients: ['🍫', '🍪'],
  },
  {
    type: 'Premium Cookies',
    title: 'JEERAAA',
    description: 'Crispy jeera cookies infused with aromatic cumin for a bold, savoury crunch.',
    image: '/products/cookies/jeera.png',
    ingredients: ['🫘', '☕'],
  },
  {
    type: 'Premium Cookies',
    title: 'BAAADAM',
    description: 'Premium badam cookies packed with roasted almond goodness and satisfying nutty crunch.',
    image: '/products/cookies/baadam.png',
    ingredients: ['🥜', '✨'],
  },
  {
    type: 'Premium Cookies',
    title: 'AAATTA',
    description: 'Whole wheat flour cookies for a light, balanced crunch and an everyday feel-good snack.',
    image: '/products/cookies/atta.png',
    ingredients: ['🌾', '🧈'],
  },
  {
    type: 'Premium Cookies',
    title: 'AAAJWAIN',
    description: 'Aromatic ajwain cookies with a bold, herby crunch that pairs perfectly with chai.',
    image: '/products/cookies/ajwain.png',
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
    image: '/products/rusks/suji.png',
    ingredients: ['☕', '🌾'],
    bgColor: 'var(--yellow)',
  },
  {
    type: 'Classic Rusk',
    title: 'MILK RUSK',
    description: 'Creamy milk-infused rusk with a soft bite and rich flavor. Dunk it, love it.',
    image: '/products/rusks/milk.png',
    ingredients: ['🥛', '🧈'],
    bgColor: 'var(--yellow)',
  },
  {
    type: 'Classic Rusk',
    title: 'GUD RUSK',
    description: 'Sweetened with natural jaggery for a wholesome, earthy crunch in every bite.',
    image: '/products/rusks/gud.png',
    ingredients: ['🍯', '🌾'],
    bgColor: 'var(--yellow)',
  },
  {
    type: 'Classic Rusk',
    title: 'ELAICHI RUSK',
    description: 'The ultimate chai dip. Perfectly baked suji rusk with a hint of green cardamom.',
    image: '/products/rusks/elaichi.png',
    ingredients: ['🌿', '☕'],
    bgColor: 'var(--yellow)',
  },
]

export default function Products() {
  const sectionRef = useRef(null)
  const [comboOpen, setComboOpen] = useState(false)
  const { items: cartItems, removeItem } = useCart()
  const comboItems = cartItems.filter((i) => i.title.startsWith('CUSTOM COMBO'))
  const comboCount = comboItems.reduce((sum, i) => sum + i.qty, 0)

  const removeLastCombo = () => {
    if (comboItems.length === 0) return
    removeItem(comboItems[comboItems.length - 1].title)
  }

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

    // Reset stagger per grid so later grids don't accumulate huge delays
    const grids = sectionRef.current?.querySelectorAll('.bundle-grid, .product-grid')
    grids?.forEach((grid) => {
      const cards = grid.querySelectorAll('.bundle-card, .product-card')
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${(i % 4) * 0.05}s`
        observer.observe(card)
      })
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
          <p>Pick any 4 flavors — cookies, rusks, mix &amp; match. ₹469 per combo.</p>
          <div className="combo-actions">
            {comboCount > 0 && (
              <div className="combo-qty-control">
                <button className="combo-qty-dec" onClick={removeLastCombo} aria-label="Remove one combo">−</button>
                <span className="combo-qty-val">{comboCount} in cart</span>
              </div>
            )}
            <button className="btn" onClick={() => setComboOpen(true)}>
              {comboCount > 0 ? 'Add Another' : 'Build Custom Combo'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
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

      <CustomComboPicker
        open={comboOpen}
        onClose={() => setComboOpen(false)}
        cookies={cookies}
        rusks={rusks}
      />
    </section>
  )
}
