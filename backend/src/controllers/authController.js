import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

function signToken(user) {
  return jwt.sign(
    {
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      subject: String(user._id),
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );
}

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    throw new HttpError(400, 'Informe email e senha.');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError(401, 'Credenciais invalidas.');
  }

  if (!user.active) {
    throw new HttpError(403, 'Usuario desativado.');
  }

  const token = signToken(user);
  user.password = undefined;

  response.json({ token, user });
});

export const me = asyncHandler(async (request, response) => {
  response.json({ user: request.user });
});

