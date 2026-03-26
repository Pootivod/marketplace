import SectionTitle from '../components/SectionTitle'
import { DEBUG_FALLBACK, API_BASE_URL } from '../api/client'

export default function HomePage() {
  return (
    <section>
      <SectionTitle
        title="Home"
        subtitle="Temporary empty home page for the initial marketplace skeleton."
      />

      <div className="info-card">
        <p><strong>API base:</strong> {API_BASE_URL}</p>
        <p><strong>DEBUG fallback:</strong> {String(DEBUG_FALLBACK)}</p>
        <p>When backend API is unavailable, the app shows mock data if DEBUG fallback is enabled.</p>
      </div>
    </section>
  )
}
