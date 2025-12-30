import { pool } from "./db.js";

export async function analysisPointsAddPostgis(points) {
    try {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS temp_user_points (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                geom GEOMETRY(Point, 4326)
            )
            `);
        
        await pool.query('DELETE FROM temp_user_points');

        for (const p of points) {
            await pool.query(
                `
                INSERT INTO 
                    temp_user_points(name, geom)
                VALUES 
                    ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
                `,
                [
                    p.name,
                    p.lon,
                    p.lat
                ]
            );
        }
        console.log(`${points.length} kullanıcı noktaları geçici tabloya eklendi.`)

    } catch (error) {
        console.error('PostGIS veri ekleme hatası:', error);
    }
}