import { pool } from "./db.js";

export async function aqDataAddPostgis(eqData) {
    try {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS temp_afad_eq (
                event_id VARCHAR(20) PRIMARY KEY,
                rms FLOAT,
                location VARCHAR(100),
                latitude FLOAT,
                longitude FLOAT,
                depth FLOAT,
                magnitude FLOAT,
                country VARCHAR(50),
                province VARCHAR(50),
                district VARCHAR(50),
                neighborhood VARCHAR(50),
                date TIMESTAMP,
                geom GEOMETRY(Point, 4326)
            )
            `
        );
        await pool.query('DELETE FROM temp_afad_eq');

        for (const eq of eqData) {
            await pool.query(
                `
                INSERT INTO temp_afad_eq
                    (
                    event_id, rms, location, latitude, longitude, 
                    depth, magnitude, country, province, district, 
                    neighborhood, date, geom
                    )
                VALUES 
                    (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                    ST_SetSRID(ST_MakePoint($5::float, $4::float), 4326)
                    )
                `,
                [
                    eq.eventID,
                    parseFloat(eq.rms),
                    eq.location,
                    parseFloat(eq.latitude),
                    parseFloat(eq.longitude),
                    parseFloat(eq.depth),
                    parseFloat(eq.magnitude),
                    eq.country,
                    eq.province,
                    eq.district,
                    eq.neighborhood,
                    eq.date
                ]
            );
        }
        console.log(`${eqData.length} deprem geçici tabloya eklendi.`);

    } catch (error) {
        console.error('PostGIS veri ekleme hatası:', error);
    }
}