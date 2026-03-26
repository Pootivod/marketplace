import { useEffect, useMemo, useState } from 'react'
import { getFavorites, getProducts } from '../api/services'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    Promise.all([getFavorites(), getProducts()]).then(([favorites, goods]) => {
      setFavoriteIds(favorites)
      setProducts(goods)
    })
  }, [])

  const favoriteProducts = useMemo(
    () => products.filter((item) => favoriteIds.includes(item.id)),
    [favoriteIds, products],
  )

  return (
    <section>
      <SectionTitle title="Favorites" subtitle="Saved products of the current user." />
      <div className="grid grid--products">
        {favoriteProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  )
}
