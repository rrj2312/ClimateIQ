import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auditRoutes from "./routes/audit.js";
import portfolioRoutes from "./routes/portfolio.js";

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/audit", auditRoutes);
app.use("/api/portfolio", portfolioRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`ClimateIQ backend running on port ${PORT}`));