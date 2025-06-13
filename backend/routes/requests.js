import express from 'express';
import { body } from 'express-validator';

import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
// import { updateRequest } from '../controllers/statusController.js';
import updateRequests, { createRequest, getRequests } from '../controllers/requestController.js';

const router = express.Router();

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('requestType').trim().notEmpty().withMessage('Request type is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('mobileNumber').trim().notEmpty().withMessage('Mobile number is required'),
  body('employeeCode').trim().notEmpty().withMessage('Employee code is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  validate
], createRequest);

router.get('/', authenticate, getRequests);



router.patch('/:id', authenticate, [
  body('status')
    .isIn(['pending_cmo', 'pending_nodal', 'pending_commissioner', 'approved', 'rejected'])
    .withMessage('Invalid status'),
  body('remarks')
    .isArray()
    .withMessage('Remarks must be an array'),
  body('remarks.*.comment')
    .trim()
    .notEmpty()
    .withMessage('Remark comment is required'),
  validate
], updateRequests);


export default router;