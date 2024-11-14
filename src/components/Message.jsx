import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link for navigation

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

    const fetchRequests = async () => {
      const receivedRequestsQuery = query(collection(db, 'Requests'), where('recipientId', '==', currentUserId));
      const sentRequestsQuery = query(collection(db, 'Requests'), where('senderId', '==', currentUserId));

      const receivedRequestsSnapshot = await getDocs(receivedRequestsQuery);
      const sentRequestsSnapshot = await getDocs(sentRequestsQuery);

      const receivedRequestsData = receivedRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sentRequestsData = sentRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setRequests([...receivedRequestsData, ...sentRequestsData]);
    };

    fetchRequests();
  }, [currentUserId]);

  const handleAcceptRequest = async (requestId) => {
    const requestDocRef = doc(db, 'Requests', requestId); // Get the document reference directly
    await updateDoc(requestDocRef, { status: 'accepted' }); // Update the status to accepted
    // Refresh requests after accepting
    fetchRequests();
  };

  const handleRejectRequest = async (requestId) => {
    const requestDocRef = doc(db, 'Requests', requestId); // Get the document reference directly
    await updateDoc(requestDocRef, { status: 'rejected' }); // Update the status to rejected
    alert("Request has been rejected.");
    // Refresh requests after rejecting
    fetchRequests();
  };

  return (
    <div>
      <h2>Requests</h2>

      {/* Received Requests Section */}
      <h3>Received Requests</h3>
      {requests.filter(request => request.recipientId === currentUserId).map((request) => (
        <div key={request.id}>
          <p>
            Request from: 
            {userProfiles[request.senderId] ? (
              request.status === 'accepted' ? (
                <Link to={`/chat/${userProfiles[request.senderId].token}`} style={{ color: 'green' }}>
                  {userProfiles[request.senderId].name}
                </Link>
              ) : (
                <span style={{ color: request.status === 'rejected' ? 'red' : 'black' }}>
                  {userProfiles[request.senderId].name}
                </span>
              )
            ) : (
              <span style={{ color: 'red' }}>Unknown User</span>
            )}
            {request.status === 'pending' && (
              <>
                <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                <button onClick={() => handleRejectRequest(request.id)}>Reject</button>
              </>
            )}
          </p>
        </div>
      ))}

      {/* Sent Requests Section */}
      <h3>Sent Requests</h3>
      {requests.filter(request => request.senderId === currentUserId).map((request) => (
        <div key={request.id}>
          <p>
            Request to: 
            {userProfiles[request.recipientId] ? (
              request.status === 'accepted' ? (
                <Link to={`/chat/${userProfiles[request.recipientId].token}`} style={{ color: 'green' }}>
                  {userProfiles[request.recipientId].name}
                </Link>
              ) : (
                <span style={{ color: request.status === 'rejected' ? 'red' : 'black' }}>
                  {userProfiles[request.recipientId].name}
                </span>
              )
            ) : (
              <span style={{ color: 'red' }}>Unknown User</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Message;

