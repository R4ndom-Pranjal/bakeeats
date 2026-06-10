export const STATUSES = ['placed', 'baking', 'out_for_delivery', 'delivered']

export const STATUS_LABELS = {
  placed: 'Order Placed',
  baking: 'Baking',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
}

// Unambiguous alphabet: no 0/O/1/I/L
const ID_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateOrderId() {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  let id = 'BK-'
  for (const b of bytes) id += ID_CHARS[b % ID_CHARS.length]
  return id
}

const enc = new TextEncoder()

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function signAdvanceUrl(siteUrl, orderId, nextStatus, secret) {
  const sig = await hmacHex(secret, `${orderId}:${nextStatus}`)
  return `${siteUrl}/api/order/${orderId}/advance?to=${nextStatus}&sig=${sig}`
}

export async function verifyAdvanceSig(orderId, nextStatus, sig, secret) {
  const expected = await hmacHex(secret, `${orderId}:${nextStatus}`)
  return timingSafeEqual(expected, sig)
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
