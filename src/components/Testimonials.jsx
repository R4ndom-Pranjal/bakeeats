import './Testimonials.css'

const testimonials = [
  {
    name: 'Riya',
    role: 'Cookie Lover',
    quote: 'Great taste and premium quality cookies. Loved by our whole family.',
  },
  {
    name: 'Aman',
    role: 'Chai Enthusiast',
    quote: 'Packaging is super clean and cookies are always fresh. Best with evening chai.',
  },
  {
    name: 'Nikhil',
    role: 'Snack Connoisseur',
    quote: 'Bakeats has become my go-to snack with chai every evening. The jeera cookies are addictive!',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-header">
        <h2>WHAT PEOPLE SAY</h2>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((t) => (
          <div className="testimonial-card" key={t.name}>
            <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
            <div className="testimonial-name">{t.name}</div>
            <div className="testimonial-role">{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
