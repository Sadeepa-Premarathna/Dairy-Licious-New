import AdditionalExpenses from '../Model/AdditionalExpensesModel.js';

// Get all additional expenses
const getAllAdditionalExpenses = async (req, res) => {
  try {
    const additionalExpenses = await AdditionalExpenses.find().sort({ date: -1 });
    return res.status(200).json(additionalExpenses);
  } catch (error) {
    console.error("Error fetching additional expenses:", error);
    return res.status(500).json({ message: "Server error while fetching additional expenses" });
  }
};

// Create a new additional expense
const createAdditionalExpense = async (req, res) => {
  try {
    const { category, description, date, amount, approved_by, status } = req.body;

    if (!category || !date || amount === undefined) {
      return res.status(400).json({ message: "'category', 'date', and 'amount' are required" });
    }

    const expense = await AdditionalExpenses.create({
      category,
      description,
      date: new Date(date),
      amount,
      approved_by: approved_by || null,
      status: status || undefined
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating additional expense:", error);
    return res.status(500).json({ message: "Server error while creating additional expense" });
  }
};

// Update an existing additional expense
const updateAdditionalExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, date, amount, approved_by, status } = req.body;

    const update = {};
    if (category !== undefined) update.category = category;
    if (description !== undefined) update.description = description;
    if (date !== undefined) update.date = new Date(date);
    if (amount !== undefined) update.amount = amount;
    if (approved_by !== undefined) update.approved_by = approved_by;
    if (status !== undefined) update.status = status;

    const updated = await AdditionalExpenses.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating additional expense:", error);
    return res.status(500).json({ message: "Server error while updating additional expense" });
  }
};

// Delete an additional expense
const deleteAdditionalExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AdditionalExpenses.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting additional expense:", error);
    return res.status(500).json({ message: "Server error while deleting additional expense" });
  }
};

export { getAllAdditionalExpenses, createAdditionalExpense, updateAdditionalExpense, deleteAdditionalExpense };