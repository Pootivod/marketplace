import { fetchWithFallback } from './client'
import { mockUser, mockProducts, mockCartItems, mockFavoriteIds, mockCategories } from '../data/mockData'

export function getUser() {
  return fetchWithFallback({
    path: '/api/users/me',
    fallbackData: mockUser,
  })
}

export function getProducts() {
  return fetchWithFallback({
    path: '/api/catalog/products',
    fallbackData: mockProducts,
  })
}

export function getProductById(id) {
  return fetchWithFallback({
    path: `/api/goods/${id}`,
    fallbackData: () => mockProducts.find((item) => String(item.id) === String(id)) || null,
  })
}

export function getCategories() {
  return fetchWithFallback({
    path: '/api/catalog/categories',
    fallbackData: mockCategories,
  })
}

export function getCartItems() {
  return fetchWithFallback({
    path: '/api/cart',
    fallbackData: mockCartItems,
  })
}

export function getFavorites() {
  return fetchWithFallback({
    path: '/api/favorite',
    fallbackData: mockFavoriteIds,
  })
}
