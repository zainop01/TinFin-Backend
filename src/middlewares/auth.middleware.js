const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'You are not logged in' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'The user does not exist' });
        }
        
        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
