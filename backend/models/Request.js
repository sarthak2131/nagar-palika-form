// filepath: c:\Users\Sarthak\Downloads\project\backend\models\Request.js
import mongoose from 'mongoose';

const remarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: String,
  status: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const requestSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true, // Enforce uniqueness
    immutable: true // Make it unchangeable after creation
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending_cmo', 'pending_nodal', 'pending_commissioner', 'approved', 'rejected'],
    default: 'pending_cmo'
  },
  ulbCode: String,
  ulbName: String,
  employeeCode: String,
  designation: String,
  mobileNumber: String,
  sourceSystem: [String],
  tcodeList: String,
  currentHandler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: [remarkSchema]
}, {
  timestamps: true
});

// Auto-generate ticket number if not present
requestSchema.pre('validate', async function (next) {
  if (!this.ticketNumber) {
    try {
      const ulbCode = this.ulbCode || 'ULB';
      const prefix = `SAP-${ulbCode}`;
      const lastRequest = await this.constructor.findOne({ ticketNumber: { $regex: `^${prefix}` } })
        .sort({ ticketNumber: -1 });

      let sequence = 1;
      if (lastRequest && lastRequest.ticketNumber) {
        const match = lastRequest.ticketNumber.match(/-(\d+)$/);
        if (match) {
          sequence = parseInt(match[1], 10) + 1;
        }
      }

      const paddedSequence = sequence.toString().padStart(4, '0');
      this.ticketNumber = `${prefix}-${paddedSequence}`;
      console.log(`Generated ticket number: ${this.ticketNumber}`); // Add this line
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model('Request', requestSchema);