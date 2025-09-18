import Allowance from '../Model/AllowanceModel.js';

// Get all allowances with optional filters
const getAllAllowances = async (req, res) => {
  try {
    const { employeeId, month } = req.query;
    const filter = {};

    if (employeeId) {
      filter.employeeId = employeeId;
    }

    if (month) {
      filter.month = month;
    }

    const allowances = await Allowance.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(allowances);
  } catch (error) {
    console.error("Error fetching allowances:", error);
    return res.status(500).json({ message: "Server error while fetching allowances" });
  }
};

// Create a new allowance
const createAllowance = async (req, res) => {
  try {
    const { employeeId, employeeName, allowanceType, amount, month } = req.body;

    // Validation
    if (!employeeId || !employeeName || !allowanceType || amount === undefined || !month) {
      return res.status(400).json({ 
        message: "All fields (employeeId, employeeName, allowanceType, amount, month) are required" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!['Food', 'Travel', 'Bonus'].includes(allowanceType)) {
      return res.status(400).json({ message: "Allowance type must be Food, Travel, or Bonus" });
    }

    const allowance = await Allowance.create({
      employeeId,
      employeeName,
      allowanceType,
      amount,
      month
    });

    return res.status(201).json(allowance);
  } catch (error) {
    console.error("Error creating allowance:", error);
    return res.status(500).json({ message: "Server error while creating allowance" });
  }
};

// Update an existing allowance
const updateAllowance = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, employeeName, allowanceType, amount, month } = req.body;

    // Validation
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (allowanceType && !['Food', 'Travel', 'Bonus'].includes(allowanceType)) {
      return res.status(400).json({ message: "Allowance type must be Food, Travel, or Bonus" });
    }

    const update = {};
    if (employeeId !== undefined) update.employeeId = employeeId;
    if (employeeName !== undefined) update.employeeName = employeeName;
    if (allowanceType !== undefined) update.allowanceType = allowanceType;
    if (amount !== undefined) update.amount = amount;
    if (month !== undefined) update.month = month;

    const updated = await Allowance.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Allowance not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating allowance:", error);
    return res.status(500).json({ message: "Server error while updating allowance" });
  }
};

// Delete an allowance
const deleteAllowance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Allowance.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Allowance not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting allowance:", error);
    return res.status(500).json({ message: "Server error while deleting allowance" });
  }
};

export { getAllAllowances, createAllowance, updateAllowance, deleteAllowance };
