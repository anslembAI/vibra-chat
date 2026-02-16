import { useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Send, Image as ImageIcon, Info } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ChatProps {
    username: string;
    room: string;
    currentUser: any;
}

export function ChatWindow({ username, room, currentUser }: ChatProps) {
    const [currentMessage, setCurrentMessage] = useState("");
    const messageList = useQuery(api.messages.list, { channelName: room }) || [];
    const sendMessageMutation = useMutation(api.messages.send);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            await sendMessageMutation({
                channelName: room,
                body: currentMessage,
                format: "text",
            });
            setCurrentMessage("");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#1a1a20]/20 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <img src={currentUser?.avatar} alt={currentUser?.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h2 className="text-white font-bold text-lg">{currentUser?.name}</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-400 text-sm">{currentUser?.status}</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Info className="w-6 h-6" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden z-10 p-4">
                <ScrollToBottom className="h-full w-full pr-4 custom-scrollbar">
                    <div className="flex flex-col gap-6 py-4">
                        {messageList.map((msg, index) => {
                            const isMe = username === msg.author;
                            // Note: username prop is "Me" or currentUser.name. 
                            // Using msg.author from backend is reliable.
                            // However, we need to know who "I" am to align right.
                            // The backend returns msg.author as Name.
                            // We should probably rely on userId comparison if we had my userId here.
                            // But ChatWindow receives "username". In ChatPage, it passed `me.name`.
                            // So `isMe` checks name equality.

                            return (
                                <div key={index} className={`flex gap-4 ${isMe ? "justify-end" : "justify-start"}`}>
                                    {!isMe && (
                                        <img src={msg.avatar} alt={msg.author} className="w-8 h-8 rounded-full object-cover mt-1" />
                                    )}

                                    <div className={`flex flex-col max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                                        {/* Author Name for group chats? Optional */}
                                        {!isMe && <span className="text-xs text-gray-500 mb-1 ml-1">{msg.author}</span>}

                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${isMe
                                            ? "bg-purple-600/20 border border-purple-500/30 text-white rounded-tr-none"
                                            : "bg-[#282830] text-gray-200 rounded-tl-none border border-white/5"
                                            }`}>
                                            {msg.body}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 px-1">{msg.time}</span>
                                    </div>

                                    {isMe && (
                                        <img src={msg.avatar} alt={msg.author} className="w-8 h-8 rounded-full object-cover mt-1" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollToBottom>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-[#1a1a20]/30 backdrop-blur-md border-t border-white/10 z-10">
                <div className="flex items-center gap-4 bg-[#282830] rounded-full p-2 pl-6 pr-2 border border-white/5 focus-within:ring-2 focus-within:ring-purple-600/50 transition-all">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Send a message"
                        className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                    />
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={sendMessage}
                        className="p-3 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
