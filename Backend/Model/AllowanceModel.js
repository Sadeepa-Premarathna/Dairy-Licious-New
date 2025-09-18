import mongoose from 'mongoose';

const allowanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      trim: true
    },
    employeeName: {
      type: String,
      required: true,
      trim: true
    },
    allowanceType: {
      type: String,
      required: true,
      enum: ['Food', 'Travel', 'Bonus'],
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    month: {
      type: String,
      required: true,
      trim: true
    }
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

export default mongoose.model('EmployeeAllowance', allowanceSchema);
