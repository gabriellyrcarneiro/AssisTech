import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 3333;

async function bootstrap() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`AssisTech API rodando em http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Falha ao iniciar servidor:', error.message);
  process.exit(1);
});

