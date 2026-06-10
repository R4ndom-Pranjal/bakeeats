import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import './CustomComboPicker.css'

const MIN_ITEMS = 4

export default function CustomComboPicker({ open, onClose, cookies, rusks }) {
  const { items: cartItems, addItem, setCartOpen } = useCart()
  const [selections, setSelections] = useState({})

  useEffect(() => {
    if (!open) setSelections({})
  }, [open])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const totalSelected = Object.values(selections).reduce((s, q) => s + q, 0)
  const minMet = totalSelected >= MIN_ITEMS

  const allProducts = [...cookies, ...rusks]

  const bump = (title, delta) => {
    setSelections((prev) => {
      const next = { ...prev }
      const current = next[title] || 0
      const updated = current + delta
      if (updated <= 0) delete next[title]
      else next[title] = updated
      return next
    })
  }

  const handleAdd = () => {
    if (!minMet) return

    const description = Object.entries(selections)
      .map(([title, qty]) => `${qty}x ${title}`)
      .join(', ')

    const existingCustomCount = cartItems.filter((i) =>
      i.title.startsWith('CUSTOM COMBO')
    ).length
    const title = `CUSTOM COMBO #${existingCustomCount + 1}`

    const firstSelectedTitle = Object.keys(selections)[0]
    const firstProduct = allProducts.find((p) => p.title === firstSelectedTitle)

    addItem({
      title,
      type: `Custom Combo · ${totalSelected} items`,
      image: firstProduct?.image,
      description,
      price: null,
    })

    onClose()
    setCartOpen(true)
  }

  if (!open) return null

  return (
    <>
      <div className="combo-overlay" onClick={onClose} />
      <div className="combo-modal" role="dialog" aria-modal="true" aria-label="Build your custom combo">
        <div className="combo-header">
          <div>
            <h2>BUILD YOUR COMBO</h2>
            <p className="combo-subtitle">Pick any {MIN_ITEMS} or more — cookies, rusks, mix &amp; match.</p>
          </div>
          <button className="combo-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="combo-body">
          <h3 className="combo-section-title">COOKIES</h3>
          <div className="combo-grid">
            {cookies.map((p) => (
              <ComboTile
                key={p.title}
                product={p}
                qty={selections[p.title] || 0}
                onInc={() => bump(p.title, 1)}
                onDec={() => bump(p.title, -1)}
              />
            ))}
          </div>

          <h3 className="combo-section-title">RUSKS</h3>
          <div className="combo-grid">
            {rusks.map((p) => (
              <ComboTile
                key={p.title}
                product={p}
                qty={selections[p.title] || 0}
                onInc={() => bump(p.title, 1)}
                onDec={() => bump(p.title, -1)}
              />
            ))}
          </div>
        </div>

        <div className="combo-footer">
          <div className="combo-count">
            <span className={`combo-count-num ${minMet ? 'met' : ''}`}>
              {totalSelected}
            </span>
            <span className="combo-count-label">
              / {MIN_ITEMS} selected{minMet ? ' ✓' : ''}
            </span>
          </div>
          <button
            className="btn combo-add-btn"
            disabled={!minMet}
            onClick={handleAdd}
          >
            {minMet ? 'Add Combo to Cart' : `Pick ${MIN_ITEMS - totalSelected} more`}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

function ComboTile({ product, qty, onInc, onDec }) {
  const selected = qty > 0
  return (
    <div className={`combo-tile ${selected ? 'selected' : ''}`}>
      <div className="combo-tile-img-wrap">
        <img src={product.image} alt={product.title} />
        {selected && <span className="combo-tile-badge">{qty}</span>}
      </div>
      <div className="combo-tile-title">{product.title}</div>
      <div className="combo-tile-controls">
        <button
          className="combo-qty-btn"
          onClick={onDec}
          disabled={qty === 0}
          aria-label={`Remove one ${product.title}`}
        >
          −
        </button>
        <span className="combo-qty-num">{qty}</span>
        <button
          className="combo-qty-btn"
          onClick={onInc}
          aria-label={`Add one ${product.title}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
