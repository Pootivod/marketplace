import { useEffect, useMemo, useState } from 'react'
import { getFavorites, getProducts } from '../api/services'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([getFavorites(), getProducts()])
      .then(([favorites, goods]) => {
        if (!active) return
        setFavoriteIds(Array.isArray(favorites) ? favorites : [])
        setProducts(Array.isArray(goods) ? goods : [])
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Failed to load favorites.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const favoriteProducts = useMemo(
    () => products.filter((item) => favoriteIds.includes(item.id)),
    [favoriteIds, products],
  )

  return (
    <section>
      <SectionTitle title="Favorites" subtitle="Saved products of the current user." />
      {error ? <div className="info-card"><p className="form-error">{error}</p></div> : null}
      {loading ? <div className="info-card"><p>Loading favorites...</p></div> : null}
      {!loading && favoriteProducts.length === 0 ? <div className="info-card"><p>No favorite products found.</p></div> : null}
      <div className="grid grid--products">
        {favoriteProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  )
}
