import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config } from 'dotenv';

config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || '9000';
  app.enableCors();
  await app.listen(PORT, () => {
    console.log(`🚀 Nest server started: http://${HOST}:${PORT}`);
  });
}
bootstrap();
