import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import helmet from "helmet";
import sanitizeInput from "./middlewares/sanitizeInput";
import { sequelize } from "./models";
import authRouter from "./routes/authRoutes";
import courseRouter from "./routes/courseRoutes";
import sportRouter from "./routes/sportRoutes";
import subscriptionRouter from "./routes/subscriptionRoutes";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// enable cors
app.use(cors());

// Enable Helmet protection
app.use(helmet());

// Sanitize inputs against code injection
app.use(sanitizeInput);

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await sequelize.sync(); // 'force: true' recrée les tables à chaque démarrage
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

// Lancer la synchronisation de la base de données
syncDatabase();

// Routes
app.use("/course", courseRouter);
app.use("/subscription", subscriptionRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/sport", sportRouter);

export { app };

