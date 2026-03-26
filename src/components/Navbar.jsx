import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import DarkModeToggle from './DarkModeToggle'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems, setCartOpen } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo-link">
          <img
            src="https://res.cloudinary.com/ddtifclgr/image/upload/v1770035808/logo.5586e616d663e63711b3-Photoroom_ksprww.png"
            alt="Bakeats"
            className="nav-logo-img"
          />
        </a>
        <div className="nav-links">
          <a href="#products">Shop The Range</a>
          <a href="#products">Our Babies</a>
          <a href="#story">Kahani</a>
          <a href="https://blinkit.com/prn/x/prid/735252" target="_blank" rel="noreferrer">Blinkit</a>
          <a href="#footer">Find Us</a>
        </div>
        <div className="nav-right">
          <DarkModeToggle />
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <a href="https://wa.me/919266565336" className="btn nav-cta" target="_blank" rel="noreferrer">
            Order on WhatsApp
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <a href="#products" onClick={closeMenu}>Shop The Range</a>
          <a href="#products" onClick={closeMenu}>Our Babies</a>
          <a href="#story" onClick={closeMenu}>Kahani</a>
          <a href="https://blinkit.com/prn/x/prid/735252" target="_blank" rel="noreferrer" onClick={closeMenu}>Blinkit</a>
          <a href="#footer" onClick={closeMenu}>Find Us</a>
          <button className="cart-btn mobile-cart-btn" onClick={() => { setCartOpen(true); closeMenu() }} aria-label="Open cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <span className="mobile-cart-label">Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <a href="https://wa.me/919266565336" className="btn mobile-cta" target="_blank" rel="noreferrer" onClick={closeMenu}>
            Order on WhatsApp
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
