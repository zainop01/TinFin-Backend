const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('/send-friend-request', userController.sendFriendRequest);

router.post('/accept-friend-request', userController.acceptFriendRequest);

router.get('/:userId/friends', userController.getFriends);

router.get('/search', userController.searchUsers);

router.get('/:userId/friend-requests', userController.getFriendRequests);

router.get('/:userId/last-seen', userController.updateLastSeen);


module.exports = router;
