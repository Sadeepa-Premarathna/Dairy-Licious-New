const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validate month format (YYYY-MM)
        return /^\d{4}-(0[1-9]|1[0-2])$/.test(v);
      },
      message: 'Month should be in YYYY-MM format'
    }
  },
  working_days: {
    type: Number,
    required: true,
    min: 0,
    max: 31,
    validate: {
      validator: Number.isInteger,
      message: 'Working days must be an integer'
    }
  },
  ot_hours: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'attendances'
});

// Create compound index for employee_id and month to ensure unique attendance per employee per month
attendanceSchema.index({ employee_id: 1, month: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema, 'attendances');

module.exports = Attendance;
