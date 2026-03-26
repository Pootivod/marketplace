import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCartItems, getProducts } from '../api/services'
import SectionTitle from '../components/SectionTitle'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    Promise.all([getCartItems(), getProducts()]).then(([cart, goods]) => {
      setCartItems(cart)
      setProducts(goods)
    })
  }, [])

  const items = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((productItem) => productItem.id === item.productId)
        return product ? { ...product, quantity: item.quantity } : null
      })
      .filter(Boolean)
  }, [cartItems, products])

  return (
    <section>
      <SectionTitle title="Cart" subtitle="List of products, quantities and order action." />

      <div className="stack">
        {items.map((item) => (
          <div className="list-card" key={item.id}>
            <img className="list-card__image" src={item.image} alt={item.title} />
            <div className="list-card__content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <div className="list-card__side">
              <span>Qty: {item.quantity}</span>
              <strong>${item.price * item.quantity}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="actions-row">
        <Link className="button button--primary" to="/checkout">Proceed to checkout</Link>
      </div>
    </section>
  )
}
