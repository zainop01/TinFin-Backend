const Message = require("../models/message.model");
const User = require("../models/user.model");
const onlineUsers = require("./onlineUsers"); // Import the shared object


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", async ({ userId }) => {
      onlineUsers[userId] = socket.id;
      io.emit("online-users", onlineUsers);

      await User.findByIdAndUpdate(userId, { lastSeen: null });
    });

    socket.on("send-message", async ({ conversationId, senderId, text }) => {
      try {
        const message = new Message({
          conversationId,
          sender: senderId,
          text,
          createdAt: new Date(),
          delivered: false,
          read: false,
        });
        await message.save();

        io.emit(`message-${conversationId}`, message);

        const recipientId = Object.keys(onlineUsers).find(
          (key) => key !== senderId
        );
        if (recipientId) {
          await Message.findByIdAndUpdate(message._id, { delivered: true });
          io.to(onlineUsers[recipientId]).emit(
            "message-delivered",
            message._id
          );
        }
      } catch (error) {
        console.error("Message send error:", error);
      }
    });

    socket.on("read-message", async ({ messageId, conversationId }) => {
      try {
        const message = await Message.findByIdAndUpdate(
          messageId,
          { read: true, readAt: new Date() },
          { new: true }
        );
        io.emit(`message-read-${conversationId}`, message);
      } catch (error) {
        console.error("Message read error:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      const userId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id
      );
      if (userId) {
        delete onlineUsers[userId];
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        io.emit("online-users", onlineUsers);
      }
    });

    socket.on("typing", ({ conversationId, senderId }) => {
      io.emit(`typing-${conversationId}`, senderId);
    });

    socket.on("stop-typing", ({ conversationId, senderId }) => {
      io.emit(`stop-typing-${conversationId}`, senderId);
    });
  });
};
