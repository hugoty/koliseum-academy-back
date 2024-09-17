import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "koliseum",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true, // Exige une connexion SSL
        rejectUnauthorized: false, // Cela permet de contourner les problèmes de certificat auto-signé, si nécessaire
      },
    },
  }
);

export default sequelize;
