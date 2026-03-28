import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [docText, setDocText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

  async function handleSubmit() {
    if (!docText.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docText }),
      })
      const data = await res.json()
      setResult(data.trip)
      setStatus('success')
      setDocText('')
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B12', fontFamily: 'DM Sans, system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <a href="/" style={{ color: 'rgba(111,207,151,0.6)', textDecoration: 'none', fontSize: '13px' }}>← Back</a>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#E8F5EE', margin: '0.5rem 0 0.25rem' }}>
            Add a Past Trip
          </h1>
          <p style={{ color: 'rgba(111,207,151,0.5)', fontSize: '13px', margin: 0 }}>
            Paste your Google Doc itinerary below — Claude will extract the details automatically.
          </p>
        </div>

        {/* Text area */}
        <textarea
          value={docText}
          onChange={e => setDocText(e.target.value)}
          placeholder="Paste your full Google Doc itinerary here..."
          style={{
            width: '100%', height: '320px',
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(111,207,151,0.2)',
            borderRadius: '12px', padding: '1rem',
            color: '#E8F5EE', fontSize: '13px',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            resize: 'vertical', outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={status === 'loading' || !docText.trim()}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            background: status === 'loading' ? 'rgba(111,207,151,0.2)' : '#1B6B45',
            color: '#E8F5EE', border: 'none',
            borderRadius: '8px', fontSize: '14px',
            fontWeight: '500', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {status === 'loading' ? '✨ Claude is reading your itinerary...' : '✨ Generate Trip Dashboard'}
        </button>

        {/* Success */}
        {status === 'success' && result && (
          <div style={{
            marginTop: '1.5rem', padding: '1.25rem',
            background: 'rgba(111,207,151,0.08)',
            border: '0.5px solid rgba(111,207,151,0.25)',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(111,207,151,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              ✓ Trip added successfully
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#E8F5EE' }}>
              {result.emoji} {result.title}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(111,207,151,0.6)', marginTop: '4px' }}>
              {result.dates} · {result.days} days · {result.cities?.join(', ')}
            </div>
            <a href="/" style={{
              display: 'inline-block', marginTop: '1rem',
              color: '#6FCF97', fontSize: '13px',
            }}>
              → View on homepage
            </a>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div style={{ marginTop: '1rem', color: '#E88', fontSize: '13px' }}>
            Something went wrong. Make sure you have API credits and try again.
          </div>
        )}
      </div>
    </div>
  )
}