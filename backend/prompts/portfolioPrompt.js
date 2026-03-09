export function buildPortfolioPrompt(projects) {
  const projectList = projects
    .map((p, i) => `Project ${i + 1} — ${p.name}:\n${p.auditSummary}`)
    .join("\n\n");

  return `You are ClimateIQ's PortfolioShield engine. Analyze this portfolio of climate projects for cross-project concentration risk.

PROJECTS:
"""
${projectList}
"""

Run 3 stress-test scenarios and determine which projects survive (true) or fail (false):
- Scenario A: Key government subsidy removed (central or state level)
- Scenario B: Carbon credit prices drop 40%
- Scenario C: Critical raw material / supply chain disrupted

Also identify:
- Concentration risks (e.g., "2 of 3 projects depend on carbon markets")
- A portfolio recommendation

RESPOND ONLY WITH THIS JSON (no markdown):
{
  "scenarios": {
    "A": { "label": "Subsidy Removed", "results": { "Project 1": true, "Project 2": false } },
    "B": { "label": "Carbon Price -40%", "results": { "Project 1": true, "Project 2": false } },
    "C": { "label": "Supply Chain Disruption", "results": { "Project 1": false, "Project 2": true } }
  },
  "concentration_risks": [
    "2 of 3 projects collapse under carbon market stress — over-exposed to voluntary carbon credit pricing."
  ],
  "recommendation": "Replace Project 2 with a project that has direct B2B revenue independent of carbon credits."
}`;
}