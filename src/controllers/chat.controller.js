const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

exports.getConversation = async (req, res) => {
    const { userId, friendId } = req.params;
    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, friendId] }
        }).populate('participants', 'name email');  

        if (!conversation) {
            conversation = new Conversation({ participants: [userId, friendId] });
            await conversation.save();
        }

        const messages = await Message.find({ conversationId: conversation._id }).populate('sender', 'name email');

        res.status(200).json({
            conversation,
            messages
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.sendMessage = async (req, res) => {
    const { conversationId, senderId, text } = req.body;
    try {
        const message = new Message({
            conversationId,
            sender: senderId,
            text
        });
        await message.save();

        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
      const { lastMessageTime } = req.query;
      const query = { conversationId: req.params.conversationId };
  
      if (lastMessageTime) {
        query.createdAt = { $gt: new Date(lastMessageTime) };
      }
  
      const messages = await Message.find(query);
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  