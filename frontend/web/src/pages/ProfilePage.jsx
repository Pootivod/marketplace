import { useEffect, useState } from 'react'
import { getUser } from '../api/services'
import SectionTitle from '../components/SectionTitle'

export default function ProfilePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser().then(setUser)
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <section>
      <SectionTitle title="Profile" subtitle="User avatar, name and email." />
      <div className="profile-card">
        <img className="profile-card__avatar" src={user.avatar} alt={user.name} />
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>
    </section>
  )
}
