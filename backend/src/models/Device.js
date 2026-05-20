import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    type: {
      type: String,
      enum: ['celular', 'notebook', 'tablet', 'outro'],
      required: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    imei: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      trim: true,
    },
    accessories: {
      type: String,
      trim: true,
    },
    problemDescription: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

deviceSchema.index({ brand: 'text', model: 'text', imei: 'text', serialNumber: 'text' });

export const Device = mongoose.model('Device', deviceSchema);

