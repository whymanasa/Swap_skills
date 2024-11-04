import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';
import "../styles/mainpage.css"

const MainPage = ({ currentUserId }) => {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profilesCollection = collection(db, 'profile'); // Reference the 'profile' collection
        const profilesSnapshot = await getDocs(profilesCollection);
        const profilesList = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        

        // Filter out the current user
        const filteredProfiles = profilesList.filter(profile => profile.id !== currentUserId);
        console.log('Filtered profiles:', filteredProfiles); // Log filtered profiles for debugging

        setUserProfiles(filteredProfiles);
      } catch (error) {
        console.error('Error fetching user profiles: ', error);
      }
    };

    fetchUserProfiles();
  }, [currentUserId]);

  return (
    <div className="main-page">
      <h2>Explore Other Users' Profiles</h2>
      <div className="profiles-container">
        {userProfiles.map(profile => (
          <div key={profile.id} className="user-profile">
            <h3>{profile.name}</h3>
            <p className="profile-description">{profile.description}</p>
            <h4>Skills:</h4>
            <ul>
              {profile.skills && profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
            <button className="request-button">Send Request</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
