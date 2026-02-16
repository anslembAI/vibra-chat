import { Search } from 'lucide-react';

interface SidebarProps {
    activeUser: number;
    setActiveUser: (id: number) => void;
}

const users = [
    { id: 1, name: "Caroline Gray", status: "Online", lastMessage: "Lorem ipsum is placeholder...", unread: 0, avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Matthew Walker", status: "Online", unread: 4, avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Carmen Jacobson", status: "Online", unread: 0, avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Presley Martin", status: "Online", unread: 2, avatar: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Alexander Wilson", status: "Offline", unread: 0, avatar: "https://i.pravatar.cc/150?u=5" },
    { id: 6, name: "Samuel White", status: "Offline", unread: 0, avatar: "https://i.pravatar.cc/150?u=6" },
];

export function Sidebar({ activeUser, setActiveUser }: SidebarProps) {
    return (
        <div className="w-80 h-full bg-[#1a1a20]/40 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center gap-2 mb-8">
                <div className="bg-purple-600 p-2 rounded-lg">
                    <span className="text-white font-bold text-xl">•••</span>
                </div>
                <h1 className="text-xl font-bold text-white tracking-wide">Vibrachat <span className="text-purple-400 text-sm font-normal">by vts</span></h1>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full bg-[#282830] text-gray-300 pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-purple-600 outline-none transition-all placeholder-gray-500"
                />
            </div>

            <div className="flex flex-col gap-2">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => setActiveUser(user.id)}
                        className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-200 group ${activeUser === user.id
                            ? 'bg-purple-600/20 border border-purple-500/30'
                            : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <div className="relative">
                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                            {user.status === 'Online' && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a20]"></span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className={`font-semibold truncate ${activeUser === user.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    {user.name}
                                </h3>
                                {user.unread > 0 && (
                                    <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {user.unread}
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm truncate ${activeUser === user.id ? 'text-purple-200' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                {user.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
