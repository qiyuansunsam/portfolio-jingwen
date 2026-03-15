import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function VideoPlayer({ src, label }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleToggle = async () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        await videoRef.current.play()
        setIsPlaying(true)
      } catch {}
    }
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={handleToggle}
      data-cursor="text"
      data-cursor-text={isPlaying ? 'Pause' : 'Play'}
    >
      <div className="absolute inset-0 rounded-2xl border border-cream/[0.06] z-10 pointer-events-none" />
      <div className="absolute -inset-px rounded-2xl z-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.12), transparent 40%, transparent 60%, rgba(236,72,153,0.08))' }}
      />

      <div className="relative aspect-video bg-deep-blue rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          preload="auto"
          playsInline
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
        />

        <div className={`absolute inset-0 flex items-center justify-center bg-deep-blue/30 transition-opacity duration-500 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-cream/20 flex items-center justify-center group-hover:border-cream/35 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 md:w-7 md:h-7 text-cream/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 md:w-7 md:h-7 ml-1 text-cream/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,14,39,0.35) 100%)' }}
        />
      </div>

      {label && (
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-cream/30 text-[10px] tracking-[0.3em] uppercase font-body">{label}</span>
        </div>
      )}
    </motion.div>
  )
}

export default function VideoSection() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} className="relative z-10 py-24 md:py-36 px-6 md:px-12 lg:px-20" style={{ position: 'relative' }}>
      <motion.div
        className="max-w-5xl mx-auto space-y-8"
        style={{ scale, opacity }}
      >
        <VideoPlayer src="/video/4ab5a18a12ca9b5de8dc751443a3dfe9.mp4" label="" />
      </motion.div>
    </section>
  )
}
