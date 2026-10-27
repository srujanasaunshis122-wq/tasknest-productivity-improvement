const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

prisma.task.findMany()
  .then(r => { console.log('OK, tasks:', r.length); })
  .catch(e => { console.error('FAIL:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
