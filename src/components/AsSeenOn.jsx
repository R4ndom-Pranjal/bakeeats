import './AsSeenOn.css'

const pressItems = [
  {
    name: 'ANI News',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769966414/Screenshot_2026-02-01_224935_z0lpfv.png',
  },
  {
    name: 'thePrint',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769966651/Screenshot_2026-02-01_225355_awepgs.png',
  },
  {
    name: 'Startuppedia',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769966552/Screenshot_2026-02-01_225152_ewydwt.png',
  },
  {
    name: 'News Track',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769967459/Screenshot_2026-02-01_230633_uxqidw.png',
  },
  {
    name: 'Lokmat Times',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769968454/Screenshot_2026-02-01_232341_ppbeg6.png',
  },
  {
    name: 'Startup Media',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1769969222/Screenshot_2026-02-01_233440_u48jae.png',
  },
]

export default function AsSeenOn() {
  return (
    <section className="as-seen-on">
      <div className="section-header">
        <h2>AS SEEN ON</h2>
      </div>

      <div className="press-scroll">
        {pressItems.map((item) => (
          <div className="press-card" key={item.name}>
            <div className="press-img-wrap">
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <span className="press-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
