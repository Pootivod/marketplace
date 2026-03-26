import { useEffect, useMemo, useState } from 'react'
import { getCartItems, getProducts } from '../api/services'
import CartSummary from '../components/CartSummary'
import SectionTitle from '../components/SectionTitle'

export default function CheckoutPage() {
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
      <SectionTitle title="Checkout" subtitle="Short cart list, card fields and pay button." />

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
