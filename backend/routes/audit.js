import { Router } from "express";
import { runAudit } from "../services/auditEngine.js";

const router = Router();

router.post("/", async (req, res) => {
  const { projectText } = req.body;

  if (!projectText || projectText.trim().length < 50) {
    return res.status(400).json({ error: "Project description too short." });
  }

  try {
    const result = await runAudit(projectText);
    res.json(result);
  } catch (err) {
    console.error("Audit error:", err);
    res.status(500).json({ error: "Audit failed. Check API key or try again." });
  }
});

export default router;