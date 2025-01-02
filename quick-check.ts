// quick-check.ts
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function quickCheck() {
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✓ Connected to database')

    // List all models
    console.log('\nAvailable models:', Object.keys(prisma))

    // Try to access KnowledgeBase
    try {
      // @ts-ignore
      const entries = await prisma.knowledgeBase.findMany({
        select: {
          title: true,
          content: true,
          type: true
        },
        take: 1
      })

      console.log('\nFound KnowledgeBase entries:', entries.length)
      if (entries.length > 0) {
        console.log('Sample entry:', entries[0])
      }
    } catch (modelError: unknown) {
      if (modelError instanceof Error) {
        console.error('\nError accessing KnowledgeBase:', modelError.message);
        console.log('\nTrying to check schema...');
      } else {
        console.error('\nAn unknown error occurred:', modelError);
      }
      
      // Try to check actual database tables
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
      `
      console.log('\nActual database tables:', tables)
    }

  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('\nConnection Error:', e.message);
      console.log('\nPossible solutions:');
      console.log('1. Check if DATABASE_URL is correct in .env');
      console.log('2. Check if KnowledgeBase model is defined in schema.prisma');
      console.log('3. Run: npx prisma generate');
      console.log('4. Run: npx prisma migrate dev');
    } else {
      console.error('\nAn unknown error occurred:', e);
    }
  } finally {
    await prisma.$disconnect()
  }
}

quickCheck()
  .catch(console.error)
  .finally(() => process.exit())