import { getJson, postJson, putJson } from './client'

export function getUser() {
  return getJson('/api/v1/users/me')
}

export function updateUser(payload) {
  return putJson('/api/v1/users/me', payload)
}

export function getUsers() {
  return getJson('/api/v1/users')
}

export function createUser(payload) {
  return postJson('/api/v1/users', payload)
}

export function getProducts() {
  return getJson('/api/v1/catalog/products')
}

export function getProductById(id) {
  return getJson(`/api/v1/goods/${id}`)
}

export function getCategories() {
  return getJson('/api/v1/catalog/categories')
}

export function getCartItems() {
  return getJson('/api/v1/cart')
}

export function getFavorites() {
  return getJson('/api/v1/favorites')
}
