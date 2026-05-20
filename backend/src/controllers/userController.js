import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError, notFound } from '../utils/httpError.js';

export const listUsers = asyncHandler(async (_request, response) => {
  const users = await User.find().sort({ createdAt: -1 });
  response.json(users);
});

export const createUser = asyncHandler(async (request, response) => {
  const { name, email, password, role } = request.body;

  if (!name || !email || !password || !role) {
    throw new HttpError(400, 'Nome, email, senha e perfil sao obrigatorios.');
  }

  const emailExists = await User.exists({ email: email.toLowerCase() });
  if (emailExists) {
    throw new HttpError(409, 'Ja existe um usuario com este email.');
  }

  const user = await User.create({ name, email, password, role });
  response.status(201).json(user);
});

export const updateUser = asyncHandler(async (request, response) => {
  const user = await User.findById(request.params.id);

  if (!user) {
    throw notFound('Usuario nao encontrado.');
  }

  const { name, role, active, password } = request.body;

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (active !== undefined) user.active = active;
  if (password) user.password = password;

  await user.save();
  response.json(user);
});

