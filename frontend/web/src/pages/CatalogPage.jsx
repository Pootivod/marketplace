import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getProducts } from '../api/services'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'

export default function CatalogPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    let active = true

    Promise.all([getCategories(), getProducts()])
      .then(([categoryList, productList]) => {
        if (!active) return
        setCategories(Array.isArray(categoryList) ? categoryList : [])
        setProducts(Array.isArray(productList) ? productList : [])
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Failed to load catalog.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const query = (searchParams.get('q') || '').trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesQuery = !query || item.title?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, products, query])

  return (
    <section>
      <SectionTitle title="Catalog" subtitle="Categories on the left and product cards in the center." />

      {error ? <div className="info-card"><p className="form-error">{error}</p></div> : null}

      <div className="catalog-layout">
        <aside className="sidebar">
          <button
            type="button"
            className={activeCategory === 'all' ? 'sidebar__item sidebar__item--active' : 'sidebar__item'}
            onClick={() => setActiveCategory('all')}
          >
            All products
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={activeCategory === category.id ? 'sidebar__item sidebar__item--active' : 'sidebar__item'}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </aside>

        <div className="catalog-content">
          {query ? <p className="catalog-query">Search result for: <strong>{query}</strong></p> : null}
          {loading ? <div className="info-card"><p>Loading catalog...</p></div> : null}
          {!loading && filteredProducts.length === 0 ? <div className="info-card"><p>No products found.</p></div> : null}
          <div className="grid grid--products">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
