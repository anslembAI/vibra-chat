import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

interface ChatProps {
    socket: any;
    username: string;
    room: string;
}

interface MessageData {
    room: string;
    author: string;
    message: string;
    time: string;
}

function Chat({ socket, username, room }: ChatProps) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState<MessageData[]>([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData: MessageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.off("receive_message").on("receive_message", (data: MessageData) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className="chat-window w-full max-w-md bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700 flex flex-col h-[600px]">
            <div className="chat-header bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
                <p className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Live Chat
                </p>
                <div className="status-indicator w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="chat-body flex-1 overflow-y-auto p-4 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <ScrollToBottom className="message-container h-full">
                    {messageList.map((messageContent, index) => {
                        const isMe = username === messageContent.author;
                        return (
                            <div
                                key={index}
                                className={`message flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
                            >
                                <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`message-content p-3 rounded-lg text-sm break-words ${isMe
                                                ? "bg-purple-600 text-white rounded-tr-none"
                                                : "bg-gray-700 text-gray-200 rounded-tl-none"
                                            }`}
                                    >
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta flex gap-2 text-xs text-gray-500 mt-1">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author" className="font-semibold">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer p-4 bg-gray-900 border-t border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-white"
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded text-white hover:opacity-90 transition-opacity"
                >
                    &#9658;
                </button>
            </div>
        </div>
    );
}

export default Chat;
