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

        <div className="relative overflow-hidden rounded-2xl group">
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
              controls
              className="w-full h-full object-cover"
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,14,39,0.35) 100%)',
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
