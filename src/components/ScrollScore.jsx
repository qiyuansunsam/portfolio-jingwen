import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'

function ScoreNumber({ motionValue }) {
  const [display, setDisplay] = useState('6')
  useMotionValueEvent(motionValue, 'change', (v) => {
    setDisplay(String(Math.round(v)))
  })
  return <>{display}</>
}

export default function ScrollScore() {
  const { scrollYProgress } = useScroll()
  const [px, setPx] = useState({ x: 0, y: 0 })
  const rafRef = useRef(null)

  const scoreNum = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.65, 0.85, 1.0],
    [6, 7, 8, 9, 9, 10]
  )

  // Only shows in the middle sections (when in the corner)
  // Hero and footer have their own inline score via ScoreInline
  const showFixed = useTransform(
    scrollYProgress,
    [0, 0.10, 0.16, 0.84, 0.90, 1.0],
    [0, 0, 1, 1, 0, 0]
  )

  const rawScale = useTransform(
    scrollYProgress,
    [0.10, 0.16, 0.84, 0.90],
    [0.4, 0.7, 0.7, 0.4]
  )
  const scale = useSpring(rawScale, { stiffness: 80, damping: 20 })

  return (
    <motion.div
      className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[5] select-none pointer-events-none"
      style={{
        opacity: showFixed,
        scale,
      }}
    >
      <div
        className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.8] tracking-tight"
        style={{
          color: 'transparent',
          WebkitTextStroke: '2px rgba(200, 40, 40, 0.6)',
          fontStyle: 'italic',
          fontWeight: 900,
        }}
      >
        <ScoreNumber motionValue={scoreNum} />
        <span>/10</span>
      </div>
    </motion.div>
  )
}

// Inline score component for hero and footer — takes actual layout space
export function ScoreInline({ value, className = '' }) {
  return (
    <div className={`select-none ${className}`}>
      <div
        className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] tracking-tight"
        style={{
          color: 'transparent',
          WebkitTextStroke: '2px rgba(200, 40, 40, 0.5)',
          fontStyle: 'italic',
          fontWeight: 900,
        }}
      >
        {value}<span>/10</span>
      </div>
    </div>
  )
}
