import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import "../styles/mainpage.css"

const MainPage = ({ currentUserId }) => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // State to hold sent requests

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

    const fetchSentRequests = async () => {
      try {
        const requestsQuery = query(collection(db, 'Requests'), where('senderId', '==', currentUserId));
        const requestsSnapshot = await getDocs(requestsQuery);
        const requestsList = requestsSnapshot.docs.map(doc => doc.data().recipientId); // Get recipient IDs of sent requests
        setSentRequests(requestsList); // Store recipient IDs in state
      } catch (error) {
        console.error('Error fetching sent requests: ', error);
      }
    };

    fetchUserProfiles();
    fetchSentRequests();
  }, [currentUserId]);

  // Function to send a request
  const handleSendRequest = async (recipientId) => {
    try {
      await addDoc(collection(db, 'Requests'), {
        senderId: currentUserId,
        recipientId: recipientId,
        status: 'pending',
      });
      alert('Request sent!');
      setSentRequests((prev) => [...prev, recipientId]); // Update sent requests state
    } catch (error) {
      console.error('Error sending request: ', error);
    }
  };

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
            {sentRequests.includes(profile.id) ? (
              <button className="request-button" disabled>Request Sent</button> // Disable button if request is sent
            ) : (
              <button className="request-button" onClick={() => handleSendRequest(profile.id)}>Send Request</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
