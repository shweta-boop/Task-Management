const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:4200',    'https://task-management-rose-eight.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

connectDB();

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:4200',    'https://task-management-rose-eight.vercel.app'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('user-online', (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit('users-online', Array.from(activeUsers.keys()));
  });

  socket.on('task-created', (task) => {
    io.emit('task-created', task);
  });

  socket.on('task-updated', (task) => {
    io.emit('task-updated', task);
  });

  socket.on('task-deleted', (taskId) => {
    io.emit('task-deleted', taskId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const userId = Array.from(activeUsers.entries()).find(([, id]) => id === socket.id)?.[0];
    if (userId) {
      activeUsers.delete(userId);
      io.emit('users-online', Array.from(activeUsers.keys()));
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
