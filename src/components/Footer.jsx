import { motion } from 'framer-motion'
import { ScoreInline } from './ScrollScore'

const links = [
  { label: 'Email', href: 'mailto:alexis@example.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Instagram', href: 'https://instagram.com/', icon: 'M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm3.5-5.5a1 1 0 110-2 1 1 0 010 2z' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 110-4 2 2 0 010 4z' },
  { label: 'Behance', href: 'https://behance.net/', icon: 'M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zM20.1 13c-.083-1.575-1.198-2.212-2.424-2.212-1.346 0-2.313.75-2.523 2.212H20.1zM9 12H5V7h4c1.657 0 3 .895 3 2.5S10.657 12 9 12zm0 2H5v5h4c1.933 0 3.5-1.119 3.5-2.5S10.933 14 9 14z' },
  { label: 'WeChat', href: '#', icon: 'M8.5 2C4.358 2 1 4.91 1 8.5c0 2.07 1.168 3.906 3 5.08V17l3.09-1.72c.455.097.932.22 1.41.22 4.142 0 7.5-2.91 7.5-6.5S12.642 2 8.5 2zm7 6c0-.276.06-.547.168-.8A5.99 5.99 0 0114 3.5c.552 0 1.087.07 1.6.195C18.613 4.6 21 7.05 21 10c0 1.82-.93 3.44-2.39 4.53L19 17l-2.5-1.39c-.387.09-.79.14-1.2.14-.17 0-.337-.02-.5-.03' },
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

        <p className="text-cream/15 text-xs tracking-[0.2em] font-body mt-10 max-w-md mx-auto leading-relaxed">
          Open to collaborations &amp; commissions
        </p>

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
