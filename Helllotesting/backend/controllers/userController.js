const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skillsToTeach: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn,
      bio: user.bio,
      rating: user.rating,
      reviewsCount: user.reviewsCount,
      avatar: user.avatar || ''
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.skillsToTeach = req.body.skillsToTeach || user.skillsToTeach;
    user.skillsToLearn = req.body.skillsToLearn || user.skillsToLearn;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      skillsToTeach: updatedUser.skillsToTeach,
      skillsToLearn: updatedUser.skillsToLearn,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar || ''
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Get all users (for discovering skills)
const getUsers = async (req, res) => {
  const keyword = req.query.keyword ? {
    $or: [
      { skillsToTeach: { $regex: req.query.keyword, $options: 'i' } },
      { name: { $regex: req.query.keyword, $options: 'i' } }
    ]
  } : {};

  // Find users excluding the logged in user, only show users who have skills to teach
  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user._id },
    isVerified: true,
    skillsToTeach: { $exists: true, $not: { $size: 0 } }
  }).select('-password -otp -otpExpire');
  
  res.json(users);
};

// Rate a user
const rateUser = async (req, res) => {
  try {
    const { rating } = req.body;
    const userToRate = await User.findById(req.params.id);

    if (userToRate) {
      const currentTotalRating = userToRate.rating * userToRate.reviewsCount;
      userToRate.reviewsCount += 1;
      userToRate.rating = (currentTotalRating + Number(rating)) / userToRate.reviewsCount;
      
      await userToRate.save();
      res.json({ message: 'Rating added successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a specific skill from user's skillsToTeach
const deleteSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skillsToTeach = user.skillsToTeach.filter(s => s !== skill);
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      skillsToTeach: updatedUser.skillsToTeach,
      skillsToLearn: updatedUser.skillsToLearn,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar || ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getUsers, rateUser, deleteSkill };