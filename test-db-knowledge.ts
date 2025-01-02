// test-db-knowledge.ts
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

interface KnowledgeBaseEntry {
  title: string;
  type: string;
  content?: string;
  sourceUrl?: string;
  addedBy: string;
  createdAt: string; // or Date, depending on your data type
}

async function main() {
  try {
    // Fetch all knowledge base entries
    const entries: KnowledgeBaseEntry[] = await prisma.knowledgeBase.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('=== Knowledge Base Entries ===');
    entries.forEach((entry: KnowledgeBaseEntry) => {
      console.log('\n---');
      console.log('Title:', entry.title);
      console.log('Type:', entry.type);
      console.log('Content:', entry.content ? entry.content.substring(0, 100) + '...' : 'No content');
      console.log('Source URL:', entry.sourceUrl || 'None');
      console.log('Added by:', entry.addedBy);
      console.log('Created:', entry.createdAt);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();