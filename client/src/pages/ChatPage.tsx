
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { RightPanel } from "../components/RightPanel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { AuthPage } from "./AuthPage";

export function ChatPage() {
    const { signOut } = useAuthActions();
    const me = useQuery(api.users.me);

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

    // Pattern-based guards
    if (me === undefined) return null; // loading
    if (me === null) return <AuthPage />; // not signed in/profile missing

    // safe now
    // me._id is available

    return (
        <div className="flex h-screen w-full bg-[#0f0f13] overflow-hidden font-sans text-white">
            {/* Sidebar */}
            <Sidebar activeUser={activeUserId} setActiveUser={setActiveUserId} />

            {/* Main Chat Area */}
            <ChatWindow
                username={me.name || me.email || "Me"}
                room="General"
                currentUser={activeUser}
            />

            {/* Right Panel */}
            <RightPanel
                currentUser={activeUser}
                isAuthenticated={true}
                onSignOut={signOut}
                onSignIn={() => { }}
            />
        </div>
    );
}
