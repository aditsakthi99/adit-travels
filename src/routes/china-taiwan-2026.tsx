import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/china-taiwan-2026')({
  component: ChinaTaiwanDashboard,
})

function ChinaTaiwanDashboard() {
  return (
    <div style={{ background: '#0D1B12', minHeight: '100vh' }}>
      <div style={{ padding: '0.75rem 1rem', background: '#0D1B12', borderBottom: '1px solid rgba(111,207,151,0.1)' }}>
        <Link
          to="/"
          style={{
            color: 'rgba(111,207,151,0.7)',
            textDecoration: 'none',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back to all trips
        </Link>
      </div>
      <iframe
        src="/china-taiwan-2026.html"
        style={{
          width: '100%',
          height: 'calc(100vh - 48px)',
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  )
}