import './Ingredients.css'

const ingredients = [
  {
    name: 'Premium Butter',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770739279/stock-photo-butter-curls-Photoroom_klkwdt.png',
  },
  {
    name: 'Premium Almonds',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770737939/organic-almond-nut-isolated-white-background_299651-2983-Photoroom_pll7hs.png',
  },
  {
    name: 'Rich Chocolate',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770817558/milk-chocolate-bar-isolated-on-white-background-dessert-free-photo-Photoroom_xnavwt.png',
  },
  {
    name: 'Aromatic Cumin',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770716655/zeera-img2-Photoroom_empg35.png',
  },
  {
    name: 'Authentic Elaichi',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770813844/elachi.e857599bde6db2425f0d-Photoroom_h8jfn6.png',
  },
]

export default function Ingredients() {
  return (
    <section className="ingredients">
      <div className="section-header">
        <h2>FINEST INGREDIENTS, A++ TASTE</h2>
      </div>

      <div className="ingredients-grid">
        {ingredients.map((item) => (
          <div className="ingredient-card" key={item.name}>
            <div className="ingredient-circle">
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <span className="ingredient-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
