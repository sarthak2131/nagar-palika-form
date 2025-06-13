import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/appError.js';
import logger from '../utils/logger.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError('Please provide username and password', 400);
    }

    const user = await User.findOne({ username, active: true });
    console.log('User found:', user); // Add this line
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await user.comparePassword(password);
    console.log('Password valid:', isValid); // Add this line
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  } catch (error) {
    logger.error('Get profile error:', error);
    next(error);
  }
};

export const logout = (req, res) => {
  res.json({ status: 'success' });
};