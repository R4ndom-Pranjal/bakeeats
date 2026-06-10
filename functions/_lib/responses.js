export function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
}

export function error(status, message) {
  return json({ error: message }, { status })
}

export function html(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...(init.headers || {}) },
  })
}
