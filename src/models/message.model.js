const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    delivered: { type: Boolean, default: false },  
    read: { type: Boolean, default: false },       
    readAt: { type: Date },
    unread: { type: Boolean, default: true },  
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
