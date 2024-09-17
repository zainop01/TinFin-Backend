const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const config = require('../config/config');

// Signup
exports.signup = async (req, res) => {
    const { username, email, phone, password } = req.body;

    try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username is already taken'
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email is already registered'
            });
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                status: 'fail',
                message: 'Phone number is already registered'
            });
        }

        const newUser = await User.create({ username, email, phone, password });

        res.status(201).json({
            status: 'success',
            message: 'User successfully signed up',
            data: { user: newUser }
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: `Signup failed: ${err.message}`
        });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, config.jwtSecretKey, {
            expiresIn: '1d'
        });

        // Add token to the user object
        const userWithToken = {
            ...user._doc, // _doc contains the actual user data
            token
        };

        // Return user with token in response
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { user: userWithToken }
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: `Login failed: ${err.message}`
        });
    }
};