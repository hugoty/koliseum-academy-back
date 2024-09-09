import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "koliseum",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    logging: console.log,
  }
);

export default sequelize;
