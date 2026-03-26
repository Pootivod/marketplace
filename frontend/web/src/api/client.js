const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const DEBUG_FALLBACK = (import.meta.env.VITE_DEBUG_FALLBACK || 'true') === 'true'

export async function fetchWithFallback({ path, fallbackData, transform }) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return transform ? transform(data) : data
  } catch (error) {
    if (DEBUG_FALLBACK) {
      return typeof fallbackData === 'function' ? fallbackData() : fallbackData
    }
    throw error
  }
}

export { API_BASE_URL, DEBUG_FALLBACK }
