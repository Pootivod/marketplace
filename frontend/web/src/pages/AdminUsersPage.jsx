import { useEffect, useState } from 'react'
import { createUser, getUsers } from '../api/services'
import SectionTitle from '../components/SectionTitle'

const initialForm = {
  name: '',
  email: '',
  role: 'USER',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getUsers()
      .then((data) => {
        if (!active) return
        setUsers(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Failed to load users.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()

    if (!trimmedName || !trimmedEmail) {
      setError('Fill in name and email.')
      return
    }

    setIsSubmitting(true)

    try {
      const createdUser = await createUser({
        name: trimmedName,
        email: trimmedEmail,
        role: form.role,
      })

      setUsers((current) => [createdUser, ...current])
      setForm(initialForm)
    } catch (err) {
      setError(err.message || 'Failed to create user.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <SectionTitle
        title="Users admin"
        subtitle="This page sends create and list requests to users-api through the gateway."
      />

      <div className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Create user</h2>

          <label>
            Name
            <input
              type="text"
              placeholder="John Smith"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => updateField('role', event.target.value)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="button button--primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create user'}
          </button>
        </form>

        <div className="stack">
          {loading ? <div className="info-card"><p>Loading users...</p></div> : null}
          {!loading && users.length === 0 ? (
            <div className="info-card"><p>No users returned by users-api.</p></div>
          ) : null}
          {users.map((user) => (
            <article key={user.id || user.subject || user.email} className="user-row-card">
              <div>
                <h3>{user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'User'}</h3>
                <p>{user.email}</p>
              </div>
              <span className="role-badge">{user.role || 'USER'}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
