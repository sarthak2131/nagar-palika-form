// filepath: c:\Users\Sarthak\Downloads\project\backend\controllers\requestController.js

import Request from '../models/Request.js';
import sendEmail from '../utils/email.js';
import { AppError } from '../utils/appError.js';

/**
 * Create a new request and send an email confirmation.
 */
export const createRequest = async (req, res, next) => {
  try {
    const newRequest = await Request.create(req.body);

    try {
      await sendEmail({
        email: newRequest.email,
        subject: 'New Request Created',
        message: 'Your request has been created.'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return next(new AppError('Email sending failed', 500));
    }

    res.status(201).json({
      status: 'success',
      data: {
        request: newRequest
      }
    });
  } catch (err) {
    console.error('Request creation error:', err);
    next(err);
  }
};

/**
 * Get requests based on the role of the user.
 */
export const getRequests = async (req, res, next) => {
  try {
    const { role } = req.user;
    let query = {};

    switch (role) {
      case 'CMO':
        query.status = 'pending_cmo';
        break;
      case 'Nodal':
        query.status = 'pending_nodal';
        break;
      case 'Commissioner':
        query.status = 'pending_commissioner';
        break;
      default:
        return next(new AppError('Invalid role', 403));
    }

    const requests = await Request.find(query)
      .populate('currentHandler', 'name')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: {
        requests
      }
    });
  } catch (err) {
    console.error('Fetching requests error:', err);
    next(err);
  }
};

/**
 * Update the status and remarks of a request.
 */
 const updateRequests = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const userId = req.user?._id; // Ensure authenticate middleware adds user

    if (!Array.isArray(remarks) || remarks.length === 0) {
      return next(new AppError('Remarks must be a non-empty array', 400));
    }

    const request = await Request.findById(id);
    if (!request) {
      return next(new AppError('Request not found', 404));
    }

    // Add remarks (with optional user info)
    const updatedRemarks = remarks.map(r => ({
      ...r,
      user: userId,
      timestamp: new Date()
    }));

    request.status = status;
    request.remarks.push(...updatedRemarks);
    await request.save();

    res.status(200).json({
      status: 'success',
      data: {
        request
      }
    });
  } catch (err) {
    console.error('Update request error:', err);
    next(err);
  }
};

export default updateRequests