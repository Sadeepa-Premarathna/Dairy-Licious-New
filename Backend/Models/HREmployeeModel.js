import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-()\s]{7,20}$/;

const EmployeeSchema = new mongoose.Schema(
  {
    employee_id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    NIC: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, match: emailRegex, trim: true },
    phone: { type: String, required: true, match: phoneRegex, trim: true },
    role: { type: String, required: true, trim: true },
    date_of_birth: { type: Date, required: true },
    basic_salary: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Resigned', 'On Leave', 'On Probation'],
      default: 'Active'
    },
    department: { type: String, required: true, trim: true },
    join_date: { type: Date, required: true },
    address: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

let Employee;
try {
  // Check if model already exists
  Employee = mongoose.model('Employee');
} catch (error) {
  // Model doesn't exist, create it
  Employee = mongoose.model('Employee', EmployeeSchema, 'employees');
}

export default Employee;
