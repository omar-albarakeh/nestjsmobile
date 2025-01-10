import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create a logger instance
  const logger = new Logger('Bootstrap');

  try {
    // Create the NestJS application
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: '*', // Allow all origins (update this in production)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
      credentials: true, // Allow credentials (e.g., cookies)
    });

    // Use WebSocket adapter
    app.useWebSocketAdapter(new IoAdapter(app));

    // Get the ConfigService instance
    const configService = app.get(ConfigService);

    // Get the port from environment variables or use a default value
    const port = configService.get<number>('PORT') || 3001;

    // Start the application
    await app.listen(port, '0.0.0.0');

    // Log the application URL
    logger.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    // Log any errors during bootstrap
    logger.error('Error during application startup', error.stack);
    process.exit(1); // Exit the process with an error code
  }
}

// Start the application
bootstrap();