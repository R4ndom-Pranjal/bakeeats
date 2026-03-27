import './ExportBanner.css'

export default function ExportBanner() {
  return (
    <section className="export-banner" id="export">
      <div className="export-grid">
        <div className="export-text">
          <span className="export-tag">GLOBAL REACH</span>
          <h2 className="export-heading">SHIP WORLDWIDE</h2>
          <p className="export-desc">
            Bakeats cookies and rusks are now available for international export.
            Partner with us to bring India's finest bakery to your market.
          </p>
          <div className="export-buttons">
            <a
              href="https://wa.me/919266565336?text=Hi!%20I'm%20interested%20in%20distributing%20Bakeats%20products."
              className="btn export-btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Become a Distributor
            </a>
            <a
              href="https://wa.me/919266565336?text=Hi!%20I'd%20like%20to%20know%20more%20about%20Bakeats%20export%20opportunities."
              className="btn export-btn-outline"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="export-visual">
          <span className="export-globe">🌍</span>
          <span className="export-float export-float-1">🍪</span>
          <span className="export-float export-float-2">🍪</span>
          <span className="export-float export-float-3">🍪</span>
        </div>
      </div>
    </section>
  )
}
