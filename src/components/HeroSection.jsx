import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035, delayChildren: 0.3 },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: 90, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    },
  },
}

function AnimatedText({ text, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`${className} perspective-[1000px]`}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.035, delayChildren: delay } },
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letterVariants}
          className="inline-block"
          style={{
            whiteSpace: char === ' ' ? 'pre' : undefined,
            transformOrigin: 'bottom center',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default function HeroSection() {
  const title = 'Jingwen Sun'
  const subtitle = 'Alexis'
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const titleScale = useTransform(scrollYProgress, [0, 0.65], [1, 0.9])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-[15%] w-px h-20 bg-gradient-to-b from-transparent via-electric/20 to-transparent float-slow" />
      <div className="absolute top-1/3 right-[20%] w-px h-16 bg-gradient-to-b from-transparent via-pink-glow/15 to-transparent float-medium" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-[25%] w-px h-12 bg-gradient-to-b from-transparent via-gold/15 to-transparent float-fast" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[20%] right-[10%] w-1.5 h-1.5 rounded-full bg-electric/30 float-medium" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[60%] left-[10%] w-1 h-1 rounded-full bg-pink-glow/20 float-slow" style={{ animationDelay: '2s' }} />

      <motion.div
        className="relative z-10 text-center"
        style={{ y: titleY, opacity: titleOpacity, scale: titleScale }}
      >
        {/* Name */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={title + subtitle}
        >
          <AnimatedText
            text={title}
            className="font-display text-[clamp(2.5rem,7vw,7rem)] leading-[1.05] tracking-[-0.02em] text-cream"
          />
          <AnimatedText
            text={subtitle}
            className="font-display text-[clamp(1.5rem,4vw,4rem)] leading-[1.2] tracking-[0.08em] text-cream/60 mt-2 italic"
            delay={0.45}
          />
        </motion.div>

        {/* Decorative lines */}
        <div className="relative mt-12 flex items-center justify-center gap-4">
          <motion.div
            className="h-px bg-gradient-to-l from-electric/50 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 1.4, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-electric/60"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
          />
          <motion.div
            className="h-px bg-gradient-to-r from-electric/50 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 1.4, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        <motion.p
          className="mt-8 text-cream/30 text-sm tracking-[0.4em] uppercase font-body"
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          Art &amp; Design Portfolio
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <span className="text-cream/25 text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
        <div className="scroll-indicator">
          <div className="w-px h-8 bg-gradient-to-b from-cream/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
