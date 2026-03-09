import Groq from "groq-sdk";
import { buildPortfolioPrompt } from "../prompts/portfolioPrompt.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function runPortfolioShield(projects) {
  const prompt = buildPortfolioPrompt(projects);

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.2,
  });

  const raw = res.choices[0].message.content.replace(/```json\n?|```/g, "").trim();
  return JSON.parse(raw);
}