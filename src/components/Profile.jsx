import React from 'react'
import { auth } from '../firebase-config'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";

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
    <div className='profile-container'>
      <div className="content">
      <h1>It's the Profile</h1>
      <button onClick={handleLogout}>Logout</button>
      <Link to={'/mainpage'}>
      <button>done</button>
      </Link>
      </div>
    </div>
  )
}

export default Profile
