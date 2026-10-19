import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, Role } from '../src/users/schemas/user.schema';
import {
  Category,
  CategoryDocument,
} from '../src/categories/schemas/category.schema';
import {
  Product,
  ProductDocument,
} from '../src/products/schemas/product.schema';
import { JwtService } from '@nestjs/jwt';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

interface ProductResponseBody {
  _id: string;
  name: string;
  dayPrice: number;
  eventPrice?: number;
  costPrice?: number;
  currentStock: number;
  minStock: number;
  unit: string;
  message?: string | string[];
}

describe('Products Flow (E2E)', () => {
  let app: INestApplication;
  let server: Parameters<typeof request>[0];
  let adminToken: string;
  let employeeToken: string;
  let userModel: Model<UserDocument>;
  let categoryModel: Model<CategoryDocument>;
  let productModel: Model<ProductDocument>;
  let adminUserId: Types.ObjectId;
  let employeeUserId: Types.ObjectId;
  let testCategoryId: Types.ObjectId;
  let createdProductId: string;

  const uniquePrefix = `prod_e2e_${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    const rawServer: unknown = app.getHttpServer();
    server = rawServer as Parameters<typeof request>[0];

    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    categoryModel = app.get<Model<CategoryDocument>>(
      getModelToken(Category.name),
    );
    productModel = app.get<Model<ProductDocument>>(getModelToken(Product.name));
    const jwtService = app.get(JwtService);

    adminUserId = new Types.ObjectId();
    await userModel.create({
      _id: adminUserId,
      name: 'Admin Teste E2E',
      email: `${uniquePrefix}_admin@bar.com`,
      password: 'hash_fake_para_teste',
      role: Role.ADMIN,
      isActive: true,
    });

    employeeUserId = new Types.ObjectId();
    await userModel.create({
      _id: employeeUserId,
      name: 'Employee Teste E2E',
      email: `${uniquePrefix}_emp@bar.com`,
      password: 'hash_fake_para_teste',
      role: Role.EMPLOYEE,
      isActive: true,
    });

    testCategoryId = new Types.ObjectId();
    await categoryModel.create({
      _id: testCategoryId,
      name: `${uniquePrefix}_Cat`,
      isActive: true,
    });

    adminToken = jwtService.sign(
      {
        sub: adminUserId.toString(),
        email: `${uniquePrefix}_admin@bar.com`,
        role: Role.ADMIN,
      },
      { secret: process.env.JWT_SECRET || 'chave_super_secreta_jwt_bar_2026' },
    );

    employeeToken = jwtService.sign(
      {
        sub: employeeUserId.toString(),
        email: `${uniquePrefix}_emp@bar.com`,
        role: Role.EMPLOYEE,
      },
      { secret: process.env.JWT_SECRET || 'chave_super_secreta_jwt_bar_2026' },
    );
  });

  afterAll(async () => {
    await userModel.deleteMany({ email: new RegExp(uniquePrefix, 'i') });
    await categoryModel.deleteMany({ name: new RegExp(uniquePrefix, 'i') });
    await productModel.deleteMany({ name: new RegExp(uniquePrefix, 'i') });
    await app.close();
  });

  it('deve cadastrar um produto completo vinculado a categoria (POST /products)', async () => {
    const res = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `${uniquePrefix}_Whisky 12 Anos`,
        category: testCategoryId.toString(),
        dayPrice: 150,
        eventPrice: 160,
        costPrice: 120,
        currentStock: 10,
        minStock: 2,
        unit: 'garrafa',
      });

    const body = res.body as ProductResponseBody;
    expect(res.status).toBe(201);
    expect(body).toHaveProperty('_id');
    expect(body.name).toBe(`${uniquePrefix}_Whisky 12 Anos`);
    expect(body.eventPrice).toBe(160);
    expect(body.costPrice).toBe(120);
    createdProductId = body._id;
  });

  it('deve rejeitar criação de produto com categoria em formato inválido com 400 Bad Request', async () => {
    const res = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `${uniquePrefix}_Invalido`,
        category: 'categoria-invalida-123',
        dayPrice: 50,
        currentStock: 5,
      });

    expect(res.status).toBe(400);
  });

  it('deve listar todos os produtos ativos (GET /products)', async () => {
    const res = await request(server)
      .get('/products')
      .set('Authorization', `Bearer ${employeeToken}`);

    expect(res.status).toBe(200);
    const body = res.body as ProductResponseBody[];
    expect(Array.isArray(body)).toBe(true);
    const found = body.some((p) => p._id === createdProductId);
    expect(found).toBe(true);
  });

  it('deve buscar produto pelo ID válido (GET /products/:id)', async () => {
    const res = await request(server)
      .get(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${employeeToken}`);

    const body = res.body as ProductResponseBody;
    expect(res.status).toBe(200);
    expect(body._id).toBe(createdProductId);
  });

  it('deve rejeitar busca com ID malformado com 400 Bad Request via ParseObjectIdPipe', async () => {
    const res = await request(server)
      .get('/products/abc-nao-e-id')
      .set('Authorization', `Bearer ${employeeToken}`);

    const body = res.body as { message: string | string[] };
    expect(res.status).toBe(400);
    expect(body.message).toContain(
      'ID informado possui formato inválido para o MongoDB.',
    );
  });

  it('deve atualizar o produto como ADMIN (PATCH /products/:id)', async () => {
    const res = await request(server)
      .patch(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        dayPrice: 175,
      });

    const body = res.body as ProductResponseBody;
    expect(res.status).toBe(200);
    expect(body.dayPrice).toBe(175);
  });

  it('deve desativar o produto como ADMIN (DELETE /products/:id)', async () => {
    const res = await request(server)
      .delete(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });
});
