import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

const trips = [
  {
    id: 'china-taiwan-2026',
    title: 'China & Taiwan',
    year: '2026',
    dates: 'Apr 2 – Apr 18',
    days: 17,
    cities: ['Shanghai', 'Suzhou', 'Huangshan', 'Hangzhou', 'Beijing', 'Taiwan'],
    status: 'upcoming',
    emoji: '🏯',
    color: '#1B6B45',
    bg: '#E8F5EE',
  },
]

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D1B12', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0D1B12', borderBottom: '1px solid rgba(111,207,151,0.15)', padding: '2rem 2rem 1.5rem' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(111,207,151,0.5)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            ✈ Adit's Travels
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#E8F5EE', margin: 0 }}>
            Trip Journal
          </h1>
          <p style={{ color: 'rgba(111,207,151,0.5)', fontSize: '13px', marginTop: '0.4rem' }}>
            Every adventure, documented.
          </p>
        </div>
      </div>

      {/* Trips Grid */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(111,207,151,0.4)', marginBottom: '1rem' }}>
          {trips.length} trip{trips.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {trips.map(trip => (
            <a key={trip.id} href={`/${trip.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(111,207,151,0.15)',
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                {/* Emoji + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '32px' }}>{trip.emoji}</span>
                  <span style={{
                    fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500', letterSpacing: '0.05em',
                    background: trip.status === 'upcoming' ? 'rgba(111,207,151,0.15)' : 'rgba(255,255,255,0.08)',
                    color: trip.status === 'upcoming' ? '#6FCF97' : 'rgba(255,255,255,0.4)',
                    border: `0.5px solid ${trip.status === 'upcoming' ? 'rgba(111,207,151,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}>
                    {trip.status === 'upcoming' ? '✦ Upcoming' : '✓ Completed'}
                  </span>
                </div>

                {/* Title */}
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '600', color: '#E8F5EE', marginBottom: '4px' }}>
                  {trip.title}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(111,207,151,0.5)', marginBottom: '1rem' }}>
                  {trip.dates} · {trip.days} days
                </div>

                {/* Cities */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {trip.cities.map(city => (
                    <span key={city} style={{
                      fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                      background: 'rgba(111,207,151,0.08)',
                      color: 'rgba(111,207,151,0.7)',
                      border: '0.5px solid rgba(111,207,151,0.15)',
                    }}>
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}