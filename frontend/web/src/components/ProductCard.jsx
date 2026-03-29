import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img className="product-card__image" src={product.image} alt={product.title} />
      <div className="product-card__body">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="product-card__footer">
          <strong>${product.price}</strong>
          <Link className="button button--secondary" to={`/product/${product.id}`}>Open</Link>
        </div>
      </div>
    </article>
  )
}
