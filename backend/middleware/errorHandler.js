import {AppError} from '../utils/AppError.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  res.status(500).json({
    message: 'Internal server error'
  });
};