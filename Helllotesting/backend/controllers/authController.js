const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Generate random avatar using DiceBear
    const avatarStyles = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'fun-emoji', 'lorelei', 'micah', 'miniavs', 'personas', 'pixel-art'];
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const seed = `${name}-${Date.now()}`;
    const avatar = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(seed)}`;

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpire,
      avatar,
    });

    if (user) {
      try {
        const message = `Your Skill Exchange verification OTP is: ${otp}. It is valid for 10 minutes.`;
        await sendEmail({
          email: user.email,
          subject: 'Skill Exchange - OTP Verification',
          message,
        });

        res.status(201).json({
          message: 'User registered. Please check email for OTP.',
          email: user.email
        });
      } catch (err) {
        console.warn('⚠️ Email could not be sent (Invalid credentials). Logging OTP here for testing instead:', otp);
        
        // Still allow them to pass to OTP verification stage for testing purposes:
        res.status(201).json({
          message: 'Email service unconfigured. Use the OTP from the backend server console!',
          email: user.email
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skillsToTeach: user.skillsToTeach || [],
      skillsToLearn: user.skillsToLearn || [],
      bio: user.bio || '',
      avatar: user.avatar || '',
      token: generateToken(user._id),
      isNewUser: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        bio: user.bio,
        avatar: user.avatar || '',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOTP, loginUser };