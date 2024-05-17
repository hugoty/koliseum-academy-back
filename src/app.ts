import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Application } from "express";
import userRoutes from "./routes/UserRoutes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// enable cors
app.use(cors());

// Routes
//app.use("/api", userRoutes);

export { app };
