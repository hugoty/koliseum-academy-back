import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Application } from "express";
import models, { sequelize } from "./models";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// enable cors
app.use(cors());

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await sequelize.sync({ force: true }); // 'force: true' recrée les tables à chaque démarrage
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

// Lancer la synchronisation de la base de données
syncDatabase();

// Routes
//app.use("/api", userRoutes);

export { app };
