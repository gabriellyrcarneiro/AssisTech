import { Customer } from '../models/Customer.js';
import { Device } from '../models/Device.js';
import { ServiceOrder } from '../models/ServiceOrder.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError, notFound } from '../utils/httpError.js';

const populateOrder = [
  { path: 'customer' },
  { path: 'device' },
  { path: 'createdBy', select: 'name role' },
  { path: 'diagnosis.technician', select: 'name role' },
  { path: 'execution.technician', select: 'name role' },
  { path: 'history.user', select: 'name role' },
];

async function buildOrderCode() {
  const count = await ServiceOrder.countDocuments();
  return `OS-${String(count + 1).padStart(5, '0')}`;
}

function addHistory(order, action, user, note, nextStatus) {
  const fromStatus = order.status;
  const toStatus = nextStatus || order.status;

  if (nextStatus) {
    order.status = nextStatus;
  }

  order.history.push({
    action,
    fromStatus,
    toStatus,
    note,
    user: user._id,
  });
}

export const listOrders = asyncHandler(async (request, response) => {
  const { search = '', status, customer } = request.query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (customer) {
    filter.customer = customer;
  }

  if (search) {
    filter.$or = [{ code: new RegExp(search, 'i') }, { intakeNotes: new RegExp(search, 'i') }];
  }

  const orders = await ServiceOrder.find(filter).populate(populateOrder).sort({ createdAt: -1 }).limit(120);
  response.json(orders);
});

export const createOrder = asyncHandler(async (request, response) => {
  const { customer, device, priority = 'normal', intakeNotes = '' } = request.body;

  if (!customer || !device) {
    throw new HttpError(400, 'Cliente e aparelho sao obrigatorios para abrir OS.');
  }

  const customerExists = await Customer.exists({ _id: customer });
  const deviceExists = await Device.exists({ _id: device, customer });

  if (!customerExists || !deviceExists) {
    throw new HttpError(400, 'Cliente ou aparelho invalido para esta OS.');
  }

  const order = await ServiceOrder.create({
    code: await buildOrderCode(),
    customer,
    device,
    priority,
    intakeNotes,
    createdBy: request.user._id,
    history: [
      {
        action: 'OS aberta',
        toStatus: 'entrada',
        note: intakeNotes || 'Equipamento recebido na assistencia.',
        user: request.user._id,
      },
    ],
  });

  response.status(201).json(await order.populate(populateOrder));
});

export const getOrder = asyncHandler(async (request, response) => {
  const order = await ServiceOrder.findById(request.params.id).populate(populateOrder);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  response.json(order);
});

export const updateStatus = asyncHandler(async (request, response) => {
  const { status, note = '' } = request.body;
  const order = await ServiceOrder.findById(request.params.id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  addHistory(order, 'Status alterado', request.user, note, status);
  await order.save();

  response.json(await order.populate(populateOrder));
});

export const saveDiagnosis = asyncHandler(async (request, response) => {
  const { description } = request.body;
  const order = await ServiceOrder.findById(request.params.id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  if (!description) {
    throw new HttpError(400, 'Informe o diagnostico tecnico.');
  }

  order.diagnosis = {
    description,
    technician: request.user._id,
    completedAt: new Date(),
  };

  addHistory(order, 'Diagnostico registrado', request.user, description, 'diagnostico');
  await order.save();

  response.json(await order.populate(populateOrder));
});

export const saveBudget = asyncHandler(async (request, response) => {
  const { description, partsValue = 0, laborValue = 0 } = request.body;
  const order = await ServiceOrder.findById(request.params.id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  const totalValue = Number(partsValue) + Number(laborValue);

  order.budget = {
    description,
    partsValue,
    laborValue,
    totalValue,
    approved: null,
  };

  addHistory(order, 'Orcamento registrado', request.user, description, 'aguardando_aprovacao');
  await order.save();

  response.json(await order.populate(populateOrder));
});

export const decideBudget = asyncHandler(async (request, response) => {
  const { approved, rejectionReason = '' } = request.body;
  const order = await ServiceOrder.findById(request.params.id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  order.budget.approved = Boolean(approved);
  order.budget.decidedAt = new Date();
  order.budget.rejectionReason = approved ? '' : rejectionReason;

  addHistory(
    order,
    approved ? 'Orcamento aprovado' : 'Orcamento rejeitado',
    request.user,
    approved ? 'Cliente aprovou o orcamento.' : rejectionReason,
    approved ? 'aprovado' : 'rejeitado',
  );

  await order.save();
  response.json(await order.populate(populateOrder));
});

export const saveExecution = asyncHandler(async (request, response) => {
  const { notes, completed = false } = request.body;
  const order = await ServiceOrder.findById(request.params.id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  order.execution = {
    notes,
    technician: request.user._id,
    completedAt: completed ? new Date() : undefined,
  };

  addHistory(
    order,
    completed ? 'Servico finalizado' : 'Servico em execucao',
    request.user,
    notes,
    completed ? 'aguardando_pagamento' : 'em_execucao',
  );

  await order.save();
  response.json(await order.populate(populateOrder));
});

export const registerPayment = asyncHandler(async (request, response) => {
  const { amountPaid = 0, method = 'dinheiro' } = request.body;
  const order = await ServiceOrder.findById(request.params.id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  const total = order.budget?.totalValue || 0;
  const paid = Number(amountPaid);
  const paymentStatus = total > 0 && paid < total ? 'parcial' : 'pago';

  order.payment = {
    status: paymentStatus,
    method,
    amountPaid: paid,
    paidAt: new Date(),
  };

  addHistory(order, 'Pagamento registrado', request.user, `Pagamento via ${method}`, paymentStatus === 'pago' ? 'pago' : order.status);

  await order.save();
  response.json(await order.populate(populateOrder));
});

export const confirmDelivery = asyncHandler(async (request, response) => {
  const { deliveredTo, notes = '' } = request.body;
  const order = await ServiceOrder.findById(request.params.id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  order.delivery = {
    deliveredAt: new Date(),
    deliveredTo,
    notes,
  };

  addHistory(order, 'Aparelho entregue', request.user, notes || `Entregue para ${deliveredTo}`, 'entregue');

  await order.save();
  response.json(await order.populate(populateOrder));
});

