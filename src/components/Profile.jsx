import React from 'react'
import { auth } from '../firebase-config'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Profile({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      onLogout()
      navigate('/')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  return (
    <div>
      <h1>It's the Profile</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Profile
