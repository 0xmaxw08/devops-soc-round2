import { ImageResponse } from 'next/og'

export const alt = 'Specter & Ops — The DevOps Club'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#101116',
          color: '#f3efe6',
          padding: 72,
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#c9a24a', letterSpacing: 6 }}>
          THE DEVOPS CLUB · EST. 2021
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 120, lineHeight: 1 }}>
          <div style={{ display: 'flex' }}>We don&apos;t get lucky.</div>
          <div style={{ display: 'flex', color: '#c9a24a', fontStyle: 'italic' }}>We ship.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#9a978f' }}>Specter &amp; Ops — Attorneys at Deploy</div>
      </div>
    ),
    size,
  )
}
