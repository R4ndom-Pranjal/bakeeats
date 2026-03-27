import { useState } from 'react'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)

  const imageSrc = product.gifImage && hovered ? product.gifImage : product.image

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="product-img-wrapper"
        style={product.bgColor ? { backgroundColor: product.bgColor } : undefined}
      >
        <span className="ingredient-hug ing-1">{product.ingredients[0]}</span>
        <span className="ingredient-hug ing-2">{product.ingredients[1]}</span>
        <img
          src={imageSrc}
          alt={product.title}
        />
      </div>
      <div className="product-type">{product.type}</div>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-desc">{product.description}</p>
    </div>
  )
}
