export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFound(message = 'Registro nao encontrado.') {
  return new HttpError(404, message);
}

