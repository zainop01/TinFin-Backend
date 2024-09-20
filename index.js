const express = require('express');
const http = require('http');
// const socketConfig = require('./src/sockets/chat.socket');
const config = require('./src/config/config');
const connectDB = require('./src/loaders/db');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const chatRoutes = require('./src/routes/chat.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/chats', chatRoutes);

// socketConfig(server);

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
