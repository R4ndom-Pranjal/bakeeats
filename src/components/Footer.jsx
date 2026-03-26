import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <img
        src="https://res.cloudinary.com/ddtifclgr/image/upload/v1770035808/logo.5586e616d663e63711b3-Photoroom_ksprww.png"
        alt="Bakeats"
        className="footer-logo-img"
      />
      <div className="footer-links">
        <a href="#products">Products</a>
        <a href="#story">About</a>
        <a href="https://bakeats-blond.vercel.app/media" target="_blank" rel="noreferrer">Media</a>
        <a href="https://bakeats-blond.vercel.app/export" target="_blank" rel="noreferrer">Export</a>
      </div>
      <div className="footer-text">Proudly Made in Noida, India</div>
      <a href="https://wa.me/919266565336" className="btn btn-footer" target="_blank" rel="noreferrer">Find a Distributor</a>
    </footer>
  )
}
