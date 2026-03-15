import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function MagneticCursor() {
  const [visible, setVisible] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default') // default | hover | image | text
  const [cursorText, setCursorText] = useState('')
  const cursorSize = useMotionValue(20)

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)
  const size = useSpring(20, { damping: 20, stiffness: 300 })

  const isCoarse = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      isCoarse.current = true
      return
    }

    const handleMouseMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target) {
        const type = target.getAttribute('data-cursor')
        setCursorVariant(type)
        if (type === 'text') {
          setCursorText(target.getAttribute('data-cursor-text') || 'View')
        }
        size.set(type === 'image' ? 80 : type === 'text' ? 64 : type === 'hover' ? 48 : 20)
      } else if (e.target.closest('a, button, [data-magnetic]')) {
        setCursorVariant('hover')
        size.set(48)
      } else {
        setCursorVariant('default')
        size.set(20)
        setCursorText('')
      }
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [visible, x, y, size])

  if (isCoarse.current) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-[60] pointer-events-none flex items-center justify-center"
      style={{
        x,
        y,
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border transition-colors duration-300"
        style={{
          borderColor: cursorVariant === 'default'
            ? 'rgba(245, 240, 232, 0.5)'
            : cursorVariant === 'image'
            ? 'rgba(79, 70, 229, 0.6)'
            : cursorVariant === 'text'
            ? 'rgba(236, 72, 153, 0.6)'
            : 'rgba(79, 70, 229, 0.8)',
          backgroundColor: cursorVariant === 'image'
            ? 'rgba(79, 70, 229, 0.1)'
            : cursorVariant === 'text'
            ? 'rgba(236, 72, 153, 0.1)'
            : 'transparent',
          backdropFilter: cursorVariant !== 'default' ? 'blur(4px)' : 'none',
        }}
      />

      {/* Center dot (only in default) */}
      {cursorVariant === 'default' && (
        <div className="w-1 h-1 bg-cream rounded-full" />
      )}

      {/* Text label (for text variant) */}
      {cursorVariant === 'text' && cursorText && (
        <span className="text-cream text-[10px] tracking-[0.15em] uppercase font-body select-none">
          {cursorText}
        </span>
      )}

      {/* View icon (for image variant) */}
      {cursorVariant === 'image' && (
        <svg className="w-5 h-5 text-cream/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </motion.div>
  )
}
