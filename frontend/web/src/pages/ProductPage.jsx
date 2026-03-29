import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../api/services'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getProductById(id)
      .then((data) => {
        if (active) setProduct(data)
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Failed to load product.')
        setProduct(null)
      })

    return () => {
      active = false
    }
  }, [id])

  if (product === undefined) return <div>Loading...</div>
  if (error) return <div className="info-card"><p className="form-error">{error}</p></div>
  if (product === null) return <div>Product not found.</div>

  return (
    <section className="product-page">
      <img className="product-page__image" src={product.image} alt={product.title} />
      <div className="product-page__content">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <strong className="product-page__price">${product.price}</strong>
        <div className="product-page__actions">
          <button className="button button--primary">Add to cart</button>
          <button className="button button--secondary">Add to favorites</button>
        </div>
      </div>
    </section>
  )
}
