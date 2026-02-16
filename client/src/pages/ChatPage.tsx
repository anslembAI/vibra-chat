
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

    // Handle initial loading
    if (me === undefined) {
        return (
            <div className="flex h-screen w-full bg-[#0f0f13] items-center justify-center text-white">
                <Loader />
            </div>
        );
    }

    // Handle creating/missing profile
    if (me === null) {
        return <div className="p-10 text-white">Profile not found. Please log in again.</div>;
    }

    return (
        <div className="flex h-screen w-full bg-[#0f0f13] overflow-hidden font-sans text-white">
            {/* Sidebar */}
            <Sidebar activeUser={activeUserId} setActiveUser={setActiveUserId} />

            {/* Main Chat Area */}
            <ChatWindow
                username={(me as any).name || (me as any).email || "Me"}
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

function Loader() {
    return <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>;
}
