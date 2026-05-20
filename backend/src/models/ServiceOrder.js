import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    fromStatus: String,
    toStatus: String,
    note: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const serviceOrderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'entrada',
        'diagnostico',
        'aguardando_aprovacao',
        'aprovado',
        'rejeitado',
        'em_execucao',
        'aguardando_pagamento',
        'pago',
        'entregue',
        'cancelado',
      ],
      default: 'entrada',
    },
    priority: {
      type: String,
      enum: ['baixa', 'normal', 'alta', 'urgente'],
      default: 'normal',
    },
    intakeNotes: String,
    diagnosis: {
      description: String,
      technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      completedAt: Date,
    },
    budget: {
      description: String,
      partsValue: {
        type: Number,
        default: 0,
      },
      laborValue: {
        type: Number,
        default: 0,
      },
      totalValue: {
        type: Number,
        default: 0,
      },
      approved: {
        type: Boolean,
        default: null,
      },
      decidedAt: Date,
      rejectionReason: String,
    },
    execution: {
      notes: String,
      technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      completedAt: Date,
    },
    payment: {
      status: {
        type: String,
        enum: ['pendente', 'parcial', 'pago'],
        default: 'pendente',
      },
      method: String,
      amountPaid: {
        type: Number,
        default: 0,
      },
      paidAt: Date,
    },
    delivery: {
      deliveredAt: Date,
      deliveredTo: String,
      notes: String,
    },
    history: [historySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

serviceOrderSchema.index({ code: 'text', intakeNotes: 'text' });

export const ServiceOrder = mongoose.model('ServiceOrder', serviceOrderSchema);

