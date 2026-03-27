import { useState } from 'react'
import './FAQ.css'

const faqs = [
  {
    q: 'What is the shelf life of Bakeats products?',
    a: 'Our cookies have a shelf life of 3 months and rusks last up to 6 months when stored in a cool, dry place.',
  },
  {
    q: 'Are all Bakeats products vegetarian?',
    a: 'Yes! 100% of our products are pure vegetarian. We use no eggs or animal-derived ingredients.',
  },
  {
    q: 'Do you ship across India?',
    a: 'Yes, we ship pan-India! Order via WhatsApp or find us on Blinkit for instant delivery in select cities.',
  },
  {
    q: 'Can I order in bulk for events?',
    a: 'Absolutely! We offer bulk orders and custom packaging for weddings, corporate events, and festivals. Contact us on WhatsApp.',
  },
  {
    q: 'What makes Bakeats different?',
    a: 'We use premium ingredients — no shortcuts. Premium butter, premium nuts, premium spices. Plus our quirky Indian flavors you won\'t find anywhere else.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  function toggle(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq">
      <div className="section-header">
        <h2>GOT QUESTIONS?</h2>
      </div>

      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              className={`faq-item${isOpen ? ' faq-item--active' : ''}`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span className="faq-icon">{isOpen ? '\u2212' : '+'}</span>
              </button>
              <div className={`faq-answer${isOpen ? ' faq-answer--open' : ''}`}>
                <p>{item.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
