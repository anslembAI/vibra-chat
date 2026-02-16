const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Initialize Express/HTTP/Socket.io
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow Vite dev server
        methods: ["GET", "POST"]
    }
});

// Convex Client
const { ConvexHttpClient } = require("convex/browser");

const client = new ConvexHttpClient(process.env.CONVEX_URL);

// Mock API object for function references since we can't easily import the generated one from client
const api = {
    messages: {
        list: "messages:list",
        send: "messages:send"
    }
};

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', async (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);

        // Fetch directly from Convex
        try {
            const messages = await client.query(api.messages.list, { room });
            socket.emit('history', messages);
        } catch (err) {
            console.error("Error fetching history:", err);
            // Fallback or empty
            socket.emit('history', []);
        }
    });

    socket.on('send_message', async (data) => {
        // data: { room, author, message, time }
        console.log('Message received:', data);

        try {
            // Save to Convex
            await client.mutation(api.messages.send, data);
        } catch (err) {
            console.error("Error saving message:", err);
        }

        // Broadcast to room (including sender if they rely on this for UI update, 
        // though usually sender updates optimistically. Our React code updates optimistically 
        // AND listens, which might cause dupe if not careful. 
        // The React code: setMessageList((list) => [...list, messageData]); when sending.
        // And listens to 'receive_message'.
        // So we should broadcast with `socket.to(data.room)` which excludes sender.
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
