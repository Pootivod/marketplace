import Keycloak from 'keycloak-js'

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'marketplace',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'marketplace-web',
}

let keycloakInstance = null
let initPromise = null

export function getKeycloak() {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig)
  }
  return keycloakInstance
}

export function initKeycloak() {
  if (!initPromise) {
    initPromise = getKeycloak().init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
  }

  return initPromise
}

export function getKeycloakConfig() {
  return keycloakConfig
}
