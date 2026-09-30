'use client'

import { useEffect, useRef } from 'react'

// Elements that make the ring grow when the cursor is over them.
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary'

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0')

/**
 * Desktop-only cursor follower: a dot that sticks to the pointer, a ring that
 * trails it, and a small "docket" readout of the coordinates.
 * Nothing is stored or sent anywhere. Position lives in local variables and is
 * written straight to the DOM, so React never re-renders on mouse move.
 */
export function CursorTracker() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Only for devices with a real hovering mouse. Phones and tablets bail out here.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!root || !dot || !ring || !label) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = reduced ? 1 : 0.18 // 1 = ring snaps to the cursor, no trailing

    let x = 0
    let y = 0
    let rx = 0
    let ry = 0
    let raf = 0
    let seen = false
    let hovering = false

    const tick = () => {
      rx += (x - rx) * ease
      ry += (y - ry) * ease
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) {
        rx = x
        ry = y
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
        raf = 0 // settled: stop the loop until the mouse moves again
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      label.textContent = `x ${pad(x)} · y ${pad(y)}`

      if (!seen) {
        seen = true
        rx = x
        ry = y // first move: no long slide in from the corner
      }
      if (root.dataset.visible !== 'true') root.dataset.visible = 'true'

      const over = !!(e.target as Element | null)?.closest?.(INTERACTIVE)
      if (over !== hovering) {
        hovering = over
        ring.dataset.hover = String(over)
      }

      if (!raf) raf = requestAnimationFrame(tick)
    }

    const hide = () => {
      root.dataset.visible = 'false'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-visible="false"
      className="pointer-events-none fixed inset-0 z-[130] opacity-0 transition-opacity duration-200 data-[visible=true]:opacity-100 motion-reduce:transition-none"
    >
      {/* Ring: trails the pointer. Grows over anything clickable. */}
      <div ref={ringRef} data-hover="false" className="group fixed left-0 top-0 will-change-transform">
        <span className="absolute left-0 top-0 block size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70 transition-[width,height,background-color] duration-200 group-data-[hover=true]:size-14 group-data-[hover=true]:bg-gold/10 motion-reduce:transition-none" />
        <span
          ref={labelRef}
          className="absolute left-6 top-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-gold/80"
        />
      </div>

      {/* Dot: pinned to the exact pointer position. */}
      <div ref={dotRef} className="fixed left-0 top-0 will-change-transform">
        <span className="absolute left-0 top-0 block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
      </div>
    </div>
  )
}
