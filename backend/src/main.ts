import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import helmet from 'helmet';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Headers de Segurança HTTP via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Gerenciado pela CDN/Vercel
    }),
  );

  // 2. Limite seguro para requisições com dados de imagem em Base64
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // 3. CORS Restrito e Protegido
  const allowedOrigins = [
    'https://meubotequim.com.br',
    'https://www.meubotequim.com.br',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Permite requisições sem origin (ex: chamadas server-to-server, curl, mobile)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Permite origens explicitamente cadastradas ou domínios de preview da Vercel
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          `Origem "${origin}" bloqueada pela política de segurança do MeuBotequim.`,
        ),
      );
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 4. Filtro Global de Exceções e Higienização de Erros
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Validação Estrita de Dados (Whitelist de campos)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 6. Documentação Swagger
  const config = new DocumentBuilder()
    .setTitle('MeuBotequim API')
    .setDescription(
      'Documentação da API de Gestão de Estoque & Balcão para Bares, Botecos e Restaurantes',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 MeuBotequim API rodando na porta ${port}`);
  console.log(
    `📖 Documentação Swagger disponível em: http://localhost:${port}/docs`,
  );
}
void bootstrap();
