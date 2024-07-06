// src/config/database.ts
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("koliseum", "root", "root", {
    host: process.env.DB_HOST || "localhost",
    dialect: "mariadb",
    port: Number(process.env.DB_PORT) || 3306,
    logging: console.log,
});

export default sequelize;
