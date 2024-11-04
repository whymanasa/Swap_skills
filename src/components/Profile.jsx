import React, { useState, useEffect, useCallback } from 'react'
import { auth } from '../../firebase-config'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { db } from '../../firebase-config'; // Import Firestore
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import the tick and delete icons from react-icons
import "../styles/Profile.css";

function Profile({ onLogout }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [skill, setSkill] = useState('')
  const [skillsList, setSkillsList] = useState([]) // State to hold skills
  const [loading, setLoading] = useState(false) // Loading state

  const handleLogout = async () => {
    try {
      await signOut(auth)
      onLogout()
      navigate('/')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  const fetchUserData = useCallback(async () => {
    setLoading(true)
    const userDoc = doc(db, 'profile', auth.currentUser.uid)
    const userSnapshot = await getDoc(userDoc)
    if (userSnapshot.exists()) {
      const data = userSnapshot.data()
      setName(data.name)
      setDescription(data.description)
      setSkillsList(data.skills || [])
    }
    setLoading(false)
  }, [])

  const handleProfileUpdate = async () => {
    try {
      const userDoc = doc(db, 'profile', auth.currentUser.uid); // Reference the 'profile' collection
      const userSnapshot = await getDoc(userDoc); // Check if the document exists

      if (userSnapshot.exists()) {
        // Update the existing document
        await updateDoc(userDoc, {
          name,
          description,
          skills: skillsList, // Update skills as well
        });
        console.log('Profile updated successfully');
      } else {
        // Create a new document if it doesn't exist
        await setDoc(userDoc, {
          name,
          description,
          skills: skillsList, // Include skills if needed
        });
        console.log('Profile created successfully');
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  const handleAddSkill = async () => {
    if (skill) {
      const updatedSkills = [...skillsList, skill]
      setSkillsList(updatedSkills)
      setSkill('') // Clear the input field
      await handleProfileUpdate() // Update Firestore
    }
  }

  const handleDeleteSkill = async (skillToDelete) => {
    const updatedSkills = skillsList.filter(s => s !== skillToDelete)
    setSkillsList(updatedSkills)
    await handleProfileUpdate() // Update Firestore
  }

  const handleDone = async () => {
    await handleProfileUpdate() // Update profile and skills
    navigate('/mainpage') // Navigate to the main page after saving
  }

  useEffect(() => {
    fetchUserData() // Fetch user data when the component mounts
  }, [fetchUserData])

  return (
    <div className='profile-container'>
      <div className="content">
        <h1>Profile</h1>
        
        <label>Name</label>
        <input 
          type='text' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder='Enter your name' 
        />
        <FaCheck onClick={handleProfileUpdate} style={{ cursor: 'pointer', color: 'green', marginLeft: '10px' }} /> {/* Tick icon for save */}
        
        <label>Description</label>
        <input 
          type='text' 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder='About yourself' 
        />
        <FaCheck onClick={handleProfileUpdate} style={{ cursor: 'pointer', color: 'green', marginLeft: '10px' }} /> {/* Tick icon for save */}
        
        <label>Skill</label>
        <input 
          type='text' 
          value={skill} 
          onChange={(e) => setSkill(e.target.value)} 
          placeholder='Enter your skill' 
        />
        <button onClick={handleAddSkill}>Add Skill</button>

        <h2>Your Skills:</h2>
        <ul>
          {skillsList.map((skill, index) => (
            <li key={index}>
              {skill} 
              <FaTimes 
                onClick={() => handleDeleteSkill(skill)} 
                style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} 
              /> {/* Delete icon */}
            </li>
          ))}
        </ul>

        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleDone}>Done</button> {/* Call handleDone on click */}
        {loading && <p>Loading...</p>} {/* Loading indicator */}
      </div>
    </div>
  )
}

export default Profile
