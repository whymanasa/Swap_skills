import React, { useState, useEffect } from 'react'
import { auth } from '../firebase-config'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config'; // Import Firestore
import { collection, addDoc, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import the tick and delete icons from react-icons
import "../styles/Profile.css";

function Profile({ onLogout }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [skill, setSkill] = useState('')
  const [skillsList, setSkillsList] = useState([]) // State to hold skills

  const handleLogout = async () => {
    try {
      await signOut(auth)
      onLogout()
      navigate('/')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  const handleSave = async () => {
    try {
      const userDoc = doc(db, 'profile', auth.currentUser.uid); // Reference the 'profile' collection
      await updateDoc(userDoc, {
        name: name,
        description: description,
      });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  }

  const handleAddSkill = async () => {
    if (skill) {
      try {
        const userDoc = doc(db, 'profile', auth.currentUser.uid); // Reference the 'profile' collection
        // Update the skills array in Firestore
        await updateDoc(userDoc, {
          skills: [...skillsList, skill], // Add the new skill to the existing array
        });
        setSkill(''); // Clear the input field
        fetchSkills(); // Refresh the skills list
      } catch (error) {
        console.error('Error adding skill: ', error);
      }
    }
  };

  const handleDeleteSkill = async (skillToDelete) => {
    try {
      const userDoc = doc(db, 'profile', auth.currentUser.uid); // Reference the 'profile' collection
      // Filter out the skill to delete
      const updatedSkills = skillsList.filter(skill => skill !== skillToDelete);
      // Update the skills array in Firestore
      await updateDoc(userDoc, {
        skills: updatedSkills, // Set the updated skills array
      });
      setSkillsList(updatedSkills); // Update local state
    } catch (error) {
      console.error('Error deleting skill: ', error);
    }
  };

  const fetchSkills = async () => {
    const userDoc = doc(db, 'profile', auth.currentUser.uid); // Reference the 'profile' collection
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      setSkillsList(data.skills || []); // Set skillsList to the skills array or an empty array
    }
  };

  const handleDone = async () => {
    try {
      const userDoc = doc(db, 'profile', auth.currentUser.uid); // Reference the 'profile' collection
      // Check if the document exists
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        // Update the existing document
        await updateDoc(userDoc, {
          name: name,
          description: description,
        });
        console.log('Profile updated successfully on Done');
      } else {
        // Create a new document if it doesn't exist
        await setDoc(userDoc, {
          name: name,
          description: description,
          skills: skillsList, // Include skills if needed
        });
        console.log('Profile created successfully on Done');
      }
      navigate('/mainpage'); // Navigate to the main page after saving
    } catch (error) {
      console.error('Error saving profile on Done: ', error);
    }
  };

  useEffect(() => {
    // Fetch user data (name and description) from Firestore
    const fetchUserData = async () => {
      const userDoc = doc(db, 'profile', auth.currentUser.uid) // Reference the 'profile' collection
      const userSnapshot = await getDoc(userDoc)
      if (userSnapshot.exists()) {
        setName(userSnapshot.data().name)
        setDescription(userSnapshot.data().description)
      }
    }
    fetchUserData()
    fetchSkills() // Fetch skills when the component mounts
  }, [])

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
        <FaCheck onClick={handleSave} style={{ cursor: 'pointer', color: 'green', marginLeft: '10px' }} /> {/* Tick icon for save */}
        
        <label>Description</label>
        <input 
          type='text' 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder='About yourself' 
        />
        <FaCheck onClick={handleSave} style={{ cursor: 'pointer', color: 'green', marginLeft: '10px' }} /> {/* Tick icon for save */}
        
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
      </div>
    </div>
  )
}

export default Profile
