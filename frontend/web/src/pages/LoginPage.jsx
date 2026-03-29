import { Link, Navigate, useLocation } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const location = useLocation()
  const { initialized, isAuthenticated, login, error } = useAuth()

  const redirectTo = location.state?.from?.pathname || '/profile'

  if (initialized && isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <section className="login-page">
      <SectionTitle
        title="Log in"
        subtitle="Authentication is handled by Keycloak. Continue to the secure hosted login page."
      />

      <div className="login-form">
        <p className="text-muted">
          You will be redirected to Keycloak to enter your credentials. After successful login the application will return to your profile.
        </p>

        {error ? <p className="form-error">{error}</p> : null}

        <button
          className="button button--primary button--full"
          type="button"
          onClick={() => login(`${window.location.origin}${redirectTo}`)}
        >
          Continue with Keycloak
        </button>

        <Link className="button button--secondary button--full" to="/register">
          Go to registration
        </Link>
      </div>
    </section>
  )
}
