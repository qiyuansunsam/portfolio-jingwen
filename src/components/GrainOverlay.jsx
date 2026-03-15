export default function GrainOverlay() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none opacity-[0.035] mix-blend-overlay">
      <svg width="100%" height="100%">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  )
}
