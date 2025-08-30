import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const additionalExpensesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    approved_by: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"], // keeps status controlled
      default: "pending"
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

export default mongoose.model('AdditionalExpenses', additionalExpensesSchema);