import express from 'express';
import { query } from 'express-validator';
import { checkStatus } from '../controllers/statusController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', [
  query('type').isIn(['ticket', 'email']),
  query('value').trim().notEmpty(),
  validate
], checkStatus);

export default router;