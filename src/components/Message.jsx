import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Message({ currentUserId }) {
  const [requests, setRequests] = useState([]);
  const [userProfiles, setUserProfiles] = useState({}); // To store user profiles
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Fetch user profiles to display names
  useEffect(() => {
    const fetchUserProfiles = async () => {
      const profilesCollection = collection(db, 'profile');
      const profilesSnapshot = await getDocs(profilesCollection);
      const profilesMap = {};
      profilesSnapshot.docs.forEach(doc => {
        profilesMap[doc.id] = { name: doc.data().name, token: doc.data().token }; // Map user ID to user name and token
      });
      setUserProfiles(profilesMap);
    };

    fetchUserProfiles();
  }, []);

  // Check if currentUserId is defined and fetch requests
  useEffect(() => {
    if (!currentUserId) return;

    const receivedRequestsQuery = query(collection(db, 'Requests'), where('recipientId', '==', currentUserId));
    const sentRequestsQuery = query(collection(db, 'Requests'), where('senderId', '==', currentUserId));

    const unsubscribeReceived = onSnapshot(receivedRequestsQuery, (querySnapshot) => {
      const receivedRequestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(prev => [...prev, ...receivedRequestsData]);
    });

    const unsubscribeSent = onSnapshot(sentRequestsQuery, (querySnapshot) => {
      const sentRequestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(prev => [...prev, ...sentRequestsData]);
    });

    return () => {
      unsubscribeReceived();
      unsubscribeSent();
    };
  }, [currentUserId]);

  const handleChatNavigation = (recipientToken, recipientName) => {
    navigate(`/chat/${recipientToken}`);
  };

  const handleAcceptRequest = async (requestId) => {
    const requestDocRef = doc(db, 'Requests', requestId); // Get the document reference directly
    await updateDoc(requestDocRef, { status: 'accepted' }); // Update the status to accepted
    const requestSnapshot = await getDoc(requestDocRef); // Get the updated document
    const requestData = requestSnapshot.data();
    handleChatNavigation(userProfiles[requestData.senderId].token, userProfiles[requestData.senderId].name);
  };

  const handleRejectRequest = async (requestId) => {
    const requestDocRef = doc(db, 'Requests', requestId); // Get the document reference directly
    await updateDoc(requestDocRef, { status: 'rejected' }); // Update the status to rejected
    alert("Request has been rejected.");
  };

  // Separate requests into different categories
  const acceptedRequests = requests.filter(request => request.status === 'accepted');
  const pendingRequests = requests.filter(request => request.status === 'pending');
  const rejectedRequests = requests.filter(request => request.status === 'rejected');

  return (
    <div>
      <h2>Requests</h2>

      {/* Accepted Requests Section */}
      <h3>Accepted Requests</h3>
      {acceptedRequests.length > 0 ? (
        acceptedRequests.map((request) => (
          <div key={request.id}>
            <p>
              Chat with: 
              {userProfiles[request.senderId] ? (
                <span style={{ color: 'blue' }}>
                  {userProfiles[request.senderId].name}
                </span>
              ) : (
                <span style={{ color: 'red' }}>Unknown User</span>
              )}
            </p>
          </div>
        ))
      ) : (
        <p>No accepted requests found.</p>
      )}

      {/* Pending Requests Section */}
      <h3>Pending Requests</h3>
      {pendingRequests.length > 0 ? (
        pendingRequests.map((request) => (
          <div key={request.id}>
            <p>
              Request from: 
              {userProfiles[request.senderId] ? (
                <span style={{ cursor: 'pointer', color: 'blue' }}>
                  {userProfiles[request.senderId].name}
                </span>
              ) : (
                <span style={{ color: 'red' }}>Unknown User</span>
              )}
              <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
              <button onClick={() => handleRejectRequest(request.id)}>Reject</button>
            </p>
          </div>
        ))
      ) : (
        <p>No pending requests found.</p>
      )}

      {/* Rejected Requests Section */}
      <h3>Rejected Requests</h3>
      {rejectedRequests.length > 0 ? (
        rejectedRequests.map((request) => (
          <div key={request.id}>
            <p>
              Request from: 
              {userProfiles[request.senderId] ? (
                <span style={{ color: 'blue' }}>
                  {userProfiles[request.senderId].name}
                </span>
              ) : (
                <span style={{ color: 'red' }}>Unknown User</span>
              )}
            </p>
          </div>
        ))
      ) : (
        <p>No rejected requests found.</p>
      )}
    </div>
  );
}

export default Message;

