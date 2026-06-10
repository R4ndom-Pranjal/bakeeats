import { verifyPaymentSignature } from '../_lib/razorpay.js'
import { generateOrderId } from '../_lib/orders.js'
import { sendEmail, customerEmailHtml, merchantEmailHtml } from '../_lib/emails.js'
import { json, error } from '../_lib/responses.js'

export async function onRequestPost({ request, env, waitUntil }) {
  let body
  try {
    body = await request.json()
  } catch {
    return error(400, 'Invalid JSON body')
  }

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
  } = body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return json({ success: false, error: 'Missing payment details' }, { status: 400 })
  }

  const valid = await verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    keySecret: env.RAZORPAY_KEY_SECRET,
  })

  if (!valid) {
    return json({ success: false, error: 'Payment verification failed' }, { status: 400 })
  }

  const orderId = await insertOrderWithRetry(env.DB, {
    razorpay_order_id,
    razorpay_payment_id,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    items,
    totalAmount,
  })

  const emailPayload = {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    items,
    totalAmount,
    paymentId: razorpay_payment_id,
    siteUrl: env.SITE_URL,
  }

  // Fire-and-forget: don't block the response on email delivery
  waitUntil(
    Promise.all([
      sendEmail({
        apiKey: env.RESEND_API_KEY,
        from: `Bakeats <${env.FROM_EMAIL}>`,
        to: customerEmail,
        subject: `Order Confirmed · ${orderId} · ₹${totalAmount}`,
        html: customerEmailHtml(emailPayload),
      }).catch((err) => console.error('Customer email failed:', err.message)),
      merchantEmailHtml({ ...emailPayload, adminSecret: env.ADMIN_TOKEN }).then((html) =>
        sendEmail({
          apiKey: env.RESEND_API_KEY,
          from: `Bakeats <${env.FROM_EMAIL}>`,
          to: env.MERCHANT_EMAIL,
          replyTo: customerEmail,
          subject: `🍪 New Order · ${customerName} · ${orderId} · ₹${totalAmount}`,
          html,
        })
      ).catch((err) => console.error('Merchant email failed:', err.message)),
    ])
  )

  return json({ success: true, paymentId: razorpay_payment_id, orderId })
}

async function insertOrderWithRetry(db, data, attempt = 0) {
  if (attempt > 3) throw new Error('Could not generate a unique order ID after 3 attempts')

  const orderId = generateOrderId()
  try {
    await db
      .prepare(
        `INSERT INTO orders (
          order_id, razorpay_order_id, razorpay_payment_id,
          customer_name, customer_email, customer_phone, customer_address,
          items, total_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'placed')`
      )
      .bind(
        orderId,
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.customerAddress,
        JSON.stringify(data.items),
        data.totalAmount
      )
      .run()
    return orderId
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return insertOrderWithRetry(db, data, attempt + 1)
    }
    throw err
  }
}
