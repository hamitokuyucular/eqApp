import express from "express";
import axios from "axios";
import config from "config";
import { URLSearchParams } from "url";
import { aqDataAddPostgis } from "../services/aqDataAddPostgis.js";

const afadRouter = express.Router();

afadRouter.post("/deprem", async (req, res) => {
    try {
        const baseURL = `${config.afadAPI.url}`
        const params = new URLSearchParams(req.body).toString();
        const response = await axios.get(`${baseURL}?${params}&format=json`);
        const eqData = response.data;

        await aqDataAddPostgis(eqData);
        res.json(eqData);

    } catch (error) {
        console.log("Hata:", error);
        res.status(500).json({error: "AFAD verisi alinamadi!"});
    }
});

export default afadRouter;