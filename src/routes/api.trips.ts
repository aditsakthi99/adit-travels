import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/trips')({
  GET: async ({ request, context }) => {
    const env = (context as any).cloudflare?.env
    const trips = await env.TRIPS.list()
    const results = await Promise.all(
      trips.keys.map(async (key: any) => {
        const val = await env.TRIPS.get(key.name)
        return JSON.parse(val)
      })
    )
    return Response.json(results)
  },

  POST: async ({ request, context }) => {
    const env = (context as any).cloudflare?.env
    const { docText } = await request.json()

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
          content: `Extract trip info from this itinerary and return ONLY valid JSON with these fields:
          id (slug like "japan-2024"), title, year, dates (like "Mar 5 – Mar 20"), days (number),
          cities (array), status ("completed" or "upcoming"), emoji (single relevant emoji).
          
          Itinerary:
          ${docText}`
        }]
      })
    })

    const aiData = await aiResponse.json() as any
    const raw = aiData.content[0].text.replace(/```json|```/g, '').trim()
    const trip = JSON.parse(raw)

    await env.TRIPS.put(trip.id, JSON.stringify(trip))
    return Response.json({ success: true, trip })
  }
})