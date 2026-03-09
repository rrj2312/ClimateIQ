const API_BASE = "http://localhost:4000/api";

export async function submitAudit(projectText: string) {
  const res = await fetch(`${API_BASE}/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectText }),
  });
  if (!res.ok) throw new Error(`Audit failed: ${res.statusText}`);
  return res.json();
}

export async function submitPortfolioShield(projects: { name: string; summary: string }[]) {
  const res = await fetch(`${API_BASE}/portfolio/shield`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects }),
  });
  if (!res.ok) throw new Error(`PortfolioShield failed: ${res.statusText}`);
  return res.json();
}
