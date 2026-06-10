import './AsSeenOn.css'

const pressItems = [
  {
    name: 'thePrint',
    img: '/press/theprint-news.png',
    url: 'https://www.aninews.in/news/business/actress-madhurima-tuli-unveils-new-brand-bakeats-in-noida-launches-variety-of-cookies-amp-rusks-promising-a-taste-mein-a-experience-with-every-bite20250616122912/',
  },
  {
    name: 'ANI News',
    img: '/press/ani-news.png',
    url: 'https://www.aninews.in/news/business/bakeats-brand-turns-baaraati-gifts-83771-lakh-worth-cookies-at-designers-wedding20251201143313/',
  },
  {
    name: 'Startuppedia',
    img: '/press/startupedia-news.png',
    url: 'https://startuppedia.in/trending/trending/raised-in-humble-family-noida-founder-built-a-35-cr-logistics-business-now-eyes-400-cr-in-3-years-with-his-bakery-venture-bakeats-9489152',
  },
  {
    name: 'Lokmat Times',
    img: '/press/lokmattimes-news.png',
    url: 'https://www.lokmattimes.com/business/bakeats-brand-turns-baaraati-gifts-rs1-lakh-worth-cookies-at-designers-wedding/',
  },
]

function PressCard({ item }) {
  const className = `press-card${item.url ? '' : ' press-card--nolink'}`
  const content = (
    <>
      <div className="press-img-wrap">
        <img src={item.img} alt={item.name} loading="lazy" />
      </div>
      <span className="press-name">{item.name}</span>
    </>
  )
  if (item.url) {
    return (
      <a className={className} href={item.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return <div className={className}>{content}</div>
}

export default function AsSeenOn() {
  return (
    <section className="as-seen-on" id="as-seen-on">
      <div className="section-header">
        <h2>AS SEEN ON</h2>
      </div>

      <div className="press-scroll">
        <div className="press-track">
          {pressItems.map((item) => (
            <PressCard item={item} key={item.name} />
          ))}
          {pressItems.map((item) => (
            <PressCard item={item} key={item.name + '-dup'} />
          ))}
        </div>
      </div>
    </section>
  )
}
