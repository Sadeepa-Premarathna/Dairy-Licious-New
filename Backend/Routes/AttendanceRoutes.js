const express = require('express');
const router = express.Router();
const {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary
} = require('../Controllers/AttendanceController');

// Create new attendance record
router.post('/', createAttendance);

// Get all attendance records (with optional filtering and pagination)
router.get('/', getAllAttendance);

// Get attendance record by ID
// Place summary route before param route to avoid shadowing
router.get('/summary/:employee_id', getAttendanceSummary);

router.get('/:id', getAttendanceById);

// Update attendance record by ID
router.put('/:id', updateAttendance);

// Delete attendance record by ID
router.delete('/:id', deleteAttendance);

module.exports = router;
