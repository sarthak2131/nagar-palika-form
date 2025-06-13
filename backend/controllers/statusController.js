// filepath: c:\Users\Sarthak\Downloads\project\backend\controllers\requestController.js
import Request from '../models/Request.js';
import sendEmail from '../utils/email.js';
import {AppError} from '../utils/appError.js';

export const createRequest = async (req, res, next) => {
  try {
    const newRequest = await Request.create(req.body);

    // Send email (example)
    try {
      await sendEmail({
        email: newRequest.email,
        subject: 'New Request Created',
        message: 'Your request has been created.'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return next(new AppError('Email sending failed', 500)); // Pass error to error handler
    }

    res.status(201).json({
      status: 'success',
      data: {
        request: newRequest // Include the request object in the response
      }
    });
  } catch (err) {
    console.error('Request creation error:', err);
    next(err); // Pass the error to your error handling middleware
  }
};
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
        requests // Wrap the requests array in a 'requests' object
      }
    });
  } catch (err) {
    console.error('Fetching requests error:', err);
    next(err);
  }
};

export const updateRequest = async (req, res, next) => {
  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRequest) {
      return next(new AppError('No request found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        request: updatedRequest
      }
    });
  } catch (err) {
    console.error('Updating request error:', err);
    next(err);
  }
};

export const checkStatus = async (req, res, next) => {
  try {
    const { type, value } = req.query;

    if (type === 'ticket') {
      const request = await Request.findOne({ ticketNumber: { $regex: new RegExp(`^${value}$`, 'i') } })
        .populate('currentHandler', 'name')
        .populate('remarks.user', 'name');

      if (!request) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      console.log('Sending status for ticket:', request.status); // DEBUG LOG

      res.json({
        ticketNumber: request.ticketNumber,
        status: request.status,
        name: request.name,
        department: request.department,
        requestType: request.requestType,
        createdAt: request.createdAt,
        currentHandler: request.currentHandler,
        remarks: request.remarks
      });
    } else if (type === 'email') {
      const requests = await Request.find({ email: value })
        .populate('currentHandler', 'name')
        .populate('remarks.user', 'name')
        .sort('-createdAt');

      if (!requests || requests.length === 0) {
        return res.status(404).json({ message: 'No requests found for this email' });
      }

      res.json(requests); // full request array with status included
    } else {
      return next(new AppError('Invalid query type', 400));
    }
  } catch (error) {
    next(error);
  }
};