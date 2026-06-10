import { useState, useEffect, useCallback } from 'react'
import './TrackOrder.css'

const INITIAL_FORM = { orderId: '', phone: '' }

export default function TrackOrder() {
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#track')
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('form') // 'form' | 'loading' | 'result' | 'notfound'
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const onHashChange = () => setOpen(window.location.hash === '#track')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM)
      setErrors({})
      setStep('form')
      setOrder(null)
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = useCallback(() => {
    if (window.location.hash === '#track') {
      history.replaceState({}, '', window.location.pathname + window.location.search)
    }
    setOpen(false)
  }, [])

  const handleChange = (e) => {
    const value = e.target.name === 'orderId' ? e.target.value.toUpperCase() : e.target.value
    setForm((f) => ({ ...f, [e.target.name]: value }))
    setErrors((err) => ({ ...err, [e.target.name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!/^BK-[A-Z0-9]{6}$/.test(form.orderId.trim())) e.orderId = 'Order ID should look like BK-XXXXXX'
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Valid 10-digit mobile number required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setStep('loading')

    try {
      const res = await fetch(`/api/order/${encodeURIComponent(form.orderId.trim())}?phone=${encodeURIComponent(form.phone.trim())}`)
      if (res.status === 404) {
        setStep('notfound')
        return
      }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setOrder(data)
      setStep('result')
    } catch {
      setStep('notfound')
    }
  }

  if (!open) return null

  return (
    <>
      <div className="to-overlay" onClick={close} />
      <div className="to-modal" role="dialog" aria-modal="true" aria-label="Track your order">
        <div className="to-header">
          <h2>{step === 'result' ? 'ORDER STATUS' : 'TRACK YOUR ORDER'}</h2>
          <button className="to-close" onClick={close} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'form' && (
          <form className="to-body" onSubmit={handleSubmit} noValidate>
            <p className="to-intro">Enter your Order ID and the phone number you used at checkout.</p>

            <div className="to-field">
              <label htmlFor="to-order-id">Order ID</label>
              <input
                id="to-order-id"
                name="orderId"
                type="text"
                placeholder="BK-XXXXXX"
                value={form.orderId}
                onChange={handleChange}
                className={errors.orderId ? 'error' : ''}
                autoComplete="off"
                maxLength={9}
              />
              {errors.orderId && <span className="to-error">{errors.orderId}</span>}
            </div>

            <div className="to-field">
              <label htmlFor="to-phone">Mobile Number</label>
              <div className="to-phone-wrap">
                <span className="to-phone-prefix">+91</span>
                <input
                  id="to-phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <span className="to-error">{errors.phone}</span>}
            </div>

            <button type="submit" className="btn to-submit-btn">
              Track Order
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <p className="to-help">
              Lost your Order ID? Check the confirmation email we sent you, or WhatsApp us at <strong>+91 92665 65336</strong>.
            </p>
          </form>
        )}

        {step === 'loading' && (
          <div className="to-state">
            <div className="to-spinner" />
            <p>Looking up your order…</p>
          </div>
        )}

        {step === 'notfound' && (
          <div className="to-state">
            <div className="to-state-icon to-state-icon--warn">?</div>
            <h3>We couldn't find that order</h3>
            <p>Double-check your Order ID and phone number. Both need to match what we have on file.</p>
            <button className="btn to-submit-btn" onClick={() => setStep('form')}>Try Again</button>
          </div>
        )}

        {step === 'result' && order && (
          <div className="to-result">
            <div className="to-result-head">
              <div>
                <span className="to-result-label">ORDER</span>
                <span className="to-result-id">{order.orderId}</span>
              </div>
              <div>
                <span className="to-result-label">CUSTOMER</span>
                <span className="to-result-name">{order.customerName}</span>
              </div>
            </div>

            <ProgressLadder steps={order.statusSteps} currentKey={order.status} />

            <div className="to-result-items">
              <h4 className="to-result-section-title">ITEMS</h4>
              {order.items.map((item) => (
                <div key={item.title + item.qty} className="to-result-item">
                  {item.image && <img src={item.image} alt={item.title} />}
                  <div className="to-result-item-info">
                    <span className="to-result-item-name">{item.title}</span>
                    {item.type && <span className="to-result-item-type">{item.type}</span>}
                  </div>
                  <div className="to-result-item-right">
                    <span>×{item.qty}</span>
                    {item.price && <span>₹{item.price * item.qty}</span>}
                  </div>
                </div>
              ))}
              <div className="to-result-total">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            <button className="btn to-submit-btn" onClick={close}>Done</button>
          </div>
        )}
      </div>
    </>
  )
}

function ProgressLadder({ steps, currentKey }) {
  const currentIndex = steps.findIndex((s) => s.key === currentKey)
  return (
    <ol className="to-ladder" aria-label="Order progress">
      {steps.map((step, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'pending'
        return (
          <li key={step.key} className={`to-ladder-step to-ladder-step--${state}`}>
            <div className="to-ladder-dot">{state === 'done' ? '✓' : i + 1}</div>
            <span className="to-ladder-label">{step.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
