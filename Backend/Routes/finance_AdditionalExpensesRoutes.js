import express from 'express';
import { getAllAdditionalExpenses, createAdditionalExpense, updateAdditionalExpense, deleteAdditionalExpense } from '../Controllers/finance_AdditionalExpensesController.js';
const router = express.Router();

router.get('/', getAllAdditionalExpenses);
router.post('/', createAdditionalExpense);
router.put('/:id', updateAdditionalExpense);
router.delete('/:id', deleteAdditionalExpense);
export default router;

//sdfghjkdfghj