// app/api/chat/route.ts
import { auth } from '@clerk/nextjs/server'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Check auth
  const { userId: clerkId } = await auth()
  if (!clerkId) return new Response('Unauthorized', { status: 401 })

  try {
    const { messages } = await req.json();
    
    // Fetch knowledge base entries
    const knowledge = await prisma.knowledgeBase.findMany({
      select: {
        title: true,
        content: true,
        type: true
      }
    });

    // Format knowledge for the prompt
    const knowledgeContext = knowledge
      .map(k => `${k.title}: ${k.content}`)
      .join('\n\n');

    // Prepare system message
    const systemMessage = {
      role: 'system',
      content: `You are an AI Coach for dental practices. Use this knowledge to assist users:
      
${knowledgeContext}

When responding:
1. Use relevant information from the knowledge base
2. Suggest specific resources when appropriate
3. Ask follow-up questions to better understand the user's needs
4. Maintain a professional but friendly tone`
    };

    // Generate response stream
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        systemMessage,
        ...messages,
      ],
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}