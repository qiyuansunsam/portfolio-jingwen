import { useLenis } from './hooks/useLenis'

import HeroSection from './components/HeroSection'
import IntroVideo from './components/IntroVideo'
import VideoSection from './components/VideoSection'
import HorizontalGallery from './components/HorizontalGallery'
import Footer from './components/Footer'
import ParticleCanvas from './components/ParticleCanvas'
import GrainOverlay from './components/GrainOverlay'
import ScrollProgress from './components/ScrollProgress'
import MagneticCursor from './components/MagneticCursor'
import ScrollScore from './components/ScrollScore'

function App() {
  useLenis()

  return (
    <div className="bg-deep-blue min-h-screen text-cream font-body">
      <ParticleCanvas />

      <main className="relative z-10">
        <HeroSection />
        <IntroVideo />
        <VideoSection />
        <HorizontalGallery />
        <Footer />
      </main>

      <GrainOverlay />
      <ScrollProgress />
      <MagneticCursor />
      <ScrollScore />
    </div>
  )
}

export default App
