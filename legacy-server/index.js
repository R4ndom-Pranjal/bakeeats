require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const SMTP_PORT = Number(process.env.EMAIL_PORT) || 465
const mailer = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const passPreview = (process.env.EMAIL_PASS || '').trim()
console.log('[SMTP config]', {
  host: process.env.EMAIL_HOST,
  port: SMTP_PORT,
  user: process.env.EMAIL_USER,
  passLength: passPreview.length,
  passFirst4: passPreview.slice(0, 4),
  passLast4: passPreview.slice(-4),
})

mailer.verify((err) => {
  if (err) console.error('SMTP connection failed:', err.message)
  else console.log(`SMTP ready on ${process.env.EMAIL_HOST}:${SMTP_PORT} as ${process.env.EMAIL_USER}`)
})

const FROM_ADDRESS = `Bakeats <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`
const MERCHANT_ADDRESS = process.env.MERCHANT_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER

// ── Create Razorpay order ──────────────────────────────────────────────────
app.post('/api/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body

  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Invalid amount' })
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    })
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err) {
    console.error('Razorpay order creation failed:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// ── Verify payment + send notifications ───────────────────────────────────
app.post('/api/verify-payment', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    items,
    totalAmount,
  } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing payment details' })
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Payment verification failed' })
  }

  const orderData = { customerName, customerEmail, customerPhone, customerAddress, items, totalAmount, paymentId: razorpay_payment_id }

  sendCustomerEmail(orderData).catch(err => console.error('Customer email failed:', err.message))
  sendMerchantEmail(orderData).catch(err => console.error('Merchant email failed:', err.message))

  res.json({ success: true, paymentId: razorpay_payment_id })
})

// ── Shared item rows HTML ──────────────────────────────────────────────────
function buildItemRows(items) {
  return items.map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e3d0;font-family:'Arial',sans-serif;font-size:14px;color:#113516;vertical-align:top;">
        <div style="font-weight:bold;">${item.title} <span style="color:#888;font-size:12px;font-weight:normal;">(${item.type})</span></div>
        ${item.description ? `<div style="margin-top:4px;color:#555;font-size:12px;line-height:1.5;">Includes: ${item.description}</div>` : ''}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e3d0;text-align:center;font-family:'Arial',sans-serif;font-size:14px;color:#113516;vertical-align:top;">×${item.qty}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e3d0;text-align:right;font-family:'Arial',sans-serif;font-size:14px;font-weight:bold;color:#113516;vertical-align:top;">
        ${item.price ? `₹${item.price * item.qty}` : '—'}
      </td>
    </tr>
  `).join('')
}

// ── Email to customer ──────────────────────────────────────────────────────
async function sendCustomerEmail({ customerName, customerEmail, customerAddress, items, totalAmount, paymentId }) {
  if (!process.env.EMAIL_HOST) return

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f1e1;font-family:'Arial',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1e1;padding:32px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:3px solid #113516;box-shadow:6px 6px 0 #113516;max-width:600px;width:100%;">
          <tr>
            <td style="background:#113516;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#f4f1e1;font-size:32px;letter-spacing:4px;font-family:'Arial Black',sans-serif;">BAKEATS</h1>
              <p style="margin:6px 0 0;color:#FCA311;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Confirmation</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 16px;">
              <p style="margin:0;font-size:16px;color:#113516;">Hey <strong>${customerName}</strong> 👋</p>
              <p style="margin:10px 0 0;font-size:15px;color:#555;line-height:1.6;">Your order is confirmed and your baked goodies are being packed fresh for you. We'll be in touch soon!</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 12px;border-bottom:2px solid #113516;padding-bottom:8px;">Order Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background:#f4f1e1;">
                    <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Item</th>
                    <th style="padding:8px 12px;text-align:center;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Qty</th>
                    <th style="padding:8px 12px;text-align:right;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Price</th>
                  </tr>
                </thead>
                <tbody>${buildItemRows(items)}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding:12px;text-align:right;font-size:13px;color:#555;text-transform:uppercase;letter-spacing:1px;">Delivery</td>
                    <td style="padding:12px;text-align:right;font-size:13px;color:#2a9d2a;font-weight:bold;">FREE</td>
                  </tr>
                  <tr style="background:#f4f1e1;">
                    <td colspan="2" style="padding:12px;text-align:right;font-size:15px;font-weight:bold;color:#113516;text-transform:uppercase;letter-spacing:1px;">Total</td>
                    <td style="padding:12px;text-align:right;font-size:20px;font-weight:bold;color:#E63946;">₹${totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 10px;border-bottom:2px solid #113516;padding-bottom:8px;">Delivery Address</h2>
              <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">${customerAddress.replace(/\n/g, '<br>')}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:12px;color:#aaa;">Payment ID: <strong style="color:#888;">${paymentId}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background:#113516;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#f4f1e1;font-size:12px;opacity:0.8;">Questions? WhatsApp us at +91 92665 65336</p>
              <p style="margin:6px 0 0;color:#FCA311;font-size:11px;letter-spacing:1px;">TASTE MEIN A++ · BAKEATS</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  await mailer.sendMail({
    from: FROM_ADDRESS,
    to: customerEmail,
    subject: `Order Confirmed — ₹${totalAmount} | Bakeats 🍪`,
    html,
  })

  console.log(`Customer confirmation sent to ${customerEmail}`)
}

// ── Email to merchant ──────────────────────────────────────────────────────
async function sendMerchantEmail({ customerName, customerEmail, customerPhone, customerAddress, items, totalAmount, paymentId }) {
  if (!process.env.EMAIL_HOST) return

  const itemList = buildItemRows(items)

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f1e1;font-family:'Arial',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1e1;padding:32px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:3px solid #113516;box-shadow:6px 6px 0 #113516;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#E63946;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:3px;font-family:'Arial Black',sans-serif;">🍪 NEW ORDER RECEIVED</h1>
              <p style="margin:6px 0 0;color:#fff;font-size:13px;opacity:0.9;">Bakeats · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </td>
          </tr>

          <!-- Order Total Banner -->
          <tr>
            <td style="background:#113516;padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#FCA311;font-size:28px;font-weight:bold;font-family:'Arial Black',sans-serif;">₹${totalAmount}</p>
              <p style="margin:4px 0 0;color:#f4f1e1;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Order Total · Free Delivery</p>
            </td>
          </tr>

          <!-- Customer Details -->
          <tr>
            <td style="padding:24px 32px 16px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 14px;border-bottom:2px solid #113516;padding-bottom:8px;">Customer Details</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#888;width:120px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Name</td>
                  <td style="padding:6px 0;font-size:14px;color:#113516;font-weight:bold;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Phone</td>
                  <td style="padding:6px 0;font-size:14px;color:#113516;font-weight:bold;">+91 ${customerPhone}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Email</td>
                  <td style="padding:6px 0;font-size:14px;color:#113516;">${customerEmail}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address -->
          <tr>
            <td style="padding:0 32px 20px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 10px;border-bottom:2px solid #113516;padding-bottom:8px;">Delivery Address</h2>
              <p style="margin:0;font-size:14px;color:#444;line-height:1.7;background:#f9f7ee;padding:12px 14px;border-left:4px solid #FCA311;">${customerAddress.replace(/\n/g, '<br>')}</p>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:0 32px 24px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 12px;border-bottom:2px solid #113516;padding-bottom:8px;">Items Ordered</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background:#f4f1e1;">
                    <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Item</th>
                    <th style="padding:8px 12px;text-align:center;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Qty</th>
                    <th style="padding:8px 12px;text-align:right;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Price</th>
                  </tr>
                </thead>
                <tbody>${itemList}</tbody>
                <tfoot>
                  <tr style="background:#f4f1e1;">
                    <td colspan="2" style="padding:12px;text-align:right;font-size:15px;font-weight:bold;color:#113516;text-transform:uppercase;letter-spacing:1px;">Total</td>
                    <td style="padding:12px;text-align:right;font-size:20px;font-weight:bold;color:#E63946;">₹${totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <!-- Payment ID -->
          <tr>
            <td style="padding:0 32px 28px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 10px;border-bottom:2px solid #113516;padding-bottom:8px;">Payment</h2>
              <p style="margin:0;font-size:13px;color:#555;">Payment ID: <strong style="color:#113516;">${paymentId}</strong></p>
              <p style="margin:6px 0 0;font-size:13px;color:#2a9d2a;font-weight:bold;">✓ Verified &amp; Paid</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#113516;padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#f4f1e1;font-size:11px;opacity:0.7;">Bakeats Order Management · info@pndeximindia.com</p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  await mailer.sendMail({
    from: FROM_ADDRESS,
    to: MERCHANT_ADDRESS,
    replyTo: customerEmail,
    subject: `🍪 New Order — ${customerName} · ₹${totalAmount}`,
    html,
  })

  console.log(`Merchant notification sent to ${MERCHANT_ADDRESS}`)
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Bakeats server running on http://localhost:${PORT}`))
