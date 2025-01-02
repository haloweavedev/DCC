// app/api/chat/route.ts
import { auth } from '@clerk/nextjs/server'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return new Response('Unauthorized', { status: 401 })

  try {
    const { messages } = await req.json();
    
    // Fetch knowledge base entries
    const knowledge = await prisma.knowledgeBase.findMany({
      select: {
        title: true,
        content: true,
        type: true,
        sourceUrl: true
      }
    });

    // Format knowledge for the prompt
    const knowledgeContext = knowledge
      .map(k => `Source: ${k.title} (${k.type})
Content: ${k.content}
URL: ${k.sourceUrl || 'Internal document'}
---`)
      .join('\n\n');

    // Enhanced system prompt for better RAG emulation
    const systemMessage = {
      role: 'system',
      content: `You are an advanced AI Coach for dental practices with access to a curated knowledge base. You have access to the following resources:

${knowledgeContext}

IMPORTANT INSTRUCTIONS:

1. Response Format:
Always structure your responses in JSON format with these fields:
{
  "relevantSources": [{"title": "Source Title", "type": "Type", "relevance": "Why this source is relevant"}],
  "response": "Your main response text",
  "suggestedResources": ["Additional resource titles"],
  "learningCheck": {
    "question": "A follow-up question to test understanding",
    "options": ["Option A", "Option B", "Option C"],
    "correctAnswer": "The correct option"
  }
}

2. When Responding:
- Always cite which knowledge base sources you're using
- Mention "Based on our [type] resource: [title]" when referencing materials
- Suggest relevant additional resources from the knowledge base
- Include a quick learning check question related to the topic
- If information isn't in the knowledge base, say "While this isn't covered in our current resources, here's my recommendation..."

3. Engagement Style:
- Be professional yet approachable
- Use dental industry-specific terminology
- Show understanding of front office challenges
- Encourage practical application of advice

4. Learning Path Integration:
- Suggest logical next topics based on the current discussion
- Reference available video tutorials when relevant
- Recommend practice exercises or scenarios

Remember: You're demonstrating a sophisticated learning system that combines personalized coaching with structured resources.`
    };

    // Generate response stream with enhanced model parameters
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        systemMessage,
        ...messages,
      ],
      temperature: 0.7, // Balance between creativity and consistency
      maxTokens: 1000, // Allow for detailed responses
      presencePenalty: 0.6, // Encourage diverse responses
      frequencyPenalty: 0.3 // Reduce repetition
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}