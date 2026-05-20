import { Customer } from '../models/Customer.js';
import { Device } from '../models/Device.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError, notFound } from '../utils/httpError.js';

export const listDevices = asyncHandler(async (request, response) => {
  const { search = '', customer } = request.query;
  const filter = {};

  if (customer) {
    filter.customer = customer;
  }

  if (search) {
    filter.$or = [
      { brand: new RegExp(search, 'i') },
      { model: new RegExp(search, 'i') },
      { imei: new RegExp(search, 'i') },
      { serialNumber: new RegExp(search, 'i') },
    ];
  }

  const devices = await Device.find(filter).populate('customer').sort({ createdAt: -1 }).limit(100);
  response.json(devices);
});

export const createDevice = asyncHandler(async (request, response) => {
  const { customer, type, brand, model, problemDescription } = request.body;

  if (!customer || !type || !brand || !model || !problemDescription) {
    throw new HttpError(400, 'Cliente, tipo, marca, modelo e problema sao obrigatorios.');
  }

  const customerExists = await Customer.exists({ _id: customer });
  if (!customerExists) {
    throw notFound('Cliente nao encontrado.');
  }

  const device = await Device.create({ ...request.body, createdBy: request.user._id });
  const populatedDevice = await device.populate('customer');
  response.status(201).json(populatedDevice);
});

export const getDevice = asyncHandler(async (request, response) => {
  const device = await Device.findById(request.params.id).populate('customer');

  if (!device) {
    throw notFound('Aparelho nao encontrado.');
  }

  response.json(device);
});

