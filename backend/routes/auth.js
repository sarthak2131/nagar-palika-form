import express from 'express';
import { body } from 'express-validator';
import { login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty(),
  validate
], login);

router.get('/profile', authenticate, getProfile);

export default router;