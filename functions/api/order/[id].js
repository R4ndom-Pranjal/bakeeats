import { json, error } from '../../_lib/responses.js'
import { STATUSES, STATUS_LABELS } from '../../_lib/orders.js'

export async function onRequestGet({ request, env, params }) {
  const orderId = params.id
  const url = new URL(request.url)
  const phone = url.searchParams.get('phone')

  if (!orderId || !phone) {
    return error(400, 'Order ID and phone are required')
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return error(400, 'Invalid phone number')
  }

  const row = await env.DB.prepare(
    `SELECT order_id, customer_phone, customer_name, items, total_amount, status, created_at, updated_at
     FROM orders WHERE order_id = ?`
  )
    .bind(orderId)
    .first()

  // Use a constant-time-ish compare to avoid leaking which order IDs exist
  const phoneMatch = row && timingSafeEqual(row.customer_phone, phone)

  if (!row || !phoneMatch) {
    return error(404, 'Order not found')
  }

  return json({
    orderId: row.order_id,
    customerName: row.customer_name,
    items: JSON.parse(row.items),
    totalAmount: row.total_amount,
    status: row.status,
    statusLabel: STATUS_LABELS[row.status] || row.status,
    statusSteps: STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s] })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
