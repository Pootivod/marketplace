import { getKeycloak } from '../auth/keycloak'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function buildHeaders(customHeaders = {}) {
  const headers = { ...customHeaders }
  const keycloak = getKeycloak()

  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30)
    } catch (_) {
      // request will proceed with current token state
    }
  }

  if (keycloak.token) {
    headers.Authorization = `Bearer ${keycloak.token}`
  }

  return headers
}

async function readBody(response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

async function request(path, { method = 'GET', payload, headers = {} } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: await buildHeaders({
      ...(payload ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    }),
    body: payload ? JSON.stringify(payload) : undefined,
  })

  const body = await readBody(response)

  if (!response.ok) {
    const message = typeof body === 'string'
      ? body
      : body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(message)
  }

  return body
}

export function getJson(path) {
  return request(path)
}

export function postJson(path, payload) {
  return request(path, { method: 'POST', payload })
}

export function putJson(path, payload) {
  return request(path, { method: 'PUT', payload })
}

export { API_BASE_URL }
