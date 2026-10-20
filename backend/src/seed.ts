import mongoose, { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { CategorySchema } from './categories/schemas/category.schema';
import { ProductSchema } from './products/schemas/product.schema';
import { UserSchema, Role } from './users/schemas/user.schema';
import { StoreSettingSchema } from './settings/schemas/store-setting.schema';
import {
  StockMovementSchema,
  MovementType,
} from './stock-movements/schemas/stock-movement.schema';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meu-botequim';

export async function runSeed() {
  console.log(`🌱 Conectando ao MongoDB em ${MONGO_URI}...`);
  await mongoose.connect(MONGO_URI);

  const CategoryModel = mongoose.model('Category', CategorySchema);
  const ProductModel = mongoose.model('Product', ProductSchema);
  const UserModel = mongoose.model('User', UserSchema);
  const SettingModel = mongoose.model('StoreSetting', StoreSettingSchema);
  const MovementModel = mongoose.model('StockMovement', StockMovementSchema);

  // 1. Criar Usuário Administrador Padrão
  console.log('👤 Verificando usuário administrador...');
  let admin = await UserModel.findOne({ email: 'admin@meubotequim.com.br' });
  if (!admin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    admin = await UserModel.create({
      name: 'Carlos Drummond',
      email: 'admin@meubotequim.com.br',
      password: passwordHash,
      role: Role.ADMIN,
    });
    console.log(
      '✅ Usuário admin criado: admin@meubotequim.com.br (senha: admin123)',
    );
  } else {
    console.log('ℹ️ Usuário admin já existe.');
  }

  // 2. Configurações da Loja
  console.log('⚙️ Configurando dados da unidade...');
  let setting = await SettingModel.findOne();
  if (!setting) {
    setting = await SettingModel.create({
      storeName: 'MeuBotequim',
      primaryColor: '#C87A5B',
      phone: '(11) 98765-4321',
    });
    console.log('✅ Configurações iniciais criadas.');
  }

  // 3. Categorias Padrão
  console.log('📂 Verificando categorias...');
  const categoriesData = [
    { name: 'Chopp & Cervejas', description: 'Barris, garrafas e long necks' },
    {
      name: 'Destilados Premium',
      description: 'Gins, vodkas e whiskies importados',
    },
    { name: 'Destilados', description: 'Bebidas destiladas padrão' },
    {
      name: 'Insumos de Balcão',
      description: 'Gelo, xaropes, guardanapos e copos',
    },
    {
      name: 'Hortifrúti / Bar',
      description: 'Limões, hortelã, laranjas e frutas frescas',
    },
    {
      name: 'Não Alcoólicos',
      description: 'Refrigerantes, águas, tônicas e energéticos',
    },
    {
      name: 'Cachaças & Artesanais',
      description: 'Cachaças de alambique e artesanais',
    },
  ];

  const categoryMap = new Map<string, Types.ObjectId>();

  for (const cat of categoriesData) {
    let existing = await CategoryModel.findOne({ name: cat.name });
    if (!existing) {
      existing = await CategoryModel.create({
        name: cat.name,
        description: cat.description,
        isActive: true,
      });
      console.log(`✅ Categoria criada: ${cat.name}`);
    }
    categoryMap.set(cat.name, existing._id);
  }

  // 4. Produtos Padrão MeuBotequim
  console.log('🍺 Verificando catálogo de produtos...');
  const productsData = [
    {
      name: 'Chopp Pilsen 50L (Barril)',
      brand: 'Ambev / Brahma',
      category: categoryMap.get('Chopp & Cervejas'),
      currentStock: 1,
      minStock: 4,
      unit: 'barril',
      costPrice: 420.0,
      dayPrice: 650.0,
      eventPrice: 700.0,
      isActive: true,
    },
    {
      name: 'Gin Tanqueray London Dry 750ml',
      brand: 'Diageo',
      category: categoryMap.get('Destilados Premium'),
      currentStock: 2,
      minStock: 6,
      unit: 'gf',
      costPrice: 94.5,
      dayPrice: 149.9,
      eventPrice: 160.0,
      isActive: true,
    },
    {
      name: 'Cerveja Heineken Long Neck 330ml',
      brand: 'Heineken',
      category: categoryMap.get('Chopp & Cervejas'),
      currentStock: 14,
      minStock: 48,
      unit: 'un',
      costPrice: 4.85,
      dayPrice: 12.0,
      eventPrice: 14.0,
      isActive: true,
    },
    {
      name: 'Gelo em Cubos Filtrado (Pacote 5kg)',
      brand: 'Gelo Puro',
      category: categoryMap.get('Insumos de Balcão'),
      currentStock: 3,
      minStock: 15,
      unit: 'pct',
      costPrice: 12.0,
      dayPrice: 20.0,
      eventPrice: 22.0,
      isActive: true,
    },
    {
      name: 'Limão Taiti Selecionado (kg)',
      brand: 'Ceasa Distribuidora',
      category: categoryMap.get('Hortifrúti / Bar'),
      currentStock: 3,
      minStock: 12,
      unit: 'kg',
      costPrice: 6.9,
      dayPrice: 12.0,
      eventPrice: 14.0,
      isActive: true,
    },
    {
      name: 'Vodka Smirnoff Red 998ml',
      brand: 'Diageo',
      category: categoryMap.get('Destilados'),
      currentStock: 4,
      minStock: 8,
      unit: 'gf',
      costPrice: 38.0,
      dayPrice: 65.0,
      eventPrice: 70.0,
      isActive: true,
    },
    {
      name: 'Água Tônica Antarctica Lata 350ml',
      brand: 'Ambev',
      category: categoryMap.get('Não Alcoólicos'),
      currentStock: 16,
      minStock: 30,
      unit: 'un',
      costPrice: 2.45,
      dayPrice: 7.0,
      eventPrice: 8.0,
      isActive: true,
    },
    {
      name: 'Cachaça Salinas Tradicional 700ml',
      brand: 'Salinas',
      category: categoryMap.get('Cachaças & Artesanais'),
      currentStock: 2,
      minStock: 4,
      unit: 'gf',
      costPrice: 44.0,
      dayPrice: 85.0,
      eventPrice: 90.0,
      isActive: true,
    },
    {
      name: 'Cerveja Original 600ml (Caixa c/ 24)',
      brand: 'Ambev',
      category: categoryMap.get('Chopp & Cervejas'),
      currentStock: 32,
      minStock: 24,
      unit: 'cx',
      costPrice: 168.0,
      dayPrice: 288.0,
      eventPrice: 300.0,
      isActive: true,
    },
  ];

  for (const prod of productsData) {
    const existing = await ProductModel.findOne({ name: prod.name });
    if (!existing) {
      const created = await ProductModel.create(prod);
      console.log(`✅ Produto criado: ${prod.name}`);

      // Registrar movimento inicial de estoque
      await MovementModel.create({
        productId: created._id,
        userId: admin._id,
        type: MovementType.ENTRADA,
        quantity: prod.currentStock,
        previousStock: 0,
        newStock: prod.currentStock,
        reason: 'Estoque inicial de implantação MeuBotequim',
      });
    }
  }

  // 5. Registrar movimentações de amostra (perda e saída) para métricas realistas
  const sampleProduct = await ProductModel.findOne({
    name: 'Cerveja Heineken Long Neck 330ml',
  });
  if (sampleProduct) {
    const lossExists = await MovementModel.findOne({
      productId: sampleProduct._id,
      type: MovementType.PERDA,
    });
    if (!lossExists) {
      await MovementModel.create({
        productId: sampleProduct._id,
        userId: admin._id,
        type: MovementType.PERDA,
        quantity: 2,
        previousStock: sampleProduct.currentStock + 2,
        newStock: sampleProduct.currentStock,
        reason: 'Garrafa trincada no recebimento',
      });
      console.log('✅ Registro de perda de exemplo criado.');
    }
  }

  console.log('🎉 Carga de dados (Seed) concluída com sucesso!');
  await mongoose.disconnect();
}

if (require.main === module) {
  runSeed().catch((err) => {
    console.error('❌ Erro ao executar seed:', err);
    process.exit(1);
  });
}
