import express from 'express';
import { getAllAllowances, createAllowance, updateAllowance, deleteAllowance } from '../Controllers/AllowanceController.js';

const router = express.Router();

router.get('/', getAllAllowances);
router.post('/', createAllowance);
router.put('/:id', updateAllowance);
router.delete('/:id', deleteAllowance);

export default router;
