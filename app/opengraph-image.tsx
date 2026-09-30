import { ImageResponse } from 'next/og'

export const alt = 'Specter & Ops — DevOps Society, Bennett University'
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
          border: '12px solid #d4a84b',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#d4a84b', letterSpacing: 6 }}>
          DEVOPS SOCIETY · BENNETT UNIVERSITY · EST. 2022
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 116, lineHeight: 1.05 }}>
          <div style={{ display: 'flex' }}>We don&apos;t get lucky.</div>
          <div style={{ display: 'flex', color: '#d4a84b' }}>We ship.</div>
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#9a978f' }}>
          Specter &amp; Ops — Attorneys at Deploy
        </div>
      </div>
    ),
    size,
  )
}
