import './VideoSection.css'

export default function VideoSection() {
  return (
    <section className="video-section">
      <div className="section-header">
        <h2>WATCH THE BAKEATS STORY</h2>
      </div>
      <div className="video-container">
        <iframe
          src="https://www.youtube.com/embed/02ACrF3vHas"
          title="The Bakeats Story"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="video-caption">
        From our ovens to your chai cup — meet the people behind Bakeats.
      </p>
    </section>
  )
}
