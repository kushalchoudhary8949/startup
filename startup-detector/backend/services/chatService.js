import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getChatResponse = async (messages, ideaContext) => {
  const systemPrompt = `You are an expert startup advisor, product strategist, and venture capitalist with 20+ years of experience.

The user has already analyzed their startup idea using Startup Detector. Here is the context of their idea and analysis:

${ideaContext ? JSON.stringify(ideaContext, null, 2) : 'No context provided.'}

Your role now is to be their personal startup advisor. Answer their questions clearly and practically. Be direct, honest, and actionable. 
- If they ask about competitors, give real insights
- If they ask about tech, give specific recommendations  
- If they ask about money/funding, be realistic
- Keep responses concise but valuable — 2-4 paragraphs max
- Use bullet points when listing things
- Always push them toward action`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content.trim();
};