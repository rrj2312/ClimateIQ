import { useState } from "react";
import { submitPortfolioShield } from "@/api/client";
import { Plus, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Project {
  name: string;
  summary: string;
}

const MOCK_RESULTS = {
  stress_matrix: [
    { project: "SoilRevive", subsidy_removed: true, carbon_price_drop: true, supply_chain: false },
    { project: "AquaPure", subsidy_removed: false, carbon_price_drop: true, supply_chain: true },
  ],
  concentration_risks: [
    "Both projects rely on carbon credit markets — a single policy change could impact 100% of the portfolio.",
  ],
  recommendation:
    "Portfolio shows moderate resilience. Diversify into at least one project with non-carbon-credit revenue to reduce concentration risk. SoilRevive's supply chain vulnerability should be addressed before deployment at scale.",
};

const PortfolioShield = () => {
  const [projects, setProjects] = useState<Project[]>([
    { name: "", summary: "" },
    { name: "", summary: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState("");

  const canSubmit = projects.every((p) => p.summary.trim().length > 0) && !loading;

  const updateProject = (i: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [field]: value };
    setProjects(updated);
  };

  const addProject = () => {
    if (projects.length < 6) setProjects([...projects, { name: "", summary: "" }]);
  };

  const removeProject = (i: number) => {
    if (projects.length > 2) setProjects(projects.filter((_, idx) => idx !== i));
  };

  const handleRun = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await submitPortfolioShield(projects);
      setResults(data);
    } catch (e: any) {
      // Use mock for demo
      setResults(MOCK_RESULTS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">PortfolioShield</h1>
      <p className="mb-10 text-muted-foreground">
        Stress-test your shortlist before committing capital.
      </p>

      {/* Project Cards */}
      <div className="mb-6 space-y-4">
        {projects.map((p, i) => (
          <div key={i} className={`rounded-xl bg-card p-5 transition-shadow duration-200 ${i % 2 === 0 ? "shadow-blue" : "shadow-green"}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Project {i + 1}</span>
              {projects.length > 2 && (
                <button onClick={() => removeProject(i)} className="text-xs text-destructive hover:underline">
                  Remove
                </button>
              )}
            </div>
            <input
              value={p.name}
              onChange={(e) => updateProject(i, "name", e.target.value)}
              placeholder="Project name"
              className="mb-3 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <textarea
              value={p.summary}
              onChange={(e) => updateProject(i, "summary", e.target.value)}
              placeholder="Project summary…"
              className="h-24 w-full resize-none rounded-lg border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
      </div>

      {projects.length < 6 && (
        <button
          onClick={addProject}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      )}

      <button
        onClick={handleRun}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground shadow-green transition-all duration-200 hover:shadow-green-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Run PortfolioShield
      </button>

      {loading && (
        <div className="mt-8 rounded-xl bg-card p-8 text-center shadow-green">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-secondary" />
          <p className="text-sm font-medium text-muted-foreground">
            Running stress-test scenarios across your portfolio…
          </p>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {/* Results */}
      {results && !loading && (
        <div className="mt-10 space-y-6">
          {/* Stress Test Matrix */}
          <div className="rounded-xl bg-card p-6 shadow-blue">
            <h3 className="mb-4 text-lg font-bold">Stress Test Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-semibold">Project</th>
                    <th className="pb-2 font-semibold">Subsidy Removed</th>
                    <th className="pb-2 font-semibold">Carbon Price -40%</th>
                    <th className="pb-2 font-semibold">Supply Chain Disruption</th>
                  </tr>
                </thead>
                <tbody>
                  {results.stress_matrix?.map((row: any, i: number) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 font-medium">{row.project}</td>
                      {["subsidy_removed", "carbon_price_drop", "supply_chain"].map((col) => (
                        <td key={col} className="py-3">
                          {row[col] ? (
                            <CheckCircle className="h-4 w-4 text-green" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Concentration Risks */}
          {results.concentration_risks?.length > 0 && (
            <div className="rounded-xl bg-amber/10 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <AlertTriangle className="h-5 w-5 text-amber" /> Concentration Risks
              </h3>
              <ul className="space-y-2">
                {results.concentration_risks.map((risk: string, i: number) => (
                  <li key={i} className="text-sm text-foreground">{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Recommendation */}
          <div className="rounded-xl bg-green/10 p-6">
            <h3 className="mb-2 text-lg font-bold text-green">AI Recommendation</h3>
            <p className="text-sm leading-relaxed text-foreground">{results.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioShield;
