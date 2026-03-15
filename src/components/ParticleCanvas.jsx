import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 80
const COLORS = [
  'rgba(245,240,232,0.3)',
  'rgba(79,70,229,0.4)',
  'rgba(236,72,153,0.25)',
  'rgba(212,168,83,0.2)',
]

// Draw connections between nearby particles
const CONNECTION_DIST = 100
const CONNECTION_COLOR = 'rgba(79,70,229,0.06)'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let lastTime = 0
    const frameInterval = 1000 / 30

    const scale = 0.5 // Half resolution

    const resize = () => {
      canvas.width = window.innerWidth * scale
      canvas.height = window.innerHeight * scale
      canvas.style.width = '100%'
      canvas.style.height = '100%'
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouse = (e) => {
      mouseRef.current = {
        x: e.clientX * scale,
        y: e.clientY * scale,
      }
    }
    window.addEventListener('mousemove', handleMouse)

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth * scale,
      y: Math.random() * window.innerHeight * scale,
      radius: Math.random() * 2 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.3 - 0.05,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
      // Pulse
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }))

    function animate(time) {
      animId = requestAnimationFrame(animate)
      if (time - lastTime < frameInterval) return
      lastTime = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mouse = mouseRef.current

      // Update and draw particles
      for (const p of particles) {
        p.phase += p.speed
        p.pulsePhase += p.pulseSpeed
        p.x += p.vx + Math.sin(p.phase) * 0.25
        p.y += p.vy

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 80) {
          const force = (80 - dist) / 80
          p.x += (dx / dist) * force * 2.5
          p.y += (dy / dist) * force * 2.5
        }

        // Wrap
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        // Pulsing radius
        const r = p.radius * (1 + Math.sin(p.pulsePhase) * 0.3)

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = CONNECTION_COLOR
            ctx.globalAlpha = 1 - dist / CONNECTION_DIST
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
