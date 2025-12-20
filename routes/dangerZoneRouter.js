import express from "express";
import axios from "axios";
import config from "../config/default.js";
import { URLSearchParams } from "url";

const dangerZone = express.Router();

dangerZone.get("/danger", async (req, res) => {
    try {
        const geoserverBase = `${config.geoserver.url}/${config.geoserver.workspace}/wms`
        const query = new URLSearchParams(req.query).toString();
        const url = `${geoserverBase}?${query}`;

        const response = await axios.get(url,{
            responseType: 'arraybuffer'
        });
        
        res.set(
            'Content-Type',
            'image/png'
        )
        res.send(response.data);

    } catch (error) {
        console.log("Hata:", error);
        res.status(500).json({ error: "WMS verisi alinamadi!" })
    }
});

export default dangerZone;

console.log("dangerZone içeri aktarıldı");