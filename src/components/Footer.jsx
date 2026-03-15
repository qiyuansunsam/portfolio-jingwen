import { motion } from 'framer-motion'
import { ScoreInline } from './ScrollScore'

const links = [
  { label: 'Email', href: 'mailto:ssssssjw@hotmail.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 py-24 pb-32 px-6 text-center">
      {/* Decorative top line */}
      <div className="max-w-[200px] mx-auto h-px bg-gradient-to-r from-transparent via-cream/15 to-transparent mb-12" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="flex flex-col items-center"
      >
        {/* Score — dedicated section at top of footer */}
        <div className="mb-10">
          <ScoreInline value="10" />
        </div>

        <p className="font-display text-3xl md:text-4xl text-cream/50 italic">
          Jingwen Sun
        </p>
        <p className="font-display text-lg text-cream/30 mt-1 tracking-[0.1em]">
          Alexis
        </p>

        {/* Contact links */}
        <div className="flex items-center justify-center gap-5 mt-10">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group relative w-11 h-11 rounded-full border border-cream/10 flex items-center justify-center text-cream/30 hover:text-cream/70 hover:border-cream/25 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="hover"
              title={link.label}
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={link.icon} />
              </svg>
            </motion.a>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-1 h-1 rounded-full bg-electric/40" />
          <p className="text-cream/20 text-xs tracking-[0.3em] font-body uppercase">
            2026
          </p>
          <div className="w-1 h-1 rounded-full bg-electric/40" />
        </div>
      </motion.div>

      <div className="mt-12 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-cream/10 to-transparent" />
    </footer>
  )
}
