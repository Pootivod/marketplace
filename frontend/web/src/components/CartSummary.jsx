export default function CartSummary({ items }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="summary-card">
      <h3>Order summary</h3>
      <div className="summary-card__rows">
        {items.map((item) => (
          <div className="summary-row" key={item.id}>
            <span>{item.title} x {item.quantity}</span>
            <strong>${item.price * item.quantity}</strong>
          </div>
        ))}
      </div>
      <div className="summary-row summary-row--total">
        <span>Total</span>
        <strong>${total}</strong>
      </div>
    </div>
  )
}
