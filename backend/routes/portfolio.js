import { Router } from "express";
import { runPortfolioShield } from "../services/portfolioShield.js";

const router = Router();

// Body: { projects: [{ name, auditSummary }] }
router.post("/shield", async (req, res) => {
  const { projects } = req.body;

  if (!projects || projects.length < 2) {
    return res.status(400).json({ error: "Provide at least 2 projects." });
  }

  try {
    const result = await runPortfolioShield(projects);
    res.json(result);
  } catch (err) {
    console.error("Portfolio shield error:", err);
    res.status(500).json({ error: "Portfolio analysis failed." });
  }
});

export default router;