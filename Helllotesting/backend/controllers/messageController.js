// controllers/messageController.js
const Message = require('../models/Message');
const Request = require('../models/Request');

// Check if two users have an accepted/completed request between them
const hasApprovedRequest = async (userId1, userId2) => {
  const request = await Request.findOne({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 }
    ],
    status: { $in: ['accepted', 'completed'] }
  });
  return !!request;
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const allowed = await hasApprovedRequest(myId, userId);
    if (!allowed) {
      return res.status(403).json({ message: 'Chat is only available for approved requests' });
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId }
      ]
    }).sort('createdAt');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    const allowed = await hasApprovedRequest(senderId, receiverId);
    if (!allowed) {
      return res.status(403).json({ message: 'Chat is only available for approved requests' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of users the current user can chat with (accepted/completed requests)
const getChatUsers = async (req, res) => {
  try {
    const myId = req.user._id;
    const requests = await Request.find({
      $or: [{ sender: myId }, { receiver: myId }],
      status: { $in: ['accepted', 'completed'] }
    })
    .populate('sender', 'name email skillsToTeach')
    .populate('receiver', 'name email skillsToTeach');

    // Extract unique chat partners
    const chatPartnersMap = new Map();
    requests.forEach(req => {
      const partner = req.sender._id.toString() === myId.toString() ? req.receiver : req.sender;
      if (!chatPartnersMap.has(partner._id.toString())) {
        chatPartnersMap.set(partner._id.toString(), {
          _id: partner._id,
          name: partner.name,
          email: partner.email,
          skill: req.skill,
          status: req.status
        });
      }
    });

    res.json(Array.from(chatPartnersMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage, getChatUsers };