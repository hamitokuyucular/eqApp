import express from "express";
import { analysisPointsAddPostgis } from "../services/analysisPointsAddPostgis.js";
import { analyzePoints } from "../services/analyzePoints.js";

const pointAnalysisRouter = express.Router();

pointAnalysisRouter.post("/point-analysis", async (req, res) => {
    try {
        const {points} = req.body;

        if (!points || points.lenght === 0) {
            return res.status(400).json({ error: "Nokta verisi yok"});
        }

        await analysisPointsAddPostgis(points);

        const result = await analyzePoints();
        res.json({
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.log("Hata:", error);
        res.status(500).json({ error: "Noktalar analiz edilemedi!" });
    }
});

export default pointAnalysisRouter;
