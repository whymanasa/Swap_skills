import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link for navigation
import '../styles/Message.css'; // Import the CSS file

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
    fetchRequests(); // Refresh requests after accepting
  };

  const handleRejectRequest = async (requestId) => {
    const requestDocRef = doc(db, 'Requests', requestId); // Get the document reference directly
    await updateDoc(requestDocRef, { status: 'rejected' }); // Update the status to rejected
    alert("Request has been rejected.");
    fetchRequests(); // Refresh requests after rejecting
  };

  return (
    <div className="requests-container">
      {/* Chat Section */}
      <p className="requests-header">Chat</p>
      {requests.filter(request => request.status === 'accepted' && (request.recipientId === currentUserId || request.senderId === currentUserId)).map((request) => (
        <div key={request.id} className="request-item">
          <p>
            {userProfiles[request.recipientId === currentUserId ? request.senderId : request.recipientId] ? (
              <Link to={`/chat/${userProfiles[request.recipientId === currentUserId ? request.senderId : request.recipientId].token}`} className="request-link">
                {userProfiles[request.recipientId === currentUserId ? request.senderId : request.recipientId].name}
              </Link>
            ) : (
              <span style={{ color: 'red' }}>Unknown User</span>
            )}
          </p>
        </div> 
      ))}
      <br/><br/>

      {/* Received Requests Section */}
      <p className="requests-header">Received Requests</p>
      {requests.filter(request => request.recipientId === currentUserId && request.status === 'pending').length === 0 ? (
        <p className='answer'>No received requests.</p>
      ) : (
        requests.filter(request => request.recipientId === currentUserId && request.status === 'pending').map((request) => (
          <div key={request.id} className="request-item">
            <p>
              {userProfiles[request.senderId] ? (
                <span>
                  {userProfiles[request.senderId].name}
                  <button className="button accept-button" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                  <button className="button reject-button" onClick={() => handleRejectRequest(request.id)}>Reject</button>
                </span>
              ) : (
                <span style={{ color: 'red' }}>Unknown User</span>
              )}
            </p>
          </div>
        ))
      )}
      <br/><br/>

      {/* Sent Requests Section */}
      <p className="requests-header">Sent Requests</p>
      {requests.filter(request => request.senderId === currentUserId && request.status === 'pending').length === 0 ? (
        <p className='answer'>No sent requests.</p>
      ) : (
        requests.filter(request => request.senderId === currentUserId && request.status === 'pending').map((request) => (
          <div key={request.id} className="request-item">
            <p>
              {userProfiles[request.recipientId] ? (
                <span>
                  {userProfiles[request.recipientId].name}
                </span>
              ) : (
                <span style={{ color: 'red' }}>Unknown User</span>
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Message;

