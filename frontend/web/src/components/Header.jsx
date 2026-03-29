import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { initialized, isAuthenticated, logout, account } = useAuth()

  const submitSearch = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      navigate('/catalog')
      return
    }
    navigate(`/catalog?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo">MarketPlace</Link>

        <nav className="header__nav">
          <NavLink to="/catalog" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Catalog
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Users admin
          </NavLink>
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

        <nav className="header__actions">
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Cart
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Favorites
          </NavLink>

          {!initialized ? (
            <span className="header__status">Authorizing...</span>
          ) : isAuthenticated ? (
            <>
              <button type="button" className="button button--secondary header__login" onClick={account}>
                Profile
              </button>
              <button type="button" className="button button--secondary header__logout" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="button button--secondary header__login">
                Register
              </Link>
              <Link to="/login" className="button button--primary header__login">
                Log in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
