import { Customer } from '../models/Customer.js';
import { Device } from '../models/Device.js';
import { ServiceOrder } from '../models/ServiceOrder.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError, notFound } from '../utils/httpError.js';

export const listCustomers = asyncHandler(async (request, response) => {
  const { search = '' } = request.query;
  const filter = search
    ? {
        $or: [
          { name: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { document: new RegExp(search, 'i') },
        ],
      }
    : {};

  const customers = await Customer.find(filter).sort({ createdAt: -1 }).limit(80);
  response.json(customers);
});

export const createCustomer = asyncHandler(async (request, response) => {
  const { name, phone } = request.body;

  if (!name || !phone) {
    throw new HttpError(400, 'Nome e telefone sao obrigatorios.');
  }

  const customer = await Customer.create(request.body);
  response.status(201).json(customer);
});

export const getCustomer = asyncHandler(async (request, response) => {
  const customer = await Customer.findById(request.params.id);

  if (!customer) {
    throw notFound('Cliente nao encontrado.');
  }

  const devices = await Device.find({ customer: customer._id }).sort({ createdAt: -1 });
  const orders = await ServiceOrder.find({ customer: customer._id })
    .populate('device')
    .sort({ createdAt: -1 });

  response.json({ customer, devices, orders });
});

