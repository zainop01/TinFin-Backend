const express = require('express');
const chatController = require('../controllers/chat.controller');
const router = express.Router();

router.get('/conversation/:userId/:friendId', chatController.getConversation);

router.post('/send-message', chatController.sendMessage);

router.get('/messages/:conversationId', chatController.getMessages);

module.exports = router;
