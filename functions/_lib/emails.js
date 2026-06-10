import { signAdvanceUrl } from './orders.js'

export async function sendEmail({ apiKey, from, to, replyTo, subject, html }) {
  const body = { from, to, subject, html }
  if (replyTo) body.reply_to = replyTo

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${errBody}`)
  }
  return res.json()
}

function buildItemRows(items) {
  return items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e3d0;font-family:'Arial',sans-serif;font-size:14px;color:#113516;vertical-align:top;">
        <div style="font-weight:bold;">${escapeHtml(item.title)} <span style="color:#888;font-size:12px;font-weight:normal;">(${escapeHtml(item.type)})</span></div>
        ${item.description ? `<div style="margin-top:4px;color:#555;font-size:12px;line-height:1.5;">Includes: ${escapeHtml(item.description)}</div>` : ''}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e3d0;text-align:center;font-family:'Arial',sans-serif;font-size:14px;color:#113516;vertical-align:top;">×${item.qty}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e3d0;text-align:right;font-family:'Arial',sans-serif;font-size:14px;font-weight:bold;color:#113516;vertical-align:top;">
        ${item.price ? `₹${item.price * item.qty}` : '—'}
      </td>
    </tr>
  `
    )
    .join('')
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function nl2br(s) {
  return escapeHtml(s).replace(/\n/g, '<br>')
}

export function customerEmailHtml({ orderId, customerName, items, totalAmount, customerAddress, paymentId, siteUrl }) {
  const trackUrl = `${siteUrl}/#track`
  return `
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
            <td style="padding:28px 32px 8px;">
              <p style="margin:0;font-size:16px;color:#113516;">Hey <strong>${escapeHtml(customerName)}</strong> 👋</p>
              <p style="margin:10px 0 0;font-size:15px;color:#555;line-height:1.6;">Your order is confirmed and your baked goodies are being packed fresh for you.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1e1;border:2px dashed #113516;border-radius:6px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Your Order ID</p>
                    <p style="margin:4px 0 12px;color:#113516;font-size:24px;font-weight:900;font-family:'Arial Black',sans-serif;letter-spacing:2px;">${escapeHtml(orderId)}</p>
                    <a href="${escapeHtml(trackUrl)}" style="display:inline-block;background:#FCA311;color:#113516;font-weight:900;text-decoration:none;padding:10px 20px;border-radius:50px;border:2px solid #113516;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Track Your Order →</a>
                    <p style="margin:10px 0 0;color:#888;font-size:11px;">Save this ID — you'll need it (along with your phone number) to track your order.</p>
                  </td>
                </tr>
              </table>
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
              <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">${nl2br(customerAddress)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:12px;color:#aaa;">Payment ID: <strong style="color:#888;">${escapeHtml(paymentId)}</strong></p>
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
}

export async function merchantEmailHtml({ orderId, customerName, customerEmail, customerPhone, customerAddress, items, totalAmount, paymentId, siteUrl, adminSecret }) {
  const bakingUrl = await signAdvanceUrl(siteUrl, orderId, 'baking', adminSecret)
  const outUrl = await signAdvanceUrl(siteUrl, orderId, 'out_for_delivery', adminSecret)
  const deliveredUrl = await signAdvanceUrl(siteUrl, orderId, 'delivered', adminSecret)
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f1e1;font-family:'Arial',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1e1;padding:32px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:3px solid #113516;box-shadow:6px 6px 0 #113516;max-width:600px;width:100%;">
          <tr>
            <td style="background:#E63946;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:3px;font-family:'Arial Black',sans-serif;">🍪 NEW ORDER · ${escapeHtml(orderId)}</h1>
              <p style="margin:6px 0 0;color:#fff;font-size:13px;opacity:0.9;">Bakeats · ${escapeHtml(timestamp)}</p>
            </td>
          </tr>

          <tr>
            <td style="background:#113516;padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#FCA311;font-size:28px;font-weight:bold;font-family:'Arial Black',sans-serif;">₹${totalAmount}</p>
              <p style="margin:4px 0 0;color:#f4f1e1;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Order Total · Free Delivery</p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 16px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 14px;border-bottom:2px solid #113516;padding-bottom:8px;">Customer Details</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#888;width:120px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Name</td>
                  <td style="padding:6px 0;font-size:14px;color:#113516;font-weight:bold;">${escapeHtml(customerName)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Phone</td>
                  <td style="padding:6px 0;font-size:14px;color:#113516;font-weight:bold;">+91 ${escapeHtml(customerPhone)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Email</td>
                  <td style="padding:6px 0;font-size:14px;color:#113516;">${escapeHtml(customerEmail)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 20px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 10px;border-bottom:2px solid #113516;padding-bottom:8px;">Delivery Address</h2>
              <p style="margin:0;font-size:14px;color:#444;line-height:1.7;background:#f9f7ee;padding:12px 14px;border-left:4px solid #FCA311;">${nl2br(customerAddress)}</p>
            </td>
          </tr>

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
                <tbody>${buildItemRows(items)}</tbody>
                <tfoot>
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
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 14px;border-bottom:2px solid #113516;padding-bottom:8px;">Update Status</h2>
              <p style="margin:0 0 14px;color:#666;font-size:12px;">Click a button to advance this order. Each link is signed and only works for this specific order.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 10px;">
                    <a href="${escapeHtml(bakingUrl)}" style="display:block;background:#FCA311;color:#113516;font-weight:900;text-decoration:none;padding:12px 18px;border-radius:50px;border:2px solid #113516;font-size:13px;letter-spacing:1px;text-transform:uppercase;text-align:center;">🥣 Mark as Baking</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 10px;">
                    <a href="${escapeHtml(outUrl)}" style="display:block;background:#FCA311;color:#113516;font-weight:900;text-decoration:none;padding:12px 18px;border-radius:50px;border:2px solid #113516;font-size:13px;letter-spacing:1px;text-transform:uppercase;text-align:center;">🛵 Mark as Out for Delivery</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="${escapeHtml(deliveredUrl)}" style="display:block;background:#2a9d2a;color:#ffffff;font-weight:900;text-decoration:none;padding:12px 18px;border-radius:50px;border:2px solid #113516;font-size:13px;letter-spacing:1px;text-transform:uppercase;text-align:center;">✅ Mark as Delivered</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 28px;">
              <h2 style="font-size:13px;letter-spacing:2px;color:#113516;text-transform:uppercase;margin:0 0 10px;border-bottom:2px solid #113516;padding-bottom:8px;">Payment</h2>
              <p style="margin:0;font-size:13px;color:#555;">Payment ID: <strong style="color:#113516;">${escapeHtml(paymentId)}</strong></p>
              <p style="margin:6px 0 0;font-size:13px;color:#2a9d2a;font-weight:bold;">✓ Verified &amp; Paid</p>
            </td>
          </tr>

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
}
