import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
import './App.css';

// Connect to backend
const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
      {!showChat ? (
        <div className="joinChatContainer flex flex-col items-center bg-gray-800 p-8 rounded-lg shadow-2xl space-y-4 w-80 border border-gray-700">
          <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Vibra Chat
          </h3>
          <input
            type="text"
            placeholder="John..."
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID..."
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            onChange={(event) => setRoom(event.target.value)}
          />
          <button
            onClick={joinRoom}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded font-semibold transition-transform transform active:scale-95"
          >
            Join A Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
