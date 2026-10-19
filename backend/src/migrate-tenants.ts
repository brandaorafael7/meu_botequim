import mongoose, { Types } from 'mongoose';

async function migrateTenants() {
  const mongoUri =
    process.env.MONGO_URI ||
    'mongodb+srv://admin_bar:A1lMx2PWBp2NHpey@cluster0.rskfl79.mongodb.net/meu-botequim?retryWrites=true&w=majority';

  console.log('🔄 Conectando ao MongoDB para migração Multi-Tenant...');
  const conn = await mongoose.createConnection(mongoUri).asPromise();

  // 1. Criar ou buscar Tenant padrão
  const tenantsCol = conn.collection('tenants');
  let defaultTenant = await tenantsCol.findOne({ slug: 'meubotequim-matriz' });

  if (!defaultTenant) {
    const insertRes = await tenantsCol.insertOne({
      name: 'MeuBotequim Matriz',
      slug: 'meubotequim-matriz',
      plan: 'PRO',
      isActive: true,
      settings: {
        primaryColor: '#C87A5B',
        branchName: 'Salão Central',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    defaultTenant = { _id: insertRes.insertedId, name: 'MeuBotequim Matriz' };
    console.log('✅ Tenant padrão criado:', defaultTenant);
  } else {
    console.log('ℹ️ Tenant padrão já existente:', defaultTenant.name);
  }

  const defaultTenantId = defaultTenant._id;

  // 2. Atualizar Usuários sem tenantId
  const usersCol = conn.collection('users');
  const userRes = await usersCol.updateMany(
    { $or: [{ tenantId: null }, { tenantId: { $exists: false } }] },
    { $set: { tenantId: defaultTenantId, role: 'OWNER' } }
  );
  console.log(`👥 Usuários associados ao tenant padrão: ${userRes.modifiedCount}`);

  // 3. Atualizar Produtos sem tenantId
  const productsCol = conn.collection('products');
  const prodRes = await productsCol.updateMany(
    { $or: [{ tenantId: null }, { tenantId: { $exists: false } }] },
    { $set: { tenantId: defaultTenantId } }
  );
  console.log(`🍾 Produtos associados ao tenant padrão: ${prodRes.modifiedCount}`);

  // 4. Atualizar Categorias sem tenantId
  const categoriesCol = conn.collection('categories');
  const catRes = await categoriesCol.updateMany(
    { $or: [{ tenantId: null }, { tenantId: { $exists: false } }] },
    { $set: { tenantId: defaultTenantId } }
  );
  console.log(`📂 Categorias associadas ao tenant padrão: ${catRes.modifiedCount}`);

  // 5. Atualizar Movimentações sem tenantId
  const movCol = conn.collection('stockmovements');
  const movRes = await movCol.updateMany(
    { $or: [{ tenantId: null }, { tenantId: { $exists: false } }] },
    { $set: { tenantId: defaultTenantId } }
  );
  console.log(`📊 Movimentações associadas ao tenant padrão: ${movRes.modifiedCount}`);

  // 6. Atualizar StoreSettings sem tenantId
  const settingsCol = conn.collection('storesettings');
  const setRes = await settingsCol.updateMany(
    { $or: [{ tenantId: null }, { tenantId: { $exists: false } }] },
    { $set: { tenantId: defaultTenantId } }
  );
  console.log(`⚙️ Configurações associadas ao tenant padrão: ${setRes.modifiedCount}`);

  console.log('🎉 Migração Multi-Tenant finalizada com sucesso!');
  await conn.close();
}

migrateTenants().catch((err) => {
  console.error('❌ Erro na migração de tenants:', err);
  process.exit(1);
});
