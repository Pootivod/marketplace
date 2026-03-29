import { Link, Navigate } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { initialized, isAuthenticated, register, error } = useAuth()

  if (initialized && isAuthenticated) {
    return <Navigate to="/profile" replace />
  }

  return (
    <section className="login-page">
      <SectionTitle
        title="Register"
        subtitle="Account creation is handled by Keycloak. Continue to the secure hosted registration page."
      />

      <div className="login-form">
        <p className="text-muted">
          Create your account in Keycloak. After successful registration the application will return to your profile page.
        </p>

        {error ? <p className="form-error">{error}</p> : null}

        <button
          className="button button--primary button--full"
          type="button"
          onClick={() => register(`${window.location.origin}/profile`)}
        >
          Continue to registration
        </button>

        <Link className="button button--secondary button--full" to="/login">
          Back to login
        </Link>
      </div>
    </section>
  )
}
