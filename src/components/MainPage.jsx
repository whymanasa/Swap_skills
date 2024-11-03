import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';

const MainPage = ({ currentUserId }) => {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profilesCollection = collection(db, 'profile'); // Reference the 'profile' collection
        const profilesSnapshot = await getDocs(profilesCollection);
        const profilesList = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log('All profiles:', profilesList); // Log all profiles for debugging
        console.log('Current user ID:', currentUserId); // Log current user ID for debugging

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
    <div>
      <h2>Other Users' Profiles</h2>
      {userProfiles.map(profile => (
        <div key={profile.id} className="user-profile">
          <h3>{profile.name}</h3>
          <p>Description: {profile.description}</p>
          <h4>Skills:</h4>
          <ul>
            {profile.skills && profile.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          <button>send request</button>

        </div>
      ))}
    </div>
  );
};

export default MainPage;
