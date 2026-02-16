
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { RightPanel } from "../components/RightPanel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

export function ChatPage() {
    const { signOut } = useAuthActions();
    const me = useQuery(api.users.current);

    // State for active conversation (mock user ID for now)
    const [activeUserId, setActiveUserId] = useState(1);

    // Mock Users for Sidebar (keeping original logic intact as requested)
    // In a real app, this would be a query for all users or conversations
    const users = [
        { id: 1, name: "Caroline Gray", status: "Online", avatar: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Matthew Walker", status: "Online", avatar: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Carmen Jacobson", status: "Online", avatar: "https://i.pravatar.cc/150?u=3" },
        { id: 4, name: "Presley Martin", status: "Online", avatar: "https://i.pravatar.cc/150?u=4" },
        { id: 5, name: "Alexander Wilson", status: "Offline", avatar: "https://i.pravatar.cc/150?u=5" },
        { id: 6, name: "Samuel White", status: "Offline", avatar: "https://i.pravatar.cc/150?u=6" },
    ];

    const activeUser = users.find(u => u.id === activeUserId) || users[0];

    if (me === undefined) {
        return (
            <div className="flex h-screen w-full bg-[#0f0f13] items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-[#0f0f13] overflow-hidden font-sans text-white">
            {/* Sidebar */}
            <Sidebar activeUser={activeUserId} setActiveUser={setActiveUserId} />

            {/* Main Chat Area */}
            <ChatWindow
                username={me?.name || "Me"} // Use real username if available
                room="General"
                currentUser={activeUser} // The person we are chatting with
            />

            {/* Right Panel */}
            <RightPanel
                currentUser={activeUser}
                isAuthenticated={true} // Always true in ChatPage
                onSignOut={signOut}
                onSignIn={() => { }} // No-op
            />
        </div>
    );
}
