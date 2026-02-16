# Vibra Chat

A real-time chat application built with React, Node.js + Express + Socket.io, and Convex.

## Setup Instructions

### 1. Database Setup (Convex)

1. Open a terminal in the `client` directory:
   ```bash
   cd client
   npm install
   npx convex dev
   ```
2. Follow the prompts to log in and create a new Convex project.
3. Once running, copy the Deployment URL (e.g. `https://happy-otter-123.convex.cloud`).

### 2. Backend Setup (Node.js + Express + Socket.io)

1. Open a terminal in the `server` directory:
   ```bash
   cd server
   npm install
   ```
2. Create or update the `.env` file in `server/` with your Convex URL:
   ```env
   PORT=3001
   CONVEX_URL=https://your-convex-url.convex.cloud
   ```
3. Start the server:
   ```bash
   node index.js
   ```

### 3. Frontend Setup (React + Vite + Tailwind)

1. Open a terminal in the `client` directory (if not already there):
   ```bash
   cd client
   npm run dev
   ```
2. Open your browser to the URL shown (usually `http://localhost:5173`).

## Stack Details

- **Frontend**: React, Vite, Tailwind CSS.
- **Backend**: Node.js, Express, Socket.io.
- **Database**: Convex (Schema defined in `client/convex/schema.ts`).
