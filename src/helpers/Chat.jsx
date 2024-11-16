import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../firebase-config'; // Import Firestore
import { useParams } from 'react-router-dom'; // Import useParams to get the recipient token
import { collection, query, where, onSnapshot, addDoc, getDocs, orderBy } from 'firebase/firestore'; // Import Firestore functions
import '../styles/Chat.css'; // Import the CSS file

function Chat({ currentUserId }) {
  const { recipientToken } = useParams(); // Get the recipient token from the URL
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState(''); // State to store recipient's name
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef(null); // Reference to scroll to the bottom

  useEffect(() => {
    const fetchRecipientId = async () => {
      const profilesQuery = query(collection(db, 'profile'), where('token', '==', recipientToken));
      const profilesSnapshot = await getDocs(profilesQuery);
      profilesSnapshot.forEach((doc) => {
        setRecipientId(doc.id); // Set the recipient ID based on the token
        setRecipientName(doc.data().name); // Set the recipient's name from the document data
      });
    };

    fetchRecipientId();
  }, [recipientToken]);

  useEffect(() => {
    if (!recipientId) return; // Exit if recipient ID is not available

    const chatId = generateChatId(currentUserId, recipientId);

    const fetchMessages = async () => {
      const messagesQuery = query(
        collection(db, 'Messages'),
        where('chatId', '==', chatId),
        orderBy('timestamp') // Order messages by timestamp
      );
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
  }, [recipientId, currentUserId]);

  const generateChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_'); // Generate chatId
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() === '') return; // Prevent sending empty messages

    const chatId = generateChatId(currentUserId, recipientId); // Generate chatId

    try {
      await addDoc(collection(db, 'Messages'), {
        senderId: currentUserId,
        recipientId: recipientId,
        content: messageContent,
        timestamp: new Date(),
        chatId: chatId,
      });

      setMessageContent(''); // Clear the input after sending
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  // Scroll to the bottom of the messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat with {recipientName}</h2>
      <div>
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <p className="sender">{msg.senderId === currentUserId ? 'You' : recipientName}:</p>
            <p>{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Empty div to scroll to */}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
