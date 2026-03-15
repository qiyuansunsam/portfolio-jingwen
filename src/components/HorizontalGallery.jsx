import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const artworks = [
  {
    src: '/images/favorability-board.jpg',
    title: 'Favorability',
    subtitle: 'Interactive Installation',
    description:
      'An interactive presentation board exploring the dynamics of favorability and character perception through playful infographics, neon signage, and immersive visual storytelling.',
    color: '#ec4899',
  },
  {
    src: '/images/bridges-candles.jpg',
    title: 'Rosalind',
    subtitle: 'Brand & Product Design',
    description:
      'I founded Rosalind, a brand centered on self-love and sensory connection. As someone with synesthesia, I naturally weave scents, colors, and memories into tangible experiences. I design and handcraft scented candles, each fragrance tied to distinct emotions and moments. "When you smell it, you know it is there" — scent becomes a quiet anchor of comfort and presence.',
    color: '#d4a853',
  },
]

const imageVariants = {
  enter: (dir) => ({ scale: 0, opacity: 0, rotate: dir > 0 ? 6 : -6 }),
  center: {
    scale: 1, opacity: 1, rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20, mass: 0.8 },
  },
  exit: (dir) => ({
    scale: 0, opacity: 0, rotate: dir > 0 ? -6 : 6,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
}

const textContainerVariants = {
  enter: {},
  center: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  exit: {},
}

const textChildVariants = {
  enter: { opacity: 0, y: 30, filter: 'blur(6px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.2 } },
}

export default function HorizontalGallery() {
  const glassBlur = 16
  const [[current, direction], setCurrent] = useState([0, 0])
  const [glitchActive, setGlitchActive] = useState(false)
  const [hoverGlow, setHoverGlow] = useState({ x: 50, y: 50 })
  const [locked, setLocked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const modalRef = useRef(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
      if (window.__lenis) window.__lenis.stop()
    } else {
      document.body.style.overflow = ''
      if (window.__lenis && lockedRef.current) window.__lenis.stop()
      else if (window.__lenis) window.__lenis.start()
    }
  }, [modalOpen])

  const sectionRef = useRef(null)
  const currentRef = useRef(0)
  const lockedRef = useRef(false)
  const cooldownRef = useRef(false)
  const hasExitedRef = useRef(false) // true after viewing all & scrolling past

  currentRef.current = current
  lockedRef.current = locked

  const work = artworks[current]

  const unlock = useCallback(() => {
    setLocked(false)
    lockedRef.current = false
    if (window.__lenis) window.__lenis.start()
  }, [])

  const lockToSection = useCallback(() => {
    const section = sectionRef.current
    if (!section || lockedRef.current) return
    setLocked(true)
    lockedRef.current = true
    if (window.__lenis) window.__lenis.stop()
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' })
  }, [])

  const paginate = useCallback((dir) => {
    if (cooldownRef.current) return
    const cur = currentRef.current
    const next = cur + dir

    // Past last → unlock forward
    if (next >= artworks.length) {
      hasExitedRef.current = true
      unlock()
      return
    }
    // Before first → unlock backward
    if (next < 0) {
      unlock()
      return
    }

    cooldownRef.current = true
    setGlitchActive(false)
    setModalOpen(false)
    setCurrent([next, dir])
    setTimeout(() => { cooldownRef.current = false }, 500)
  }, [unlock])

  // Glitch trigger
  useEffect(() => {
    const t = setTimeout(() => setGlitchActive(true), 600)
    return () => clearTimeout(t)
  }, [current])

  // Lock when section scrolls into view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || lockedRef.current) return

        const rect = section.getBoundingClientRect()

        // Only lock when section top is near viewport top (scrolling down into it)
        if (rect.top >= -20 && rect.top <= window.innerHeight * 0.2 && !hasExitedRef.current) {
          lockToSection()
        }
      },
      { threshold: [0.4, 0.6, 0.8] }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [lockToSection])

  // Wheel/touch/key capture while locked
  useEffect(() => {
    const onWheel = (e) => {
      if (!lockedRef.current) return
      e.preventDefault()
      e.stopPropagation()
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 15) return
      paginate(delta > 0 ? 1 : -1)
    }

    let touchY = 0, touchX = 0

    const onTouchStart = (e) => {
      if (!lockedRef.current) return
      touchY = e.touches[0].clientY
      touchX = e.touches[0].clientX
    }

    const onTouchMove = (e) => {
      if (!lockedRef.current) return
      if (cooldownRef.current) return
      const dy = touchY - e.touches[0].clientY
      const dx = touchX - e.touches[0].clientX
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy
      if (Math.abs(delta) < 50) return
      e.preventDefault()
      paginate(delta > 0 ? 1 : -1)
      touchY = e.touches[0].clientY
      touchX = e.touches[0].clientX
    }

    const onKeyDown = (e) => {
      if (!lockedRef.current) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); paginate(1) }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); paginate(-1) }
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true })
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [paginate])

  // Re-enable scroll lock if user scrolls back up into section from below
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let lastScrollY = window.scrollY

    const onScroll = () => {
      if (lockedRef.current) { lastScrollY = window.scrollY; return }

      const scrollingUp = window.scrollY < lastScrollY
      lastScrollY = window.scrollY

      if (!scrollingUp || !hasExitedRef.current) return

      const rect = section.getBoundingClientRect()
      // If section bottom is visible and we're scrolling up into it
      if (rect.bottom >= window.innerHeight * 0.8 && rect.top < 0 && rect.top > -rect.height * 0.5) {
        hasExitedRef.current = false
        setCurrent([artworks.length - 1, -1])
        lockToSection()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lockToSection])

  // Cleanup
  useEffect(() => {
    return () => { if (window.__lenis) window.__lenis.start() }
  }, [])

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -80) paginate(1)
    else if (info.offset.x > 80) paginate(-1)
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHoverGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ position: 'relative' }}
    >
      <div className="h-screen flex flex-col justify-center py-16 md:py-24">
        {/* Section label */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-cream/20 text-[10px] tracking-[0.5em] uppercase font-body">
            Selected Works
          </span>
        </motion.div>

        <div className="relative max-w-5xl mx-auto w-full px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
            {/* Left arrow */}
            <button
              onClick={() => paginate(-1)}
              disabled={current === 0}
              className={`hidden lg:flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 flex-shrink-0 ${
                current === 0
                  ? 'border-cream/5 text-cream/10 cursor-default'
                  : 'border-cream/15 text-cream/40 hover:border-cream/30 hover:text-cream/70'
              }`}
              data-cursor="hover"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image area */}
            <motion.div
              className="relative w-full lg:w-[50%] aspect-[4/3] overflow-hidden rounded-2xl flex-shrink-0 group"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
              onMouseMove={handleMouseMove}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              data-cursor="image"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 rounded-2xl"
                style={{ background: `radial-gradient(500px circle at ${hoverGlow.x}% ${hoverGlow.y}%, ${work.color}15 0%, transparent 60%)` }}
              />
              <div className="absolute inset-0 rounded-2xl border border-cream/[0.06] z-20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px z-20"
                style={{ background: `linear-gradient(90deg, transparent, ${work.color}44, transparent)` }}
              />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={current}
                  src={work.src}
                  alt={work.title}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  draggable={false}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                />
              </AnimatePresence>

              <div className="absolute inset-0 pointer-events-none z-10"
                style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,14,39,0.25) 100%)' }}
              />
            </motion.div>

            {/* Text — compact preview */}
            <div className="w-full lg:w-[42%] relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  variants={textContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative"
                >
                  <motion.span
                    className="text-[10px] tracking-[0.3em] uppercase mb-3 inline-block"
                    style={{ color: work.color }}
                    variants={textChildVariants}
                  >
                    {work.subtitle}
                  </motion.span>

                  <motion.h2
                    className={`glitch-text font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] mb-4 text-cream ${glitchActive ? 'active' : ''}`}
                    data-text={work.title}
                    variants={textChildVariants}
                  >
                    {work.title}
                  </motion.h2>

                  <motion.p
                    className="text-cream/40 text-sm leading-relaxed font-body line-clamp-3 mb-4"
                    variants={textChildVariants}
                  >
                    {work.description}
                  </motion.p>

                  <motion.button
                    className="text-xs tracking-[0.15em] uppercase font-body transition-colors duration-300 hover:text-cream/70"
                    style={{ color: work.color }}
                    variants={textChildVariants}
                    onClick={() => setModalOpen(true)}
                    data-cursor="hover"
                  >
                    Read more &rarr;
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => paginate(1)}
              disabled={current === artworks.length - 1}
              className={`hidden lg:flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 flex-shrink-0 ${
                current === artworks.length - 1
                  ? 'border-cream/5 text-cream/10 cursor-default'
                  : 'border-cream/15 text-cream/40 hover:border-cream/30 hover:text-cream/70'
              }`}
              data-cursor="hover"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile nav */}
          <div className="flex lg:hidden items-center justify-center gap-6 mt-8">
            <button onClick={() => paginate(-1)} disabled={current === 0}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${current === 0 ? 'border-cream/5 text-cream/10' : 'border-cream/15 text-cream/40 active:scale-90'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-2">
              {artworks.map((_, i) => (
                <button key={i} onClick={() => setCurrent([i, i > current ? 1 : -1])} className="p-1">
                  <div className="rounded-full transition-all duration-300"
                    style={{ width: i === current ? 24 : 6, height: 6, backgroundColor: i === current ? artworks[i].color : 'rgba(245,240,232,0.15)' }} />
                </button>
              ))}
            </div>
            <button onClick={() => paginate(1)} disabled={current === artworks.length - 1}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${current === artworks.length - 1 ? 'border-cream/5 text-cream/10' : 'border-cream/15 text-cream/40 active:scale-90'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Dots */}
          <div className="hidden lg:flex justify-center gap-3 mt-12">
            {artworks.map((_, i) => (
              <button key={i} onClick={() => setCurrent([i, i > current ? 1 : -1])} className="p-1" data-cursor="hover">
                <div className="rounded-full transition-all duration-500"
                  style={{ width: i === current ? 28 : 6, height: 6, backgroundColor: i === current ? artworks[i].color : 'rgba(245,240,232,0.12)' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-deep-blue/80 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              ref={modalRef}
              className="relative max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-cream/[0.08] p-8 md:p-12 scrollbar-autohide"
              onWheel={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(10, 14, 39, 0.95)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03)',
              }}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full border border-cream/10 flex items-center justify-center text-cream/40 hover:text-cream/70 hover:border-cream/25 transition-colors"
                onClick={() => setModalOpen(false)}
                data-cursor="hover"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <div className="rounded-xl overflow-hidden mb-8 aspect-[16/10]">
                <img
                  src={work.src}
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <span
                className="text-[10px] tracking-[0.3em] uppercase mb-3 inline-block"
                style={{ color: work.color }}
              >
                {work.subtitle}
              </span>

              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] mb-6 text-cream">
                {work.title}
              </h2>

              <div className="h-px w-16 mb-6" style={{ background: `linear-gradient(90deg, ${work.color}66, transparent)` }} />

              <p className="text-cream/50 text-sm md:text-base leading-relaxed font-body">
                {work.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
