import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const buildPrompt = (idea) => `
You are an expert startup analyst, venture capitalist, and product strategist with 20+ years of experience evaluating hundreds of startups.

A user has submitted the following startup idea: "${idea}"

Your task is to deeply analyze this idea across three dimensions and return ONLY a valid JSON object — no markdown, no explanation, no extra text. Just raw JSON.

Return this exact JSON structure:

{
  "analysis": {
    "problem_score": <integer 1-10>,
    "problem_score_reason": "<1-2 sentence explanation>",
    "market_demand": "<Low | Medium | High | Very High>",
    "market_demand_detail": "<2-3 sentence analysis of market size and demand trends>",
    "build_complexity": "<Low | Medium | High | Very High>",
    "build_complexity_detail": "<2-3 sentences on technical difficulty and team requirements>",
    "monetization_possibilities": ["<option 1>", "<option 2>", "<option 3>"],
    "risks": [
      { "risk": "<risk title>", "severity": "<Low|Medium|High>", "mitigation": "<short mitigation strategy>" },
      { "risk": "<risk title>", "severity": "<Low|Medium|High>", "mitigation": "<short mitigation strategy>" },
      { "risk": "<risk title>", "severity": "<Low|Medium|High>", "mitigation": "<short mitigation strategy>" }
    ],
    "verdict": "<Good Idea | Needs Improvement | Not Worth Building>",
    "verdict_summary": "<2-3 sentences explaining the final verdict with actionable advice>"
  },
  "competitors": [
    {
      "name": "<competitor name>",
      "description": "<what they do in 1-2 sentences>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "weaknesses": ["<weakness 1>", "<weakness 2>"],
      "market_gap": "<1-2 sentences on what gap this competitor leaves open>"
    },
    {
      "name": "<competitor name>",
      "description": "<what they do in 1-2 sentences>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "weaknesses": ["<weakness 1>", "<weakness 2>"],
      "market_gap": "<1-2 sentences on what gap this competitor leaves open>"
    },
    {
      "name": "<competitor name>",
      "description": "<what they do in 1-2 sentences>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "weaknesses": ["<weakness 1>", "<weakness 2>"],
      "market_gap": "<1-2 sentences on what gap this competitor leaves open>"
    }
  ],
  "mvp_plan": {
    "core_features": ["<feature 1>", "<feature 2>", "<feature 3>", "<feature 4>"],
    "tech_stack": {
      "frontend": "<recommended frontend tech with brief reason>",
      "backend": "<recommended backend tech with brief reason>",
      "database": "<recommended database with brief reason>",
      "ai_ml": "<any AI/ML tools if applicable>",
      "hosting": "<recommended hosting platform>"
    },
    "roadmap": [
      { "week": "Week 1", "title": "<milestone title>", "tasks": ["<task 1>", "<task 2>", "<task 3>"] },
      { "week": "Week 2", "title": "<milestone title>", "tasks": ["<task 1>", "<task 2>", "<task 3>"] },
      { "week": "Week 3", "title": "<milestone title>", "tasks": ["<task 1>", "<task 2>", "<task 3>"] },
      { "week": "Week 4", "title": "<milestone title>", "tasks": ["<task 1>", "<task 2>", "<task 3>"] }
    ],
    "first_version_scope": "<3-4 sentences describing what the first shippable version should do, what to exclude, and who the initial target user is>"
  }
}

Be brutally honest, specific, and commercially minded. If competitors already dominate the space, say so. If the idea has potential, identify the exact niche to target.
`;

export const getStartupAnalysis = async (idea) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in your .env file");
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a startup analysis expert. You always respond with valid, raw JSON only — no markdown fences, no commentary, no extra text.",
      },
      {
        role: "user",
        content: buildPrompt(idea),
      },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const raw = response.choices[0].message.content.trim();
  console.log("Raw Groq response (first 200 chars):", raw.slice(0, 200));

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("JSON parse failed. Full response:\n", raw);
    throw new Error("AI returned invalid JSON. Please try again.");
  }
};