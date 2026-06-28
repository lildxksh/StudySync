const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory room storage
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userName }) => {
    socket.join(roomId);

    // Initialize room if doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId);
    room.set(socket.id, { id: socket.id, name: userName, isMuted: false });

    // Notify others in room
    socket.to(roomId).emit('user-joined', { id: socket.id, name: userName });

    // Send existing participants to new user
    const participants = Array.from(room.values()).filter(p => p.id !== socket.id);
    socket.emit('existing-participants', participants);

    // Send room info
    socket.emit('room-joined', { roomId, participants: Array.from(room.values()) });

    console.log(`${userName} joined room ${roomId}`);
  });

  // WebRTC signaling
  socket.on('offer', ({ offer, targetId, roomId }) => {
    socket.to(targetId).emit('offer', { offer, senderId: socket.id });
  });

  socket.on('answer', ({ answer, targetId, roomId }) => {
    socket.to(targetId).emit('answer', { answer, senderId: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, targetId, roomId }) => {
    socket.to(targetId).emit('ice-candidate', { candidate, senderId: socket.id });
  });

  // Chat messages
  socket.on('chat-message', ({ roomId, message, userName }) => {
    io.to(roomId).emit('chat-message', {
      id: Date.now(),
      senderId: socket.id,
      senderName: userName,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Mute/unmute
  socket.on('toggle-mute', ({ roomId, isMuted }) => {
    const room = rooms.get(roomId);
    if (room && room.has(socket.id)) {
      room.get(socket.id).isMuted = isMuted;
      socket.to(roomId).emit('user-muted', { userId: socket.id, isMuted });
    }
  });

  // Typing indicator
  socket.on('typing', ({ roomId, userName }) => {
    socket.to(roomId).emit('user-typing', { userId: socket.id, userName });
  });

  socket.on('stop-typing', ({ roomId }) => {
    socket.to(roomId).emit('user-stop-typing', { userId: socket.id });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove from all rooms
    rooms.forEach((room, roomId) => {
      if (room.has(socket.id)) {
        room.delete(socket.id);
        io.to(roomId).emit('user-left', socket.id);

        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
