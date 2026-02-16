
interface RightPanelProps {
    currentUser: any;
    isAuthenticated: boolean;
    onSignOut: () => void;
    onSignIn: () => void;
}

export function RightPanel({ currentUser, isAuthenticated, onSignOut, onSignIn }: RightPanelProps) {
    // Mock media images
    const mediaImages = [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    ];

    return (
        <div className="w-80 h-full bg-[#1a1a20]/40 backdrop-blur-xl border-l border-white/10 flex flex-col p-8 overflow-y-auto">
            <div className="flex flex-col items-center mb-8 pt-8">
                <div className="relative mb-4">
                    <img
                        src={currentUser?.avatar || "https://i.pravatar.cc/150?u=1"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-[#282830]"
                    />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{currentUser?.name || "Caroline Gray"}</h2>

                <p className="text-center text-gray-400 text-sm mt-4 px-2 leading-relaxed">
                    {isAuthenticated ? "You are signed in." : "Sign in to access all features."}
                </p>
            </div>

            <div className="flex-1 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">Media</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {mediaImages.map((src, i) => (
                        <img key={i} src={src} alt="Media" className="w-full h-24 object-cover rounded-lg hover:opacity-80 cursor-pointer transition-opacity" />
                    ))}
                </div>
            </div>

            {isAuthenticated ? (
                <button
                    onClick={onSignOut}
                    className="w-full bg-red-500/10 text-red-400 font-semibold py-3 rounded-full hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={onSignIn}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                    Sign In
                </button>
            )}
        </div>
    );
}
