import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getProducts } from '../api/services'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'

export default function CatalogPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    Promise.all([getCategories(), getProducts()]).then(([categoryList, productList]) => {
      setCategories(categoryList)
      setProducts(productList)
    })
  }, [])

  const query = (searchParams.get('q') || '').trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesQuery = !query || item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, products, query])

  return (
    <section>
      <SectionTitle title="Catalog" subtitle="Categories on the left and product cards in the center." />

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
