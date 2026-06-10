import { html as htmlResponse } from '../../../_lib/responses.js'
import { STATUSES, STATUS_LABELS, verifyAdvanceSig } from '../../../_lib/orders.js'

export async function onRequestGet({ request, env, params }) {
  const orderId = params.id
  const url = new URL(request.url)
  const nextStatus = url.searchParams.get('to')
  const sig = url.searchParams.get('sig')

  if (!orderId || !nextStatus || !sig) {
    return page('Missing parameters', 'This link is incomplete. Use the buttons in the order email.', false)
  }

  if (!STATUSES.includes(nextStatus)) {
    return page('Invalid status', `"${nextStatus}" is not a valid order status.`, false)
  }

  const valid = await verifyAdvanceSig(orderId, nextStatus, sig, env.ADMIN_TOKEN)
  if (!valid) {
    return page('Invalid signature', 'This link is invalid or has been tampered with.', false)
  }

  const updated = await env.DB.prepare(
    `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?`
  )
    .bind(nextStatus, orderId)
    .run()

  if (!updated.meta.changes) {
    return page('Order not found', `No order with ID ${orderId}.`, false)
  }

  return page(
    'Status updated',
    `Order <strong>${escapeHtml(orderId)}</strong> is now marked as <strong>${escapeHtml(STATUS_LABELS[nextStatus])}</strong>.`,
    true
  )
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function page(title, body, success) {
  const color = success ? '#2a9d2a' : '#E63946'
  const icon = success ? '✓' : '⚠'
  return htmlResponse(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)} · Bakeats</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f4f1e1;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:480px;width:90%;background:#fff;border:3px solid #113516;box-shadow:6px 6px 0 #113516;border-radius:8px;padding:40px;text-align:center;">
    <div style="font-size:64px;color:${color};margin-bottom:16px;">${icon}</div>
    <h1 style="margin:0 0 12px;color:#113516;font-size:24px;">${escapeHtml(title)}</h1>
    <p style="margin:0;color:#555;font-size:15px;line-height:1.5;">${body}</p>
  </div>
</body>
</html>`)
}
