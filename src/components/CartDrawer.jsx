import { useCart } from '../context/CartContext'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, updateQty, removeItem, clearCart, totalItems, totalAmount, cartOpen, setCartOpen, setCheckoutOpen } = useCart()

  const whatsappOrder = () => {
    const lines = items.map((i) => {
      const head = `${i.qty}x ${i.title}`
      return i.description ? `${head}\n   (${i.description})` : head
    })
    const msg = encodeURIComponent(
      `Hi! I'd like to order from Bakeats:\n\n${lines.join('\n')}\n\nPlease confirm availability. Thank you!`
    )
    window.open(`https://wa.me/919266565336?text=${msg}`, '_blank')
  }

  return (
    <>
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>YOUR CART</h2>
          <button className="cart-close" onClick={() => setCartOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <button className="btn cart-shop-btn" onClick={() => setCartOpen(false)}>Shop Now</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.title} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.title}</h4>
                    <span className="cart-item-type">{item.type}</span>
                    {item.description && (
                      <span className="cart-item-desc">{item.description}</span>
                    )}
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(item.title, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.title, item.qty + 1)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(item.title)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-num">
                  {totalAmount > 0 ? `₹${totalAmount}` : `${totalItems} items`}
                </span>
              </div>
              {totalAmount > 0 && (
                <button
                  className="btn cart-checkout-btn"
                  onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}
                >
                  Proceed to Checkout
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <button className="btn cart-order-btn" onClick={whatsappOrder}>
                Order on WhatsApp
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="cart-clear" onClick={clearCart}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
