import './Ingredients.css'

const ingredients = [
  {
    name: 'Pure Butter',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770739279/stock-photo-butter-curls-Photoroom_klkwdt.png',
  },
  {
    name: 'Whole Wheat',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770722962/ripe-wheat-15736603-Photoroom_upfwqg.png',
  },
  {
    name: 'Premium Almonds',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770737939/organic-almond-nut-isolated-white-background_299651-2983-Photoroom_pll7hs.png',
  },
  {
    name: 'Fresh Coconut',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770718735/shutterstock_424228717-1-Photoroom_ajbayl.png',
  },
  {
    name: 'Rich Chocolate',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770817558/milk-chocolate-bar-isolated-on-white-background-dessert-free-photo-Photoroom_xnavwt.png',
  },
  {
    name: 'Aromatic Cumin',
    img: 'https://res.cloudinary.com/ddtifclgr/image/upload/v1770716655/zeera-img2-Photoroom_empg35.png',
  },
]

export default function Ingredients() {
  return (
    <section className="ingredients">
      <div className="section-header">
        <h2>REAL INGREDIENTS, REAL TASTE</h2>
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
