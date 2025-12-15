import express from "express";
import { pool } from "../services/db.js";

const cityNameRouter = express.Router();

cityNameRouter.get("/il-adlari", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT adm1_tr
            FROM il
            ORDER BY adm1_tr
            `
        );
        
        const cities = result.rows.map(
            row => row.adm1_tr
        )
        res.json(cities)

    } catch (err) {
        console.error("İller alınamadı:", err);
        res.status(500).json({ error: "İller alınamadı" });
    }
});

export default cityNameRouter;