const enc = new TextEncoder()

export async function createRazorpayOrder({ amount, currency, receipt, keyId, keySecret }) {
  const auth = btoa(`${keyId}:${keySecret}`)
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ amount, currency, receipt }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Razorpay order creation failed (${res.status}): ${body}`)
  }
  return res.json()
}

export async function verifyPaymentSignature({ orderId, paymentId, signature, keySecret }) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(keySecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${orderId}|${paymentId}`))
  const expected = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return timingSafeEqual(expected, signature)
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
