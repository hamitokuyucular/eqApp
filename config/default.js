import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",

  server: {
    port: Number(process.env.PORT) || 3000
  },

  afadAPI: {
    url: process.env.AFAD_API_URL
  },

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true"
  },

  geoserver: {
    url: process.env.GEOSERVER_URL,
    workspace: process.env.GEOSERVER_WORKSPACE
  }
};

export default config;
