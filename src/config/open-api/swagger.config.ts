import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Users API')
  .setDescription('API for managing users')
  .setVersion('0.1')
  .addServer('http://localhost:3000', 'Development server')
  .addTag('User')
  .build();

export default swaggerConfig;
