import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';
import { FaSearch } from "react-icons/fa";
import '../styles/Search.css';
function Search({ currentUserId }) {
  const [searchSkill, setSearchSkill] = useState(''); // State for the search input
  const [userProfiles, setUserProfiles] = useState([]); // State to hold user profiles
  const [filteredProfiles, setFilteredProfiles] = useState([]); // State to hold filtered profiles

  // Fetch all user profiles when the component mounts
  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profilesCollection = collection(db, 'profile'); // Reference the 'profile' collection
        const profilesSnapshot = await getDocs(profilesCollection);
        const profilesList = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserProfiles(profilesList); // Store all user profiles
      } catch (error) {
        console.error('Error fetching user profiles: ', error);
      }
    };

    fetchUserProfiles();
  }, []);

  // Function to handle the search
  const handleSearch = () => {
    if (searchSkill) {
      const matchedProfiles = userProfiles.filter(profile => 
        profile.id !== currentUserId && // Exclude the current user
        profile.skills && profile.skills.some(skill => 
          skill.toLowerCase().includes(searchSkill.toLowerCase()) // Check if the skill includes the search input
        )
      );
      setFilteredProfiles(matchedProfiles); // Update the filtered profiles state
    } else {
      setFilteredProfiles([]); // Clear results if no skill is entered
    }
  };

  return (
    <div className='search-container'>
      <div className='search-bar'>
        <input className='search-input'
          type='text' 
          placeholder='Search for skills' 
          value={searchSkill} 
          onChange={(e) => setSearchSkill(e.target.value)} // Update searchSkill state
        />
        <button className='search-button' onClick={handleSearch}>
        <FaSearch className='search-icon'/></button>  
      </div>

      <h2>Search Results:</h2>
      {filteredProfiles.length > 0 ? (
        filteredProfiles.map(profile => (
          <div  className="user-profile" key={profile.id}>
            <h3>{profile.name}</h3>
            <p>Description: {profile.description}</p>
            <h4>Skills:</h4>
            <ul>
              {profile.skills && profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No users found with the specified skill.</p>
      )}
    </div>
  );
}

export default Search;
