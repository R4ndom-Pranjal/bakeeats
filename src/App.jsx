import { CartProvider } from './context/CartContext'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Stats from './components/Stats'
import Products from './components/Products'
import Ingredients from './components/Ingredients'
import BlinkitBanner from './components/BlinkitBanner'
import Testimonials from './components/Testimonials'
import AsSeenOn from './components/AsSeenOn'
import VideoSection from './components/VideoSection'
import Story from './components/Story'
import ExportBanner from './components/ExportBanner'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import BackToTop from './components/BackToTop'
import CartDrawer from './components/CartDrawer'
import PageLoader from './components/PageLoader'

export default function App() {
  return (
    <CartProvider>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Products />
      <Ingredients />
      <BlinkitBanner />
      <Testimonials />
      <AsSeenOn />
      <VideoSection />
      <Story />
      <ExportBanner />
      <FAQ />
      <Footer />
      <WhatsAppFab />
      <BackToTop />
      <CartDrawer />
      <PageLoader />
    </CartProvider>
  )
}
