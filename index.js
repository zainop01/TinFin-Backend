const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const connectDB = require('./src/loaders/db');
const config = require('./src/config/config');
const cors = require('cors');

const app = express();

app.use(cors());


// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
