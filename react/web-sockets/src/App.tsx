import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';
// Add this type declaration near your imports
type SocketWithAuth = Socket & {
  auth: {
    serverOffset: number;
  };
};
function App() {
  // State management (keeping WebSocket comments)
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line prefer-const
  let [count, setCount] = useState(0);
  // WebSocket implementation (keeping original comments)
  /*
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (socketRef.current) return;  // Prevent duplicate connections
    
    const newSocket = new WebSocket('ws://localhost:3005');
    socketRef.current = newSocket;
    
    newSocket.onmessage = (event) => {
      setChatLog(prev => [...prev, event.data]);
    };
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, []);
  */

  // Socket.IO implementation (enhanced with auto-scroll and offset)
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: { serverOffset: 0 },
  // enable retries
    ackTimeout: 10000,
    retries: 3,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })as SocketWithAuth; // <-- Add type assertion here;

    socketRef.current = newSocket;
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    // newSocket.on('chat-message', (msg: string) => {
    //   setChatLog(prev => [...prev, msg]);
    // });
    //recovery from server side...
    // newSocket.on('chat messageV2', (msg, serverOffset) => {
    //   setChatLog(prev => [...prev, msg]);
    //   newSocket.auth.serverOffset = serverOffset;
    // });
    newSocket.on('chat messageV3', (msg, serverOffset) => {
      setChatLog(prev => [...prev, msg]);
      newSocket.auth.serverOffset = serverOffset;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
    });

    // Request-response handlers (keeping original)
    newSocket.timeout(5000).emit('requestFromFrontEnd', 'Client Req To Server Response', 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, response: any) => {
        if (err) console.error('Request failed:', err);
        else console.log('Response:', response.status);
      }
    );

    newSocket.on('requestFromServer', (arg1, arg2, callback) => {
      console.log('Server request:', arg1, arg2);
      callback({ status: 'Client Response' });
    });

    newSocket.on('ReqWithAcKFromServer', (arg1, callback) => {
      console.log('Server ACK:', arg1);
      callback({ status: 'Ack' });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);
  // let counter = 0;
  // Message sending (keeping WebSocket version commented)
  const sendMessage = () => {
    if (socket?.connected && name && message) {
      const fullMessage = `${name}: ${message}`;
      // socket.emit('chat messageV2', fullMessage);
            // compute a unique offset
          setCount(count+1);
            const clientOffset = `${socket.id}-${count}`;
            socket.emit('chat messageV3',  fullMessage, clientOffset); // client side recovery
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name && message) {
      sendMessage();
    }
  };

  // Connection toggle (unchanged)
  const toggleConnection = () => {
    if (socketRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isConnected ? socketRef.current.disconnect() : socketRef.current.connect();
    }
  };

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
            required
          />
        </div>
      </div>
      
      <div className="chat-messages">
        {chatLog.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="connection-controls">
        <button 
          onClick={toggleConnection}
          className={`toggle-btn ${isConnected ? 'disconnect' : 'connect'}`}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
        <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          required
        />
        <button 
          onClick={sendMessage}
          disabled={!isConnected || !name || !message}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;