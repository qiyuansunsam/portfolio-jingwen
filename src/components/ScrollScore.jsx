import { useState, useEffect } from 'react'
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

  // Score: 6 at hero → 7,8,9 in middle → 10 at footer
  const scoreNum = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.65, 0.85, 1.0],
    [6, 7, 8, 9, 9, 10]
  )

  // Position: center → bottom-right → center
  // x offset from center (percentage of viewport width)
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18, 0.82, 0.92, 1.0],
    [0, 0, 38, 38, 0, 0]
  )
  // y offset from center (percentage of viewport height)
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18, 0.82, 0.92, 1.0],
    [0, 0, 36, 36, 0, 0]
  )

  const x = useSpring(rawX, { stiffness: 80, damping: 20, mass: 0.8 })
  const y = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.8 })

  // Scale: bigger in center, smaller in corner
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18, 0.82, 0.92, 1.0],
    [1.2, 1.2, 0.7, 0.7, 1.3, 1.3]
  )
  const scale = useSpring(rawScale, { stiffness: 80, damping: 20 })

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.95, 1],
    [0.9, 0.85, 0.85, 1]
  )

  // Convert vw/vh percentages to pixel values
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  useMotionValueEvent(x, 'change', (xVal) => {
    setOffset((prev) => ({ ...prev, x: (xVal / 100) * window.innerWidth }))
  })
  useMotionValueEvent(y, 'change', (yVal) => {
    setOffset((prev) => ({ ...prev, y: (yVal / 100) * window.innerHeight }))
  })

  // Also recalc on resize
  useEffect(() => {
    const onResize = () => {
      setOffset({
        x: (x.get() / 100) * window.innerWidth,
        y: (y.get() / 100) * window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [x, y])

  return (
    <motion.div
      className="fixed z-50 select-none pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        x: offset.x,
        y: offset.y,
        translateX: '-50%',
        translateY: '-50%',
        scale,
        opacity,
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 14 }}
    >
      <div
        className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.8] tracking-tight"
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
