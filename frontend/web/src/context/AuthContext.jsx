import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getKeycloak, initKeycloak } from '../auth/keycloak'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    initialized: false,
    isAuthenticated: false,
    profile: null,
    token: null,
    error: '',
  })

  useEffect(() => {
    let active = true
    const keycloak = getKeycloak()

    const refreshState = async (authenticated) => {
      if (!active) return

      if (!authenticated) {
        setState({
          initialized: true,
          isAuthenticated: false,
          profile: null,
          token: null,
          error: '',
        })
        return
      }

      const profile = await keycloak.loadUserProfile().catch(() => null)
      if (!active) return

      setState({
        initialized: true,
        isAuthenticated: true,
        profile,
        token: keycloak.token || null,
        error: '',
      })
    }

    initKeycloak()
      .then(async (authenticated) => {
        keycloak.onAuthSuccess = async () => {
          await refreshState(true)
        }

        keycloak.onAuthLogout = async () => {
          await refreshState(false)
        }

        keycloak.onTokenExpired = async () => {
          try {
            await keycloak.updateToken(30)
            await refreshState(true)
          } catch (_) {
            await keycloak.login({ redirectUri: window.location.href })
          }
        }

        await refreshState(authenticated)
      })
      .catch((error) => {
        if (!active) return
        setState({
          initialized: true,
          isAuthenticated: false,
          profile: null,
          token: null,
          error: error?.message || 'Failed to initialize Keycloak.',
        })
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => {
    const keycloak = getKeycloak()

    return {
      ...state,
      async login(redirectUri = `${window.location.origin}/profile`) {
        await keycloak.login({ redirectUri })
      },
      async register(redirectUri = `${window.location.origin}/profile`) {
        await keycloak.register({ redirectUri })
      },
      async logout() {
        await keycloak.logout({ redirectUri: window.location.origin })
      },
      async account() {
        await keycloak.accountManagement()
      },
      async refreshToken() {
        if (!keycloak.authenticated) return null
        await keycloak.updateToken(30)
        return keycloak.token || null
      },
      keycloak,
    }
  }, [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return value
}
