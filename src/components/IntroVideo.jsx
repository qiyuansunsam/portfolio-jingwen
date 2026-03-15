import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function IntroVideo() {
  const videoRef = useRef(null)
  const sectionRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

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
    <section ref={sectionRef} className="relative z-10 py-20 md:py-32 px-6 md:px-12 lg:px-20">
      <motion.div className="max-w-6xl mx-auto" style={{ scale, opacity }}>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-cream/20 text-[10px] tracking-[0.5em] uppercase font-body">
            Showreel
          </span>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-2xl cursor-pointer group"
          onClick={handleToggle}
          data-cursor="text"
          data-cursor-text={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="absolute inset-0 rounded-2xl border border-cream/[0.06] z-10 pointer-events-none" />
          <div
            className="absolute -inset-px rounded-2xl z-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(79,70,229,0.12), transparent 40%, transparent 60%, rgba(236,72,153,0.08))',
            }}
          />

          <div className="relative aspect-video bg-deep-blue rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              src="https://pub-27af52cfbbc24f91a5999b01e87e3d97.r2.dev/intro.mp4"
              poster="/images/thumbnails/intro.jpg"
              preload="auto"
              playsInline
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            <div
              className={`absolute inset-0 flex items-center justify-center bg-deep-blue/30 transition-opacity duration-500 ${
                isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
              }`}
            >
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-cream/20 flex items-center justify-center group-hover:border-cream/35 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-cream/70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 md:w-8 md:h-8 ml-1 text-cream/70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.div>
            </div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,14,39,0.35) 100%)',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
