const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const config = require('./src/config/config');
const connectDB = require('./src/loaders/db');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});
app.set('io', io); 


app.use(cors());
app.use(express.json());

connectDB();

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const chatRoutes = require('./src/routes/chat.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// Socket.io configuration
require('./src/sockets/chat.socket')(io);

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
