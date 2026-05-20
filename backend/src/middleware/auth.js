import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export async function authenticate(request, _response, next) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer '')) {
      throw new HttpError(401, 'Token de autenticacao nao informado.');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user || !user.active) {
      throw new HttpError(401, 'Usuario nao autorizado.');
    }

    request.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError(401, 'Token invalido ou expirado.'));
  }
}

export function authorize(...roles) {
  return (request, _response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(new HttpError(403, 'Perfil sem permissao para esta acao.'));
    }

    next();
  };
}

