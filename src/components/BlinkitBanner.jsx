import './BlinkitBanner.css'

export default function BlinkitBanner() {
  return (
    <section className="blinkit-banner">
      <h2 className="blinkit-heading">&#9889; NOW ON BLINKIT!</h2>
      <p className="blinkit-desc">
        Get your favourite Bakeats cookies and rusks delivered in minutes. Order now on Blinkit!
      </p>
      <a
        href="https://blinkit.com/prn/x/prid/735252"
        className="btn blinkit-cta"
        target="_blank"
        rel="noreferrer"
      >
        Order on Blinkit
      </a>
    </section>
  )
}
