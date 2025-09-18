const Attendance = require('../Model/AttendanceModel');

// Create new attendance record
const createAttendance = async (req, res) => {
  try {
    const { employee_id, month, working_days, ot_hours } = req.body;

    // Validate required fields
    if (!employee_id || !month || working_days === undefined) {
      return res.status(400).json({
        success: false,
        message: 'employee_id, month, and working_days are required'
      });
    }

    // Do not allow mock writes; require real DB connection

    // Check if attendance already exists for this employee and month
    const existingAttendance = await Attendance.findOne({ employee_id, month });
    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message: 'Attendance record already exists for this employee and month'
      });
    }

    const newAttendance = new Attendance({
      employee_id,
      month,
      working_days,
      ot_hours: ot_hours || 0
    });

    const savedAttendance = await newAttendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance record created successfully',
      data: savedAttendance
    });
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const { employee_id, month, page = 1, limit = 10 } = req.query;
    
    // Do not return mock data; require real DB connection
    
    const filter = {};
    if (employee_id) filter.employee_id = employee_id;
    if (month) filter.month = month;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const attendanceRecords = await Attendance.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Attendance.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Attendance records retrieved successfully',
      data: attendanceRecords,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_records: total,
        has_next: pageNum < Math.ceil(total / limitNum),
        has_prev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record retrieved successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { working_days, ot_hours, month, employee_id } = req.body;

    const mongoose = require('mongoose');

    let attendance = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      attendance = await Attendance.findById(id);
    } else {
      // Fallback: allow update by employee_id + month
      const resolvedEmployeeId = employee_id || id; // if id looks like EMPxxx
      const resolvedMonth = month || req.query.month;
      if (!resolvedEmployeeId || !resolvedMonth) {
        return res.status(400).json({ success: false, message: 'Invalid ID. Provide valid _id in path or employee_id and month.' });
      }
      attendance = await Attendance.findOne({ employee_id: resolvedEmployeeId, month: resolvedMonth });
    }

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Update fields if provided
    if (working_days !== undefined) attendance.working_days = working_days;
    if (ot_hours !== undefined) attendance.ot_hours = ot_hours;

    const updatedAttendance = await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully',
      data: updatedAttendance
    });
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  } 
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, month } = req.query;
    const mongoose = require('mongoose');

    let attendance = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      attendance = await Attendance.findByIdAndDelete(id);
    } else if (employee_id && month) {
      attendance = await Attendance.findOneAndDelete({ employee_id, month });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid ID. Provide valid _id in path or employee_id and month as query.' });
    }

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get attendance summary by employee
const getAttendanceSummary = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { year } = req.query;

    const filter = { employee_id };
    if (year) {
      filter.month = { $regex: `^${year}` };
    }

    const attendanceRecords = await Attendance.find(filter).sort({ month: 1 });

    const summary = {
      employee_id,
      total_records: attendanceRecords.length,
      total_working_days: attendanceRecords.reduce((sum, record) => sum + record.working_days, 0),
      total_ot_hours: attendanceRecords.reduce((sum, record) => sum + record.ot_hours, 0),
      monthly_breakdown: attendanceRecords.map(record => ({
        month: record.month,
        working_days: record.working_days,
        ot_hours: record.ot_hours,
        total_hours: (record.working_days * 8) + record.ot_hours
      }))
    };

    res.status(200).json({
      success: true,
      message: 'Attendance summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary
};
