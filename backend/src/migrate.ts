/* eslint-disable */
import mongoose from 'mongoose';

const SOURCE_URI =
  process.env.SOURCE_MONGO_URI ||
  'mongodb+srv://admin_bar:A1lMx2PWBp2NHpey@cluster0.rskfl79.mongodb.net/bar-inventory?retryWrites=true&w=majority';

const TARGET_URI =
  process.env.TARGET_MONGO_URI || 'mongodb://127.0.0.1:27017/meu-botequim';

function inferBrand(name: string, categoryName = ''): string {
  const n = name.toLowerCase();
  if (n.includes('jack daniel')) return "Jack Daniel's";
  if (n.includes('rothmans')) return 'Rothmans';
  if (n.includes('camel')) return 'Camel';
  if (n.includes('imperio') || n.includes('império')) return 'Império';
  if (n.includes('brahma')) return 'Ambev / Brahma';
  if (n.includes('amstel')) return 'Heineken / Amstel';
  if (n.includes('heineken')) return 'Heineken';
  if (n.includes('brussels')) return 'Brussels';
  if (n.includes('h2o')) return 'H2OH!';
  if (n.includes('guarana') || n.includes('guaraná'))
    return 'Ambev / Antarctica';
  if (n.includes('smirnoff')) return 'Diageo / Smirnoff';
  if (n.includes('trident')) return 'Trident';
  if (n.includes('papelito')) return 'Papelito';
  if (n.includes('dona flor')) return 'Dona Flor';
  if (n.includes('baronesa')) return 'Baronesa';
  if (n.includes('busca brisa')) return 'Busca Brisa';
  if (n.includes('intencion')) return 'Intencion';
  if (n.includes('chopp de vinho')) return 'Chopp de Vinho';
  if (n.includes('olsk')) return 'Olsk';
  if (n.includes('chillan')) return 'Chillan';
  if (n.includes('salinas')) return 'Salinas';
  if (n.includes('tanqueray')) return 'Diageo / Tanqueray';
  if (
    n.includes('tabaco') ||
    n.includes('seda') ||
    n.includes('isqueiro') ||
    n.includes('charuto')
  ) {
    return 'Tabacaria';
  }
  return categoryName || 'MeuBotequim';
}

async function runMigration() {
  console.log('==================================================');
  console.log('🚀 INICIANDO MIGRAÇÃO: BAR-INVENTORY -> MEU-BOTEQUIM');
  console.log('==================================================');
  console.log(`📡 Origem (Atlas): ${SOURCE_URI.replace(/:[^:]*@/, ':****@')}`);
  console.log(`💾 Destino (Local): ${TARGET_URI}`);

  console.log('\n⏳ Conectando aos bancos de dados...');
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();
  console.log('✅ Conexão estabelecida com sucesso!');

  // 1. Migração de Categorias
  console.log('\n📂 [1/5] Migrando Categorias...');
  const sourceCategories = await sourceConn
    .collection('categories')
    .find({})
    .toArray();
  const categoryMap = new Map<string, string>();

  for (const cat of sourceCategories) {
    categoryMap.set(cat._id.toString(), cat.name);
    await targetConn
      .collection('categories')
      .replaceOne({ _id: cat._id }, cat, { upsert: true });
  }
  console.log(`✅ ${sourceCategories.length} categorias sincronizadas.`);

  // 2. Migração de Usuários
  console.log('\n👥 [2/5] Migrando Usuários...');
  const sourceUsers = await sourceConn.collection('users').find({}).toArray();
  for (const user of sourceUsers) {
    await targetConn
      .collection('users')
      .replaceOne({ _id: user._id }, user, { upsert: true });
  }
  console.log(
    `✅ ${sourceUsers.length} usuários sincronizados (preservando credenciais e roles).`,
  );

  // 3. Migração de Configurações da Loja
  console.log('\n⚙️ [3/5] Migrando Configurações da Loja...');
  const sourceSettings = await sourceConn
    .collection('storesettings')
    .find({})
    .toArray();
  for (const setting of sourceSettings) {
    await targetConn.collection('storesettings').replaceOne(
      { _id: setting._id },
      {
        ...setting,
        storeName: 'MeuBotequim',
      },
      { upsert: true },
    );
  }
  console.log(`✅ ${sourceSettings.length} configurações sincronizadas.`);

  // 4. Migração de Produtos
  console.log('\n🍾 [4/5] Migrando Produtos...');
  const sourceProducts = await sourceConn
    .collection('products')
    .find({})
    .toArray();
  let activeCount = 0;

  for (const prod of sourceProducts) {
    const p = prod as any;
    const catName = p.category
      ? categoryMap.get(p.category.toString()) || ''
      : '';
    const brand = p.brand || inferBrand(p.name, catName);

    const adaptedProduct = {
      ...p,
      brand,
      costPrice: p.costPrice !== undefined ? p.costPrice : 0,
      currentStock: p.currentStock !== undefined ? p.currentStock : 0,
      minStock: p.minStock !== undefined ? p.minStock : 5,
      unit: p.unit || 'un',
    };

    if (p.isActive) {
      activeCount++;
    }

    await targetConn
      .collection('products')
      .replaceOne({ _id: p._id }, adaptedProduct, { upsert: true });
  }
  console.log(
    `✅ ${sourceProducts.length} produtos sincronizados (${activeCount} ativos com cálculo de marca).`,
  );

  // 5. Migração de Movimentações de Estoque
  console.log('\n📊 [5/5] Migrando Movimentações de Estoque...');
  const sourceMovements = await sourceConn
    .collection('stockmovements')
    .find({})
    .toArray();
  for (const mov of sourceMovements) {
    await targetConn
      .collection('stockmovements')
      .replaceOne({ _id: mov._id }, mov, { upsert: true });
  }
  console.log(
    `✅ ${sourceMovements.length} movimentações de estoque sincronizadas.`,
  );

  // Resumo Final
  const finalProducts = await targetConn
    .collection('products')
    .countDocuments();
  const finalCategories = await targetConn
    .collection('categories')
    .countDocuments();
  const finalMovements = await targetConn
    .collection('stockmovements')
    .countDocuments();

  console.log('\n==================================================');
  console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('==================================================');
  console.log(`📦 Total no banco "meu-botequim":`);
  console.log(`   - Produtos cadastrados: ${finalProducts}`);
  console.log(`   - Categorias cadastradas: ${finalCategories}`);
  console.log(`   - Histórico de Movimentações: ${finalMovements}`);
  console.log('==================================================\n');

  await sourceConn.close();
  await targetConn.close();
}

runMigration().catch((err) => {
  console.error('❌ Falha na migração:', err);
  process.exit(1);
});
