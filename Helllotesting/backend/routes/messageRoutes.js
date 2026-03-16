const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getChatUsers } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/chats').get(protect, getChatUsers);
router.route('/:userId').get(protect, getMessages);
router.route('/').post(protect, sendMessage);

module.exports = router;