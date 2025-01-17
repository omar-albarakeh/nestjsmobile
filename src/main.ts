import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: '*', // Allow all origins (you can restrict this to specific domains)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers)
    });

    // Use WebSocket adapter
    app.useWebSocketAdapter(new IoAdapter(app));

    // Get ConfigService instance
    const configService = app.get(ConfigService);

    // Get port from environment variables or default to 3001
    const port = configService.get<number>('PORT') || 3001;

    // Start the application
    await app.listen(port, '0.0.0.0');
    logger.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    logger.error('Error during application startup', error.stack);
    process.exit(1); // Exit the process with an error code
  }
}

bootstrap();