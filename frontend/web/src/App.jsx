function App() {
  const services = [
    'users-api',
    'goods-api',
    'catalog-api',
    'search-api',
    'order-api',
    'favorite-api',
    'cart-api',
  ]

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '32px' }}>
      <h1>Marketplace</h1>
      <p>Frontend template for marketplace microservices.</p>
      <ul>
        {services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
