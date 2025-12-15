import express from "express";
import { eqInCity } from "../services/postgisWithin.js";

const withinRouter = express.Router();

withinRouter.get("/analysis/:cityName", async (req, res) => {
    const {cityName} = req.params;

    const geojson = await eqInCity(cityName);
    
    return res.json(geojson)

});

export default withinRouter;