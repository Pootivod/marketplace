import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const submitSearch = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      navigate('/catalog')
      return
    }
    navigate(`/catalog?q=${encodeURIComponent(trimmed)}`)
  }

  const navItems = useMemo(
    () => [
      { to: '/catalog', label: 'Catalog' },
      { to: '/profile', label: 'Profile' },
      { to: '/cart', label: 'Cart' },
      { to: '/favorites', label: 'Favorites' },
    ],
    [],
  )

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo">MarketPlace</Link>

        <nav className="header__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form className="search-form" onSubmit={submitSearch}>
          <input
            className="search-form__input"
            type="text"
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="button button--primary" type="submit">Search</button>
        </form>
      </div>
    </header>
  )
}
