import './Ingredients.css'

const ingredients = [
  {
    name: 'Premium Butter',
    img: '/ingredients/butter.png',
  },
  {
    name: 'Premium Almonds',
    img: '/ingredients/almond.png',
    position: '50% 62%',
  },
  {
    name: 'Rich Chocolate',
    img: '/ingredients/chocolate.png',
  },
  {
    name: 'Aromatic Cumin',
    img: '/ingredients/cumin.png',
    position: '50% 65%',
  },
  {
    name: 'Authentic Elaichi',
    img: '/ingredients/elaichi.png',
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
              <img
                src={item.img}
                alt={item.name}
                loading="lazy"
                style={item.position ? { objectPosition: item.position } : undefined}
              />
            </div>
            <span className="ingredient-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
