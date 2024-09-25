const User = require('../models/user.model');
const onlineUsers = require("../sockets/onlineUsers");

exports.sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (sender.sentRequests.includes(receiverId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    receiver.friendRequests.push(senderId);
    sender.sentRequests.push(receiverId);

    await receiver.save();
    await sender.save();

    // Emit socket event to receiver if they are online
    if (onlineUsers[receiverId]) {
      req.app.get('io').to(onlineUsers[receiverId]).emit("friend-request", {
        senderId,
        senderName: sender.name,
        senderUsername: sender.username,
      });
    }

    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId) || friend.friends.includes(userId)) {
            return res.status(400).json({ message: "Users are already friends" });
        }

        user.friends.push(friendId);
        friend.friends.push(userId);

        user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
        friend.sentRequests = friend.sentRequests.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Friend request accepted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('friendRequests', 'name username'); 
        res.status(200).json(user.friendRequests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFriends = async (req, res) => {
    const { searchTerm } = req.query; 
    try {
        const user = await User.findById(req.params.userId).populate('friends');
        
        let friends = user.friends;
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            friends = friends.filter(friend => 
                friend.username.match(regex) || friend.name.match(regex)
            );
        }

        res.status(200).json(friends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.searchUsers = async (req, res) => {
    const { searchTerm } = req.query;
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: searchTerm, $options: 'i' } },
                { name: { $regex: searchTerm, $options: 'i' } } 
            ]
        }).select('username name');

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateLastSeen = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, 'lastSeen');
        if (!user) return res.status(404).send('User not found');
        res.status(200).json({ lastSeen: user.lastSeen });
    } catch (error) {
        res.status(500).send('Server error');
    }
};
