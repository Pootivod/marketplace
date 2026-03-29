import { useEffect, useMemo, useState } from 'react'
import { getCartItems, getProducts } from '../api/services'
import CartSummary from '../components/CartSummary'
import SectionTitle from '../components/SectionTitle'

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([getCartItems(), getProducts()])
      .then(([cart, goods]) => {
        if (!active) return
        setCartItems(Array.isArray(cart) ? cart : [])
        setProducts(Array.isArray(goods) ? goods : [])
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Failed to load checkout data.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
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
      <SectionTitle title="Checkout" subtitle="Short cart list, card fields and pay button." />
      {error ? <div className="info-card"><p className="form-error">{error}</p></div> : null}
      {loading ? <div className="info-card"><p>Loading checkout...</p></div> : null}

      <div className="checkout-layout">
        <CartSummary items={items} />

        <form className="checkout-form">
          <label>
            Cardholder name
            <input type="text" placeholder="John Doe" />
          </label>
          <label>
            Card number
            <input type="text" placeholder="4111 1111 1111 1111" />
          </label>
          <div className="checkout-form__row">
            <label>
              Expiry date
              <input type="text" placeholder="12/30" />
            </label>
            <label>
              CVV
              <input type="text" placeholder="123" />
            </label>
          </div>
          <label>
            Delivery address
            <input type="text" placeholder="Tel Aviv, Example street 10" />
          </label>
          <button type="button" className="button button--primary button--full">Pay</button>
        </form>
      </div>
    </section>
  )
}
