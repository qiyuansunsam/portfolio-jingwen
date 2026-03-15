import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const videos = [
  { src: 'https://pub-27af52cfbbc24f91a5999b01e87e3d97.r2.dev/vid1_web.mp4', poster: '/images/thumbnails/vid2.jpg' },
  { src: 'https://pub-27af52cfbbc24f91a5999b01e87e3d97.r2.dev/vid2_web.mp4', poster: '/images/thumbnails/vid1.jpg' },
]

export default function VideoSection() {
  const [[active, direction], setActive] = useState([0, 0])
  const [playingIdx, setPlayingIdx] = useState(-1)
  const videoRefs = useRef([])
  const sectionRef = useRef(null)

  const slideCount = videos.length
  const sectionHeight = `${slideCount * 100}vh`

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Map scroll progress to active video
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const rawIndex = Math.floor(progress * slideCount)
    const index = Math.min(rawIndex, slideCount - 1)
    if (index !== active) {
      // Pause all videos when switching
      videoRefs.current.forEach((v) => { if (v) v.pause() })
      setPlayingIdx(-1)
      const dir = index > active ? 1 : -1
      setActive([index, dir])
    }
  })

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= videos.length) return
    const section = sectionRef.current
    if (!section) return
    videoRefs.current.forEach((v) => { if (v) v.pause() })
    setPlayingIdx(-1)
    // Scroll to the position for this slide
    const sectionTop = section.offsetTop
    const sectionScrollHeight = section.scrollHeight - window.innerHeight
    const targetScroll = sectionTop + (idx / slideCount) * sectionScrollHeight
    if (window.__lenis) {
      window.__lenis.scrollTo(targetScroll, { duration: 1.2 })
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }, [slideCount, active])

  const progressOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} className="relative z-10" style={{ height: sectionHeight }}>
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center py-24 md:py-36 overflow-hidden">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-cream/20 text-[10px] tracking-[0.5em] uppercase font-body">
            Video Works
          </span>
        </motion.div>

        <div className="relative flex items-center justify-center">
          {/* Left arrow */}
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className={`absolute left-4 md:left-8 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
              active === 0
                ? 'border-cream/5 text-cream/10 cursor-default'
                : 'border-cream/15 text-cream/40 hover:border-cream/30 hover:text-cream/70'
            }`}
            data-cursor="hover"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => goTo(active + 1)}
            disabled={active === videos.length - 1}
            className={`absolute right-4 md:right-8 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
              active === videos.length - 1
                ? 'border-cream/5 text-cream/10 cursor-default'
                : 'border-cream/15 text-cream/40 hover:border-cream/30 hover:text-cream/70'
            }`}
            data-cursor="hover"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel track */}
          <div className="w-full overflow-hidden">
            <motion.div
              className="flex items-center"
              style={{ gap: '1.5vw' }}
              animate={{
                x: (() => {
                  const focusW = 55
                  const smallW = 20
                  const gapW = 1.5
                  let pos = 0
                  const centers = []
                  for (let i = 0; i < videos.length; i++) {
                    const w = i === active ? focusW : smallW
                    centers.push(pos + w / 2)
                    pos += w + gapW
                  }
                  const offset = 50 - centers[active]
                  return `${offset}vw`
                })(),
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 26, mass: 0.9 }}
            >
              {videos.map((video, i) => {
                const isFocused = i === active

                return (
                  <motion.div
                    key={i}
                    className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
                    animate={{
                      width: isFocused ? '55vw' : '20vw',
                      opacity: isFocused ? 1 : 0.45,
                    }}
                    transition={{ type: 'spring', stiffness: 180, damping: 26, mass: 0.9 }}
                    onClick={() => {
                      if (!isFocused) goTo(i)
                    }}
                    data-cursor={!isFocused ? 'text' : undefined}
                    data-cursor-text={!isFocused ? 'View' : undefined}
                    style={{ willChange: 'width, opacity' }}
                  >
                    <div className="absolute inset-0 rounded-2xl border border-cream/[0.06] z-10 pointer-events-none" />

                    <AnimatePresence>
                      {isFocused && (
                        <motion.div
                          className="absolute -inset-px rounded-2xl z-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(79,70,229,0.15), transparent 40%, transparent 60%, rgba(236,72,153,0.1))',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative aspect-video bg-deep-blue rounded-2xl overflow-hidden">
                      <video
                        ref={(el) => { videoRefs.current[i] = el }}
                        src={video.src}
                        poster={video.poster}
                        preload="auto"
                        playsInline
                        controls
                        onEnded={() => setPlayingIdx(-1)}
                        className="w-full h-full object-cover"
                      />

                      {!isFocused && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: 'rgba(10,14,39,0.3)' }}
                        />
                      )}

                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,14,39,0.35) 100%)',
                        }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Dots */}
        <motion.div
          className="flex justify-center gap-3 mt-10"
          style={{ opacity: progressOpacity }}
        >
          {videos.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="p-1" data-cursor="hover">
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 28 : 6,
                  height: 6,
                  backgroundColor: i === active ? 'rgba(79,70,229,0.7)' : 'rgba(245,240,232,0.12)',
                }}
              />
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
