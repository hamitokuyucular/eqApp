import { pool } from "./db.js";

export async function analyzePoints() {
    try {
        const result = await pool.query(`
            SELECT
                p.id,
                p.name,
                ilce.adm1_tr AS il,
                ilce.adm2_tr AS ilce,
                ROUND(ST_Y(p.geom)::numeric,5) AS lat,
                ROUND(ST_X(p.geom)::numeric,5) AS lon,
                ST_Value(vs.rast, p.geom) AS vs,
                ST_Value(pga.rast, p.geom)/1000 AS pga,
                ST_Value(t.rast, p.geom)/1000 AS hazard,
                nearest.facilities
            FROM temp_user_points p

            LEFT JOIN ilce
                ON ST_Within(p.geom, ilce.geom)

            LEFT JOIN tc_vs30 vs
                ON ST_Intersects(vs.rast, p.geom)

            LEFT JOIN pga_475v2023 pga
                ON ST_Intersects(pga.rast, p.geom)

            LEFT JOIN tehlike_zone t
                ON ST_Intersects(t.rast, p.geom)

            LEFT JOIN LATERAL (
                SELECT json_agg(
                    json_build_object(
                        'tesis_adi', s.tesis_adi,
                        'distance_km', s.distance_km,
                        'il', s.il,
                        'ilce', s.ilce,
                        'mahalle', s.mahalle,
                        'lat', s.lat,
                        'lon', s.lon
                    )
                    ORDER BY s.distance_km
                ) AS facilities
                FROM (
                    SELECT
                        top.tesis_adi,
                        top.il,
                        top.ilce,
                        top.mahalle,
                        ROUND(ST_Y(top.geom)::numeric,5) AS lat,
                        ROUND(ST_X(top.geom)::numeric,5) AS lon,
                        ROUND(
                            (
                                ST_Distance(
                                    p.geom::geography,
                                    top.geom::geography
                                ) / 1000
                            )::numeric, 3
                        ) AS distance_km
                    FROM birlesik_toplanma_v4 top
                    ORDER BY p.geom <-> top.geom
                    LIMIT 3
                ) s
            ) nearest ON true

            ORDER BY p.id
        `);

        return result;
    } catch (error) {
        console.error("Nokta analiz hatası:", error);
        throw error;
    }
}
