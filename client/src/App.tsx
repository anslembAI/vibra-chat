import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { RightPanel } from './components/RightPanel';
import { AuthDialog } from './components/AuthDialog';
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import './App.css';

function App() {
  const [activeUserId, setActiveUserId] = useState(1);
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  // Get current active user details for the panels
  const users = [
    { id: 1, name: "Caroline Gray", status: "Online", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Matthew Walker", status: "Online", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Carmen Jacobson", status: "Online", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Presley Martin", status: "Online", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Alexander Wilson", status: "Offline", avatar: "https://i.pravatar.cc/150?u=5" },
    { id: 6, name: "Samuel White", status: "Offline", avatar: "https://i.pravatar.cc/150?u=6" },
  ];

  const activeUser = users.find(u => u.id === activeUserId) || users[0];

  return (
    <div className="flex h-screen w-full bg-[#0f0f13] overflow-hidden font-sans text-white">
      {/* Sidebar */}
      <Sidebar activeUser={activeUserId} setActiveUser={setActiveUserId} />

      {/* Main Chat Area */}
      <ChatWindow
        username="Me"
        room="General"
        currentUser={activeUser}
      />


      {/* Right Panel */}
      <RightPanel
        currentUser={activeUser}
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
        onSignIn={() => setShowAuth(true)}
      />

      <AuthDialog isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}

export default App;
