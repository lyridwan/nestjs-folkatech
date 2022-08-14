import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { VALIDATION_PIPE_OPTIONS } from './shared/constants';
import { HttpResponseInterceptor } from './shared/interceptors/http-response';
import { RequestIdMiddleware } from './shared/middlewares/request-id/request-id.middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.enableCors();

  const swaggerDescription = `
  Paginations Meta Response:\n
  \`data.items\`: An array of SomeEntity\n
  \`meta.page\`: The current page this paginator "points" to\n
  \`meta.limit\`: The requested items per page (i.e., the \`limit\` parameter)\n
  \`meta.count\`: The total amount of SomeEntity matching the filter conditions\n`;

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Hakku Dashboard Service')
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: 0 },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
