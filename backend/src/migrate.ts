import { runSeed } from './seed';

async function runMigration() {
  console.log('🚀 Executando sincronização de schema e dados no PostgreSQL...');
  await runSeed();
}

runMigration().catch((err) => {
  console.error('❌ Falha na migração:', err);
  process.exit(1);
});
