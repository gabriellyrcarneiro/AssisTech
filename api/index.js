import 'dotenv/config';
import { app, usesDemoApi } from '../backend/src/app.js';
import { connectDatabase } from '../backend/src/config/database.js';

let databasePromise;

export default async function handler(request, response) {
  try {
    if (!usesDemoApi) {
      databasePromise ||= connectDatabase();
      await databasePromise;
    }

    return app(request, response);
  } catch (error) {
    console.error('Falha na funcao serverless:', error.message);
    return response.status(500).json({
      message: 'Nao foi possivel iniciar a API do AssisTech.',
    });
  }
}
