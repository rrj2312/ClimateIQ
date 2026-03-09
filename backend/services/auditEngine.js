import Groq from "groq-sdk";
import dotenv from "dotenv";
import { buildAuditPrompt } from "../prompts/auditPrompt.js";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function runAudit(projectText) {
  const prompt = buildAuditPrompt(projectText);

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.2,
  });

  const raw = res.choices[0].message.content.replace(/```json\n?|```/g, "").trim();
  return JSON.parse(raw);
}