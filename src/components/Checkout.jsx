import { useState, useEffect, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import './Checkout.css'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const INITIAL_FORM = { name: '', email: '', phone: '', address: '' }

export default function Checkout() {
  const { items, totalAmount, clearCart, checkoutOpen, setCheckoutOpen } = useCart()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('form') // 'form' | 'processing' | 'success' | 'failed'
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [copied, setCopied] = useState(false)

  const copyOrderId = () => {
    navigator.clipboard.writeText(confirmedOrder.orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (checkoutOpen) {
      setForm(INITIAL_FORM)
      setErrors({})
      setStep('form')
      setConfirmedOrder(null)
    }
  }, [checkoutOpen])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile number required'
    if (!form.address.trim()) e.address = 'Delivery address is required'
    return e
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: '' }))
  }

  const handlePay = useCallback(async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setStep('processing')

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) { setStep('failed'); return }

    let orderData
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount * 100, currency: 'INR', receipt: `receipt_${Date.now()}` }),
      })
      if (!res.ok) throw new Error()
      orderData = await res.json()
    } catch {
      setStep('failed')
      return
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Bakeats',
      description: `Order of ${items.length} item(s)`,
      order_id: orderData.orderId,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      notes: { address: form.address },
      theme: { color: '#113516' },
      modal: { ondismiss: () => setStep('form') },
      handler: async (response) => {
        try {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerName: form.name,
              customerEmail: form.email,
              customerPhone: form.phone,
              customerAddress: form.address,
              items: items.map(i => ({ title: i.title, type: i.type, qty: i.qty, price: i.price, image: i.image, description: i.description })),
              totalAmount,
            }),
          })
          const data = await verifyRes.json()
          if (data.success) {
            setConfirmedOrder({
              orderId: data.orderId,
              paymentId: data.paymentId,
              name: form.name,
              email: form.email,
              phone: form.phone,
              address: form.address,
              items: [...items],
              totalAmount,
            })
            setStep('success')
            clearCart()
          } else {
            setStep('failed')
          }
        } catch {
          setStep('failed')
        }
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => setStep('failed'))
    rzp.open()
  }, [form, totalAmount, items, clearCart])

  if (!checkoutOpen) return null

  return (
    <>
      <div className="co-overlay" onClick={() => step === 'form' && setCheckoutOpen(false)} />
      <div className="co-modal" role="dialog" aria-modal="true" aria-label="Checkout">

        <div className="co-header">
          <h2>{step === 'success' ? 'ORDER CONFIRMED' : 'CHECKOUT'}</h2>
          {step !== 'processing' && (
            <button className="co-close" onClick={() => setCheckoutOpen(false)} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Success ── */}
        {step === 'success' && confirmedOrder && (
          <div className="co-success-body">
            <div className="co-success-top">
              <div className="co-state-icon co-state-icon--success">✓</div>
              <div>
                <h3>Thank you, {confirmedOrder.name}!</h3>
                <p>Your baked goodies are being packed fresh. A confirmation has been sent to <strong>{confirmedOrder.email}</strong>.</p>
              </div>
            </div>

            <div className="co-order-id-card">
              <div>
                <span className="co-order-id-label">YOUR ORDER ID</span>
                <div className="co-order-id-row">
                  <span className="co-order-id-value">{confirmedOrder.orderId}</span>
                  <button className="co-copy-btn" onClick={copyOrderId} aria-label="Copy order ID">
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <a href="#track" className="co-track-link" onClick={() => setCheckoutOpen(false)}>
                Track Order →
              </a>
            </div>

            <p className="co-screenshot-tip">
              <span aria-hidden="true">📸</span>
              <span><strong>Please save a screenshot</strong> of this confirmation to avoid any issues during delivery.</span>
            </p>

            <div className="co-success-grid">
              {/* Order items */}
              <div className="co-success-section">
                <h4 className="co-success-label">ITEMS ORDERED</h4>
                <div className="co-success-items">
                  {confirmedOrder.items.map(item => (
                    <div key={item.title} className="co-success-item">
                      <img src={item.image} alt={item.title} />
                      <div className="co-success-item-info">
                        <span className="co-success-item-name">{item.title}</span>
                        <span className="co-success-item-type">{item.type}</span>
                      </div>
                      <div className="co-success-item-right">
                        <span className="co-success-item-qty">×{item.qty}</span>
                        {item.price && <span className="co-success-item-price">₹{item.price * item.qty}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="co-success-total-row">
                  <span>Order Total</span>
                  <span className="co-success-total-amt">₹{confirmedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Delivery + payment */}
              <div className="co-success-section">
                <h4 className="co-success-label">DELIVERY ADDRESS</h4>
                <p className="co-success-address">{confirmedOrder.address}</p>

                <h4 className="co-success-label" style={{ marginTop: '1.4rem' }}>PAYMENT DETAILS</h4>
                <div className="co-success-pid">
                  <span>Payment ID</span>
                  <span>{confirmedOrder.paymentId}</span>
                </div>
                <div className="co-success-pid">
                  <span>Amount Paid</span>
                  <span>₹{confirmedOrder.totalAmount}</span>
                </div>
                <div className="co-success-pid">
                  <span>Delivery</span>
                  <span style={{ color: '#2a9d2a', fontWeight: 800 }}>FREE</span>
                </div>
              </div>
            </div>

            <div className="co-success-footer">
              <p>Questions? WhatsApp us at <strong>+91 92665 65336</strong></p>
              <button className="btn co-done-btn" onClick={() => setCheckoutOpen(false)}>Continue Shopping</button>
            </div>
          </div>
        )}

        {/* ── Failed ── */}
        {step === 'failed' && (
          <div className="co-state">
            <div className="co-state-icon co-state-icon--failed">✕</div>
            <h3>Payment Failed</h3>
            <p>Something went wrong. Please try again or order via WhatsApp.</p>
            <button className="btn co-done-btn" onClick={() => setStep('form')}>Try Again</button>
          </div>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <div className="co-state">
            <div className="co-spinner" />
            <p>Opening payment gateway…</p>
          </div>
        )}

        {/* ── Form ── */}
        {step === 'form' && (
          <div className="co-body">
            <div className="co-summary">
              <h3 className="co-section-title">ORDER SUMMARY</h3>
              <div className="co-items">
                {items.map((item) => (
                  <div key={item.title} className="co-item">
                    <img src={item.image} alt={item.title} className="co-item-img" />
                    <div className="co-item-details">
                      <span className="co-item-name">{item.title}</span>
                      <span className="co-item-type">{item.type}</span>
                    </div>
                    <div className="co-item-right">
                      <span className="co-item-qty">×{item.qty}</span>
                      {item.price && <span className="co-item-price">₹{item.price * item.qty}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="co-summary-footer">
                <div className="co-summary-row">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="co-summary-row">
                  <span>Delivery</span>
                  <span className="co-free">FREE</span>
                </div>
                <div className="co-summary-row co-summary-total">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="co-form-section">
              <h3 className="co-section-title">DELIVERY DETAILS</h3>
              <form className="co-form" onSubmit={(e) => { e.preventDefault(); handlePay() }} noValidate>
                <div className="co-field">
                  <label htmlFor="co-name">Full Name</label>
                  <input id="co-name" name="name" type="text" placeholder="Priya Sharma"
                    value={form.name} onChange={handleChange} className={errors.name ? 'error' : ''} autoComplete="name" />
                  {errors.name && <span className="co-error">{errors.name}</span>}
                </div>

                <div className="co-field">
                  <label htmlFor="co-email">Email</label>
                  <input id="co-email" name="email" type="email" placeholder="priya@email.com"
                    value={form.email} onChange={handleChange} className={errors.email ? 'error' : ''} autoComplete="email" />
                  {errors.email && <span className="co-error">{errors.email}</span>}
                </div>

                <div className="co-field">
                  <label htmlFor="co-phone">Mobile Number</label>
                  <div className="co-phone-wrap">
                    <span className="co-phone-prefix">+91</span>
                    <input id="co-phone" name="phone" type="tel" placeholder="9876543210" maxLength={10}
                      value={form.phone} onChange={handleChange} className={errors.phone ? 'error' : ''} autoComplete="tel" />
                  </div>
                  {errors.phone && <span className="co-error">{errors.phone}</span>}
                </div>

                <div className="co-field">
                  <label htmlFor="co-address">Delivery Address</label>
                  <textarea id="co-address" name="address" placeholder="Flat 4B, Green Park, New Delhi - 110016"
                    rows={3} value={form.address} onChange={handleChange} className={errors.address ? 'error' : ''} autoComplete="street-address" />
                  {errors.address && <span className="co-error">{errors.address}</span>}
                </div>

                <button type="submit" className="btn co-pay-btn">
                  <span className="co-pay-lock">🔒</span>
                  Pay ₹{totalAmount} Securely
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                <p className="co-powered">Secured by <strong>Razorpay</strong>. Your payment info is never stored.</p>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
