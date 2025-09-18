import express from 'express';
import { 
  getAllEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  checkEmployeeId,
  checkNIC,
  checkEmail
} from '../Controllers/HREmployeeController.js';

const router = express.Router();

// Standard CRUD routes
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

// Validation check routes (for frontend async validation)
router.get('/check-employee-id/:employee_id', checkEmployeeId);
router.get('/check-nic/:nic', checkNIC);
router.get('/check-email/:email', checkEmail);

export default router;
