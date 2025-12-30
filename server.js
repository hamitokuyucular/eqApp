import express from "express";
import config from "./config/default.js";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";

import afadRouter from "./routes/afadRouter.js";
import cityRouter from "./routes/cityRouter.js";
import fayRouter from "./routes/fayRouter.js";
import cityNameRouter from "./routes/CityNameRouter.js";
import withinRouter from "./routes/withinRouter.js";
import vs30Router from "./routes/vs30Router.js";
import pgaRouter from "./routes/pgaRouter.js";
import dangerZone from "./routes/dangerZoneRouter.js";
import pointAnalysisRouter from "./routes/pointAnalysisRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", afadRouter);
app.use("/api", cityRouter);
app.use("/api", fayRouter);
app.use("/api", cityNameRouter);
app.use("/api", withinRouter);
app.use("/api", vs30Router);
app.use("/api", pgaRouter);
app.use("/api", dangerZone);
app.use("/api", pointAnalysisRouter)

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", env: config.env });
});

app.listen(config.server.port, () => {
    console.log(
        `Server running on port ${config.server.port} (${config.env})`
    );
});