import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    app.useWebSocketAdapter(new IoAdapter(app));

    const configService = app.get(ConfigService);

    const port = configService.get<number>('PORT') || 3001;

    await app.listen(port, '0.0.0.0');
    logger.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    logger.error('Error during application startup', error.stack);
    process.exit(1); 
  }
}

bootstrap();