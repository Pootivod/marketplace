import { useEffect, useMemo, useState } from 'react'
import { getUser, updateUser } from '../api/services'
import SectionTitle from '../components/SectionTitle'

const initialForm = {
  email: '',
  username: '',
  firstName: '',
  lastName: '',
}

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    getUser()
      .then((data) => {
        if (!active) return
        setUser(data)
        setForm({
          email: data.email || '',
          username: data.username || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
        })
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Failed to load profile.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const title = useMemo(() => {
    if (!user) return 'Profile'
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.email || 'Profile'
  }, [user])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email.trim()) {
      setError('Email is required.')
      return
    }

    setSaving(true)
    try {
      const updated = await updateUser({
        email: form.email.trim(),
        username: form.username.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      })
      setUser(updated)
      setForm({
        email: updated.email || '',
        username: updated.username || '',
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
      })
      setSuccess('Profile saved.')
    } catch (err) {
      setError(err.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error && !user) return <div className="info-card"><p className="form-error">{error}</p></div>

  return (
    <section>
      <SectionTitle title="Profile" subtitle="Profile data stored in users-api and linked to your Keycloak subject." />
      <div className="profile-card profile-card--column">
        <div>
          <h2>{title}</h2>
          <p className="text-muted">Subject: {user?.subject}</p>
        </div>

        <form className="admin-form profile-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </label>

          <label>
            Username
            <input
              type="text"
              value={form.username}
              onChange={(event) => updateField('username', event.target.value)}
            />
          </label>

          <div className="profile-form__row">
            <label>
              First name
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
              />
            </label>

            <label>
              Last name
              <input
                type="text"
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
              />
            </label>
          </div>

          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}

          <button className="button button--primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>
    </section>
  )
}
