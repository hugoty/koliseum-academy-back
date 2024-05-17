// src/config/database.ts
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME || "",
    process.env.DB_USER || "",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mariadb",
        port: Number(process.env.DB_PORT) || 3306,
    }
);

export default sequelize;
