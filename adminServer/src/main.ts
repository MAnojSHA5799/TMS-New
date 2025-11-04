import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS Configuration (IMPORTANT FIX)
  app.enableCors({
    origin: 'http://localhost:3000', // your React app's origin
    credentials: true,               // allow cookies or Authorization headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Global API prefix
  app.setGlobalPrefix('api');

  // ✅ Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Swagger (OpenAPI) Setup
  const config = new DocumentBuilder()
    .setTitle('GullySystem Fleet Management Admin APIs')
    .setDescription('API documentation for Fleet Management backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ✅ Optional Health Route
  app.getHttpAdapter().get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      message: 'Fleet Management Admin Backend is running 🚀',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.log(`✅ Server running: http://localhost:${port}/api`);
  console.log(`✅ Swagger docs:  http://localhost:${port}/docs`);
  console.log(`✅ Health check:  http://localhost:${port}/health`);
}

bootstrap();
