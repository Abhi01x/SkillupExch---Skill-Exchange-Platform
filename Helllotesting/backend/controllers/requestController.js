const Request = require('../models/Request');

const createRequest = async (req, res) => {
  const { receiverId, skill, message, scheduledDate } = req.body;

  try {
    // Check if a pending/accepted request already exists for same sender+receiver+skill
    const existingRequest = await Request.findOne({
      sender: req.user._id,
      receiver: receiverId,
      skill,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have an active request for this skill' });
    }

    const request = await Request.create({
      sender: req.user._id,
      receiver: receiverId,
      skill,
      message: message || `I would like to learn ${skill} from you`,
      scheduledDate: scheduledDate || undefined,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (request) {
      // Ensure the logged in user is the receiver of the request
      if (request.receiver.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      request.status = status;
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getMyRequests, updateRequestStatus };