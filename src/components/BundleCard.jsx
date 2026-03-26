import { useCart } from '../context/CartContext'
import './BundleCard.css'

export default function BundleCard({ bundle }) {
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem({
      title: bundle.name,
      type: bundle.type,
      image: bundle.images[0],
      description: bundle.items.join(', '),
      price: bundle.price,
    })
  }

  return (
    <div className="bundle-card">
      <div className="bundle-images">
        {bundle.images.map((img, i) => (
          <div key={i} className="bundle-img-circle" style={{ zIndex: bundle.images.length - i }}>
            <img src={img} alt={bundle.items[i]} />
          </div>
        ))}
      </div>

      <div className="bundle-type">{bundle.type}</div>
      <h3 className="bundle-name">{bundle.name}</h3>

      <div className="bundle-items-list">
        {bundle.items.map((item) => (
          <span key={item} className="bundle-chip">{item}</span>
        ))}
      </div>

      <div className="bundle-weight">{bundle.weight}</div>

      <div className="bundle-footer">
        {bundle.price ? (
          <div className="bundle-price">
            <span className="bundle-mrp-label">MRP</span>
            <span className="bundle-mrp">&#8377;{bundle.price}</span>
          </div>
        ) : (
          <div className="bundle-price">
            <span className="bundle-mrp-label">Enquire</span>
          </div>
        )}
        <button className="bundle-add-btn" onClick={handleAdd}>
          Add to Cart
          <span>+</span>
        </button>
      </div>
    </div>
  )
}
