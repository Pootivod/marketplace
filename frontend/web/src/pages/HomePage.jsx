import SectionTitle from '../components/SectionTitle'
import { API_BASE_URL } from '../api/client'
import { getKeycloakConfig } from '../auth/keycloak'

export default function HomePage() {
  const keycloak = getKeycloakConfig()

  return (
    <section>
      <SectionTitle
        title="Home"
        subtitle="Frontend is configured to authenticate with Keycloak and send bearer tokens to the gateway."
      />

      <div className="info-card">
        <p><strong>API base:</strong> {API_BASE_URL}</p>
        <p><strong>Keycloak URL:</strong> {keycloak.url}</p>
        <p><strong>Realm:</strong> {keycloak.realm}</p>
        <p><strong>Client ID:</strong> {keycloak.clientId}</p>
      </div>
    </section>
  )
}
