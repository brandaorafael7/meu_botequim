import { PrismaClient, Role, TenantPlan } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function migrateTenants() {
  console.log('🔄 Conectando ao PostgreSQL para migração Multi-Tenant...');
  await prisma.$connect();

  let defaultTenant = await prisma.tenant.findUnique({
    where: { slug: 'meubotequim-matriz' },
  });

  if (!defaultTenant) {
    defaultTenant = await prisma.tenant.create({
      data: {
        name: 'MeuBotequim Matriz',
        slug: 'meubotequim-matriz',
        plan: TenantPlan.PRO,
        isActive: true,
        settings: {
          primaryColor: '#C87A5B',
          branchName: 'Salão Central',
        },
      },
    });
    console.log('✅ Tenant padrão criado:', defaultTenant.name);
  }

  const userRes = await prisma.user.updateMany({
    where: { tenantId: null },
    data: { tenantId: defaultTenant.id, role: Role.OWNER },
  });
  console.log(`👥 Usuários associados ao tenant padrão: ${userRes.count}`);

  console.log('🎉 Migração Multi-Tenant PostgreSQL finalizada com sucesso!');
  await prisma.$disconnect();
}

migrateTenants().catch((err) => {
  console.error('❌ Erro na migração de tenants:', err);
  process.exit(1);
});
