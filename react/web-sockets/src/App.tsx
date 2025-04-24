import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client';
import './App.css'

function App() {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);
  // const socketRef = useRef<WebSocket | null>(null); // Its for Web Soccket..
  const socketRef = useRef<Socket | null>(null);
  // useEffect(() => {
  //   if (socketRef.current) return;  // Prevent duplicate connections
    
  //   const newSocket = new WebSocket('ws://localhost:3005');
  //   socketRef.current = newSocket;
    
  //   newSocket.onmessage = (event) => {
  //     setChatLog(prev => [...prev, event.data]);
  //   };
    
  //   setSocket(newSocket);
    
  //   return () => {
  //     newSocket.close();
  //     socketRef.current = null;
  //   };
  // }, []);
  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io('http://localhost:3005');
    socketRef.current = newSocket;
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('chat-message', (msg: string) => {
      setChatLog(prev => [...prev, msg]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // const sendMessage = () => {
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     const fullMessage = `${name}: ${message}`;
  //     socket.send(fullMessage);
  //     setMessage('');
  //   }
  // }
  const sendMessage = () => {
    if (socket && socket.connected) {
      const fullMessage = `${name}: ${message}`;
      socket.emit('chat-message', fullMessage);
      setMessage('');
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>WebSocket Chat</h2>
        <div className="name-input">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      
      <div className="chat-messages">
        {chatLog.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      
      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default App