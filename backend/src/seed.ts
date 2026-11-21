import { PrismaClient, Role, MovementType, TenantPlan } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function runSeed() {
  console.log('🌱 Conectando ao Neon PostgreSQL via Prisma ORM...');
  await prisma.$connect();

  // 1. Criar Tenant Matriz Padrão
  let defaultTenant = await prisma.tenant.findUnique({
    where: { slug: 'meubotequim-matriz' },
  });
  if (!defaultTenant) {
    defaultTenant = await prisma.tenant.create({
      data: {
        name: 'BeerGod - Matriz',
        slug: 'meubotequim-matriz',
        phone: '(11) 98765-4321',
        address: 'Rua dos Boêmios, 142 - Vila Madalena, São Paulo - SP',
        plan: TenantPlan.PRO,
        isActive: true,
        settings: {
          primaryColor: '#C87A5B',
          branchName: 'Balcão Central & Chopperia',
          nightPricingEnabled: true,
          nightPricingStartHour: 0,
          nightPricingEndHour: 6,
          nightPricingAutoMarkupPercent: 20,
          safetyMarginDays: 3,
        },
      },
    });
    console.log('✅ Tenant padrão criado no Neon:', defaultTenant.name);
  }

  // 2. Criar Usuários Padrão (Admin e Proprietário)
  console.log('👤 Verificando usuários iniciais...');
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@meubotequim.com.br' },
  });
  if (!admin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    admin = await prisma.user.create({
      data: {
        name: 'Carlos Drummond',
        email: 'admin@meubotequim.com.br',
        password: passwordHash,
        role: Role.ADMIN,
        tenantId: defaultTenant.id,
      },
    });
    console.log(
      '✅ Usuário admin criado: admin@meubotequim.com.br (senha: admin123)',
    );
  }

  let owner = await prisma.user.findUnique({
    where: { email: 'joao@meubotequim.com.br' },
  });
  if (!owner) {
    const ownerHash = await bcrypt.hash('botequim123', 10);
    owner = await prisma.user.create({
      data: {
        name: 'João Felipe',
        email: 'joao@meubotequim.com.br',
        password: ownerHash,
        role: Role.OWNER,
        tenantId: defaultTenant.id,
      },
    });
    await prisma.tenant.update({
      where: { id: defaultTenant.id },
      data: { ownerId: owner.id },
    });
    console.log(
      '✅ Usuário proprietário criado: joao@meubotequim.com.br (senha: botequim123)',
    );
  }

  // 3. Configurações da Loja
  console.log('⚙️ Configurando dados da unidade...');
  const setting = await prisma.storeSetting.findFirst();
  if (!setting) {
    await prisma.storeSetting.create({
      data: {
        storeName: 'MeuBotequim',
        primaryColor: '#C87A5B',
        phone: '(11) 98765-4321',
        tenantId: defaultTenant.id,
      },
    });
    console.log('✅ Configurações iniciais criadas.');
  }

  // 4. Categorias Completas (Estoque & Cardápio Sarab)
  console.log('📂 Sincronizando categorias no Neon...');
  const categoriesData = [
    {
      name: 'Chopp & Cervejas',
      description: 'Barris de 30L/50L, long necks e garrafas 600ml para giro de balcão',
    },
    {
      name: 'Destilados Premium',
      description: 'Gins, vodkas importadas, whiskies e cachaças envelhecidas',
    },
    {
      name: 'Destilados',
      description: 'Bebidas destiladas padrão para coquetelaria e doses',
    },
    {
      name: 'Insumos de Balcão',
      description: 'Gelo filtrado, xaropes, guardanapos e copos',
    },
    {
      name: 'Hortifrúti / Bar',
      description: 'Limões taiti, hortelã, laranjas e especiarias frescas',
    },
    {
      name: 'Não Alcoólicos',
      description: 'Refrigerantes, águas tônicas, sucos e energéticos',
    },
    {
      name: 'Cachaças & Artesanais',
      description: 'Cachaças de alambique de Salinas e Minas Gerais',
    },
    {
      name: 'Porções & Burgers',
      description: 'Smash burgers artesanais, pizzas de fermentação natural e chapas',
    },
    {
      name: 'Petiscos & Crocantes',
      description: 'Frango crocante Nashville, porções de boteco e tira-gostos',
    },
    {
      name: 'Sobremesas & Café',
      description: 'Petit gâteau, sobremesas artesanais e cafés',
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    let existing = await prisma.category.findFirst({
      where: { name: cat.name },
    });
    if (!existing) {
      existing = await prisma.category.create({
        data: {
          name: cat.name,
          description: cat.description,
          isActive: true,
        },
      });
      console.log(`✅ Categoria criada: ${cat.name}`);
    }
    categoryMap.set(cat.name, existing.id);
  }

  // 5. Catálogo Completo de Produtos & Pratos (Estoque + Cardápio)
  console.log('🍺 Sincronizando catálogo de produtos e pratos no Neon...');
  const productsData = [
    {
      name: 'Chopp Pilsen 50L (Barril)',
      brand: 'Ambev / Brahma',
      categoryId: categoryMap.get('Chopp & Cervejas'),
      currentStock: 1,
      minStock: 4,
      unit: 'barril',
      costPrice: 420.0,
      dayPrice: 650.0,
      nightPrice: 720.0,
      eventPrice: 700.0,
      isActive: true,
    },
    {
      name: 'Gin Tanqueray London Dry 750ml',
      brand: 'Diageo',
      categoryId: categoryMap.get('Destilados Premium'),
      currentStock: 2,
      minStock: 6,
      unit: 'gf',
      costPrice: 94.5,
      dayPrice: 149.9,
      nightPrice: 175.0,
      eventPrice: 160.0,
      isActive: true,
    },
    {
      name: 'Cerveja Heineken Long Neck 330ml',
      brand: 'Heineken',
      categoryId: categoryMap.get('Chopp & Cervejas'),
      currentStock: 14,
      minStock: 48,
      unit: 'un',
      costPrice: 4.85,
      dayPrice: 12.0,
      nightPrice: 15.0,
      eventPrice: 14.0,
      isActive: true,
    },
    {
      name: 'Gelo em Cubos Filtrado (Pacote 5kg)',
      brand: 'Gelo Puro',
      categoryId: categoryMap.get('Insumos de Balcão'),
      currentStock: 3,
      minStock: 15,
      unit: 'pct',
      costPrice: 12.0,
      dayPrice: 20.0,
      nightPrice: 22.0,
      eventPrice: 22.0,
      isActive: true,
    },
    {
      name: 'Limão Taiti Selecionado (kg)',
      brand: 'Ceasa Distribuidora',
      categoryId: categoryMap.get('Hortifrúti / Bar'),
      currentStock: 3,
      minStock: 12,
      unit: 'kg',
      costPrice: 6.9,
      dayPrice: 12.0,
      nightPrice: 14.0,
      eventPrice: 14.0,
      isActive: true,
    },
    {
      name: 'Vodka Smirnoff Red 998ml',
      brand: 'Diageo',
      categoryId: categoryMap.get('Destilados'),
      currentStock: 4,
      minStock: 8,
      unit: 'gf',
      costPrice: 38.0,
      dayPrice: 65.0,
      nightPrice: 78.0,
      eventPrice: 70.0,
      isActive: true,
    },
    {
      name: 'Água Tônica Antarctica Lata 350ml',
      brand: 'Ambev',
      categoryId: categoryMap.get('Não Alcoólicos'),
      currentStock: 16,
      minStock: 30,
      unit: 'un',
      costPrice: 2.45,
      dayPrice: 7.0,
      nightPrice: 9.0,
      eventPrice: 8.0,
      isActive: true,
    },
    {
      name: 'Cachaça Salinas Tradicional 700ml',
      brand: 'Salinas',
      categoryId: categoryMap.get('Cachaças & Artesanais'),
      currentStock: 2,
      minStock: 4,
      unit: 'gf',
      costPrice: 44.0,
      dayPrice: 85.0,
      nightPrice: 98.0,
      eventPrice: 90.0,
      isActive: true,
    },
    {
      name: 'Cerveja Original 600ml (Caixa c/ 24)',
      brand: 'Ambev',
      categoryId: categoryMap.get('Chopp & Cervejas'),
      currentStock: 32,
      minStock: 24,
      unit: 'cx',
      costPrice: 168.0,
      dayPrice: 288.0,
      nightPrice: 320.0,
      eventPrice: 300.0,
      isActive: true,
    },
    {
      name: 'Combo Smash Botequim + Chopp Pilsen',
      brand: 'Cozinha MeuBotequim',
      categoryId: categoryMap.get('Porções & Burgers'),
      currentStock: 28,
      minStock: 15,
      unit: 'un',
      costPrice: 16.5,
      dayPrice: 38.9,
      nightPrice: 44.9,
      eventPrice: 42.0,
      isActive: true,
    },
    {
      name: 'Pizza Artesanal Margherita Royale',
      brand: 'Forno a Lenha',
      categoryId: categoryMap.get('Porções & Burgers'),
      currentStock: 16,
      minStock: 10,
      unit: 'un',
      costPrice: 21.0,
      dayPrice: 54.0,
      nightPrice: 62.0,
      eventPrice: 58.0,
      isActive: true,
    },
    {
      name: 'Frango Crocante Nashville & Mel Picante',
      brand: 'Cozinha MeuBotequim',
      categoryId: categoryMap.get('Petiscos & Crocantes'),
      currentStock: 22,
      minStock: 12,
      unit: 'porção',
      costPrice: 14.2,
      dayPrice: 34.5,
      nightPrice: 39.9,
      eventPrice: 38.0,
      isActive: true,
    },
    {
      name: 'Petit Gâteau de Nutella & Sorvete Artesanal',
      brand: 'Confeitaria Botequim',
      categoryId: categoryMap.get('Sobremesas & Café'),
      currentStock: 14,
      minStock: 8,
      unit: 'un',
      costPrice: 10.5,
      dayPrice: 26.0,
      nightPrice: 29.0,
      eventPrice: 28.0,
      isActive: true,
    },
  ];

  for (const prod of productsData) {
    const existing = await prisma.product.findFirst({
      where: { name: prod.name },
    });
    if (!existing) {
      const created = await prisma.product.create({
        data: prod,
      });
      console.log(`✅ Produto/Prato criado: ${prod.name}`);

      await prisma.stockMovement.create({
        data: {
          productId: created.id,
          userId: admin.id,
          type: MovementType.ENTRADA,
          quantity: prod.currentStock,
          previousStock: 0,
          newStock: prod.currentStock,
          reason: 'Carga inicial de estoque MeuBotequim (Neon Postgres)',
        },
      });
    }
  }

  // 6. Movimentações de Exemplo (Saída e Perda) para KPIs e Gráficos
  const heineken = await prisma.product.findFirst({
    where: { name: 'Cerveja Heineken Long Neck 330ml' },
  });
  if (heineken) {
    const lossExists = await prisma.stockMovement.findFirst({
      where: {
        productId: heineken.id,
        type: MovementType.PERDA,
      },
    });
    if (!lossExists) {
      await prisma.stockMovement.create({
        data: {
          productId: heineken.id,
          userId: admin.id,
          type: MovementType.PERDA,
          quantity: 2,
          previousStock: heineken.currentStock + 2,
          newStock: heineken.currentStock,
          reason: 'Garrafa quebrada durante manuseio no balcão',
        },
      });
      console.log('✅ Registro de perda de exemplo criado.');
    }
  }

  console.log('🎉 Carga completa de dados no Neon PostgreSQL concluída!');
  await prisma.$disconnect();
}

if (require.main === module) {
  runSeed().catch((err) => {
    console.error('❌ Erro ao executar seed no Neon:', err);
    process.exit(1);
  });
}
