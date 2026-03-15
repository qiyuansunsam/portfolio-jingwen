import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const videos = [
  { src: 'https://pub-27af52cfbbc24f91a5999b01e87e3d97.r2.dev/vid1_web.mp4', poster: '/images/thumbnails/vid1.jpg' },
  { src: 'https://pub-27af52cfbbc24f91a5999b01e87e3d97.r2.dev/vid2_web.mp4', poster: '/images/thumbnails/vid2.jpg' },
]

export default function VideoSection() {
  const [active, setActive] = useState(0)
  const [playingIdx, setPlayingIdx] = useState(-1)
  const videoRefs = useRef([])

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= videos.length) return
    videoRefs.current.forEach((v) => { if (v) v.pause() })
    setPlayingIdx(-1)
    setActive(idx)
  }, [])

  const togglePlay = useCallback(async (idx) => {
    const vid = videoRefs.current[idx]
    if (!vid) return
    if (playingIdx === idx) {
      vid.pause()
      setPlayingIdx(-1)
    } else {
      videoRefs.current.forEach((v, i) => { if (v && i !== idx) v.pause() })
      try {
        await vid.play()
        setPlayingIdx(idx)
      } catch {}
    }
  }, [playingIdx])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(active + 1)
      if (e.key === 'ArrowLeft') goTo(active - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, goTo])

  // Total items including phantom edges: [phantom, ...videos, phantom]
  // We offset so that active video is always centered
  // Each card: focused = 55vw, unfocused = 20vw, gap = 1.5vw
  // Offset = -(active * (20 + 1.5)) to shift, then we center the focused one
  // Center formula: translate the track so item[active] center aligns with viewport center

  return (
    <section className="relative z-10 py-24 md:py-36 overflow-hidden">
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

        {/* Carousel track — all items laid out, track translates to center the active one */}
        <div className="w-full overflow-hidden">
          <motion.div
            className="flex items-center"
            style={{ gap: '1.5vw' }}
            // Each unfocused card = 20vw, focused = 55vw, gap = 1.5vw
            // Position of card i center = sum of widths of cards before it + half its own width + gaps
            // We want to translate so card[active]'s center = 0 (viewport center)
            // For simplicity, compute offset based on active index
            animate={{
              x: (() => {
                // Build positions: for each card, compute its center x relative to track start
                const focusW = 55 // vw
                const smallW = 20 // vw
                const gapW = 1.5 // vw
                let pos = 0
                const centers = []
                for (let i = 0; i < videos.length; i++) {
                  const w = i === active ? focusW : smallW
                  centers.push(pos + w / 2)
                  pos += w + gapW
                }
                const trackTotal = pos - gapW
                // We want centers[active] to be at 50vw (viewport center)
                // Track is rendered starting from its left edge
                // If track left = offset, then center of active card = offset + centers[active]
                // We want offset + centers[active] = 50 (in vw)
                // offset = 50 - centers[active]
                const offset = 50 - centers[active]
                return `${offset}vw`
              })(),
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 26, mass: 0.9 }}
          >
            {videos.map((video, i) => {
              const isFocused = i === active
              const isPlaying = playingIdx === i

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
                    else togglePlay(i)
                  }}
                  data-cursor="text"
                  data-cursor-text={isFocused ? (isPlaying ? 'Pause' : 'Play') : 'View'}
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
                      onEnded={() => setPlayingIdx(-1)}
                      className="w-full h-full object-cover"
                    />

                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                        isFocused
                          ? isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                          : 'opacity-0'
                      }`}
                      style={{ background: isFocused ? 'rgba(10,14,39,0.2)' : 'transparent' }}
                    >
                      {isFocused && (
                        <motion.div
                          className="w-14 h-14 md:w-18 md:h-18 rounded-full border border-cream/20 flex items-center justify-center"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          {isPlaying ? (
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-cream/70" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 md:w-6 md:h-6 ml-0.5 text-cream/70" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </motion.div>
                      )}
                    </div>

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
      <div className="flex justify-center gap-3 mt-10">
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
      </div>
    </section>
  )
}
