// React Bits-style effects (SplitText, Magnet, SpotlightCard + tilt) built on GSAP, plus Lenis smooth scroll.
// To use the official React Bits versions instead, install them from reactbits.dev and swap the imports in App.jsx.
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

export const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const hover = () => matchMedia('(hover: hover)').matches

export function useLenis() {
  useEffect(() => {
    if (reduce()) return
    const lenis = new Lenis({ lerp: 0.1 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null }
  }, [])
}

export const jump = (e, id) => {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -120 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function SplitText({ text, tag: Tag = 'span', className = '', stagger = 0.06 }) {
  const ref = useRef()
  useEffect(() => {
    if (reduce()) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.w'), {
        yPercent: 110, rotate: 4, stagger, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [text, stagger])
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span className="w" style={{ display: 'inline-block' }}>{w}&nbsp;</span>
        </span>
      ))}
    </Tag>
  )
}

export function Magnet({ children, strength = 0.3, className = '' }) {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    if (reduce() || !hover()) return
    const move = (e) => {
      const b = el.getBoundingClientRect()
      gsap.to(el, { x: (e.clientX - b.left - b.width / 2) * strength, y: (e.clientY - b.top - b.height / 2) * strength, duration: 0.4 })
    }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.5)' })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return <span ref={ref} className={className} style={{ display: 'inline-block' }}>{children}</span>
}

// Spotlight glow that follows the cursor + subtle 3D tilt
export function SpotlightCard({ children, className = '', ...rest }) {
  const ref = useRef()
  const move = (e) => {
    if (!hover() || reduce()) return
    const el = ref.current, b = el.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height
    el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%')
    gsap.to(el, { rotationY: (x - 0.5) * 8, rotationX: -(y - 0.5) * 8, transformPerspective: 800, duration: 0.4 })
  }
  const leave = () => gsap.to(ref.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'elastic.out(1,.6)' })
  return <article ref={ref} className={`${className} sc`} onPointerMove={move} onPointerLeave={leave} {...rest}>{children}</article>
}
