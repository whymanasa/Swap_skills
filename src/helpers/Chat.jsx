import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { useParams } from 'react-router-dom'; // Import useParams to get the recipient token
import { collection, query, where, onSnapshot, addDoc , getDocs} from 'firebase/firestore';

function Chat() {
  const { recipientToken } = useParams(); // Get the recipient token from the URL
  const [recipientId, setRecipientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const fetchRecipientId = async () => {
      const profilesCollection = collection(db, 'profile');
      const profilesQuery = query(profilesCollection, where('token', '==', recipientToken));
      const profilesSnapshot = await getDocs(profilesQuery);
      profilesSnapshot.forEach((doc) => {
        setRecipientId(doc.id); // Set the recipient ID based on the token
      });
    };

    fetchRecipientId();
  }, [recipientToken]);

  useEffect(() => {
    if (!recipientId) return; // Exit if recipient ID is not available

    const fetchMessages = async () => {
      const messagesQuery = query(collection(db, 'Messages'), where('recipientId', '==', recipientId));
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const messagesData = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messagesData);
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    };

    fetchMessages();
  }, [recipientId]);

  const handleSendMessage = async () => {
    if (messageContent.trim() === '') return; // Prevent sending empty messages

    try {
      await addDoc(collection(db, 'Messages'), {
        recipientId: recipientId,
        content: messageContent,
        timestamp: new Date(),
      });
      setMessageContent(''); // Clear the input after sending
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div>
      <h2>Chat with {recipientId}</h2>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Chat;
