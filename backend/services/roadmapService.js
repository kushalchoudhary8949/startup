import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getExecutionRoadmap = async (idea, analysis) => {
  const prompt = `You are an expert startup execution coach.

The user wants to build this startup: "${idea}"

${analysis ? `Analysis context: Problem Score: ${analysis.problem_score}/10, Verdict: ${analysis.verdict}, Market Demand: ${analysis.market_demand}` : ''}

Generate a detailed step-by-step EXECUTION roadmap to actually launch this startup. This is NOT a dev roadmap — this is a full business execution plan.

Return ONLY valid raw JSON, no markdown, no extra text:

{
  "phases": [
    {
      "phase": 1,
      "title": "<phase title>",
      "duration": "<e.g. Week 1-2>",
      "goal": "<what you achieve by end of this phase>",
      "color": "<one of: green | purple | yellow | blue>",
      "steps": [
        {
          "step": 1,
          "title": "<step title>",
          "description": "<2-3 sentences on exactly what to do>",
          "action": "<single specific action to take right now>",
          "resources": ["<tool/resource 1>", "<tool/resource 2>"],
          "done": false
        }
      ]
    }
  ],
  "success_metrics": ["<metric 1>", "<metric 2>", "<metric 3>"],
  "first_action": "<the single most important thing to do TODAY to start>"
}

Include 4 phases total:
- Phase 1: Validation (talk to users, confirm problem exists)
- Phase 2: Build (create MVP)  
- Phase 3: Launch (get first users)
- Phase 4: Grow (retention and scale)

Each phase should have 3-4 steps. Be extremely specific and actionable — no generic advice.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a startup execution expert. Respond with valid raw JSON only — no markdown, no commentary.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Roadmap JSON parse failed:\n', raw);
    throw new Error('AI returned invalid JSON. Please try again.');
  }
};