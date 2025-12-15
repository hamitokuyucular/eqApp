import { pool } from "./db.js";

export async function eqInCity(cityName) {
    try {
        const result = await pool.query(`
            SELECT 
                e.*,
                ST_X(e.geom) AS lon,
                ST_Y(e.geom) AS lat
            FROM temp_afad_eq e
            JOIN il i
            ON ST_Within(e.geom, i.geom)
            WHERE i.adm1_tr = $1
            ORDER BY e.date DESC
        `, [cityName]);

        console.log(`📌 ${cityName} ilindeki depremler.`);

        return {
            type: "FeatureCollection",
            features: result.rows.map(row => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [row.lon, row.lat]
                },
                properties: {
                    eventID: row.event_id,
                    country: row.country,
                    location: row.location,
                    province: row.province,
                    district: row.district,
                    magnitude: row.magnitude,
                    depth: row.depth,
                    date: row.date,
                    rms: row.rms
                }
            }))
        };


    } catch (error) {
        console.error("Belirli ilde deprem sorgusu hatası:", error);
    }
}
