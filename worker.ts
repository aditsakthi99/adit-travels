interface Env {
  ANTHROPIC_API_KEY: string
  TRIPS: KVNamespace
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Redirect root to home.html
    if (url.pathname === '/') {
      return Response.redirect(new URL('/home.html', request.url).toString(), 302)
    }

    // GET all trips from KV
    if (url.pathname === '/api/trips' && request.method === 'GET') {
      const list = await env.TRIPS.list()
      const trips = await Promise.all(
        list.keys.map(async (key: any) => {
          const val = await env.TRIPS.get(key.name)
          return val ? JSON.parse(val) : null
        })
      )
      return Response.json(trips.filter(Boolean))
    }

    // POST generate a new trip via Claude
    if (url.pathname === '/api/generate-trip' && request.method === 'POST') {
      try {
        const { docText } = await request.json() as { docText: string }
        const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `Extract trip info from this itinerary and return ONLY valid JSON with these exact fields:
              id (url-friendly slug like "italy-2025"), title (trip name), year (4 digit string),
              dates (like "Mar 5 – Mar 20"), days (number), cities (array of city names),
              status ("completed"), emoji (single relevant emoji).
              Return ONLY the JSON object, no explanation.
              Itinerary: ${docText}`
            }]
          })
        })
        const aiData = await aiResponse.json() as any
        if (!aiData.content || !aiData.content[0]) {
          return Response.json({ error: 'Claude API error: ' + JSON.stringify(aiData) }, { status: 500 })
        }
        const raw = aiData.content[0].text.replace(/```json|```/g, '').trim()
        const trip = JSON.parse(raw)
        await env.TRIPS.put(trip.id, JSON.stringify(trip))
        return Response.json({ success: true, trip })
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 500 })
      }
    }

    // ── NEW: GET dashboard state from KV ──
    if (url.pathname === '/api/get-state' && request.method === 'GET') {
      const tripId = url.searchParams.get('tripId')
      if (!tripId) return Response.json({ error: 'missing tripId' }, { status: 400 })
      const val = await env.TRIPS.get('state_' + tripId)
      return Response.json(val ? JSON.parse(val) : null)
    }

    // ── NEW: POST dashboard state to KV ──
    if (url.pathname === '/api/save-state' && request.method === 'POST') {
      try {
        const { tripId, state } = await request.json() as { tripId: string, state: any }
        if (!tripId || !state) return Response.json({ error: 'missing tripId or state' }, { status: 400 })
        await env.TRIPS.put('state_' + tripId, JSON.stringify(state))
        return Response.json({ success: true })
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 500 })
      }
    }

    // For KV trips that don't have a dedicated HTML file
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length === 1) {
      const tripId = pathParts[0]
      if (!['admin', 'china-taiwan-2026', 'api', 'home.html', 'admin.html'].includes(tripId)) {
        const val = await env.TRIPS.get(tripId)
        if (val) {
          const trip = JSON.parse(val)
          const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${trip.title} — Adit's Travels</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0D1B12; color: #E8F5EE; min-height: 100vh; padding: 2rem; }
  .back { color: rgba(111,207,151,0.6); text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 2rem; }
  .card { max-width: 700px; margin: 0 auto; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(111,207,151,0.15); border-radius: 16px; padding: 2rem; }
  .emoji { font-size: 48px; margin-bottom: 1rem; }
  h1 { font-family: 'Noto Serif', serif; font-size: 28px; color: #E8F5EE; margin-bottom: 0.5rem; }
  .meta { color: rgba(111,207,151,0.5); font-size: 14px; margin-bottom: 1.5rem; }
  .cities { display: flex; flex-wrap: wrap; gap: 8px; }
  .city { font-size: 12px; padding: 4px 10px; border-radius: 4px; background: rgba(111,207,151,0.08); color: rgba(111,207,151,0.7); border: 0.5px solid rgba(111,207,151,0.15); }
  .note { margin-top: 2rem; padding: 1rem; background: rgba(111,207,151,0.05); border-radius: 8px; font-size: 13px; color: rgba(111,207,151,0.5); }
</style>
</head>
<body>
  <a href="/home.html" class="back">← Back to all trips</a>
  <div class="card">
    <div class="emoji">${trip.emoji || '✈'}</div>
    <h1>${trip.title}</h1>
    <div class="meta">${trip.dates} · ${trip.days} days · ${trip.year}</div>
    <div class="cities">${(trip.cities || []).map((c: string) => `<span class="city">${c}</span>`).join('')}</div>
    <div class="note">📄 Full dashboard coming soon.</div>
  </div>
</body>
</html>`
          return new Response(html, { headers: { 'Content-Type': 'text/html' } })
        }
      }
    }

    // Everything else goes to TanStack Start
    const { default: handler } = await import('@tanstack/react-start/server-entry')
    return handler.fetch(request, env)
  }
}