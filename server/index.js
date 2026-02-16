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

// Convex Client (if using Node.js client)
// We'll use HTTP fetch for simplicity if convex-node isn't fully set up,
// or just placeholder logic for now.
// To use Convex from Node:
// 1. npm install convex
// 2. const { ConvexHttpClient } = require("convex/browser");
// 3. const client = new ConvexHttpClient(process.env.CONVEX_URL);

// In-memory store fallback if Convex not configured
let matchHistory = [];

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Send history on connection
    socket.emit('history', matchHistory);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', async (data) => {
        // data: { room, author, message, time }
        console.log('Message received:', data);

        // Save to Convex here
        // await client.mutation("messages:send", { ...data });

        // For now, push to local history
        matchHistory.push(data);

        // Broadcast to room
        socket.to(data.room).emit('receive_message', data);
        // Also emit back to sender? Usually sender updates optimistically.
        // Or we emit to everyone including sender:
        // io.in(data.room).emit('receive_message', data); 
        // Socket.io 'to' excludes sender.
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
