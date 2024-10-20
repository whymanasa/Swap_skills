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
      <h1>Profile</h1>
      <label>name</label>
      <input type='text' placeholder='enter your name'></input>
      <input type='message' placeholder='about yourself'></input>
      <input type='text' placeholder='enter your skill'></input>
      <button onClick={handleLogout}>Logout</button>
      <Link to={'/mainpage'}>
      <button>done</button>
      </Link>
      </div>
    </div>
  )
}

export default Profile
