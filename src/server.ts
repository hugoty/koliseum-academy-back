import mongoose from "mongoose";
import { app } from "./app";

// mongodb connection
const PORT = process.env.PORT || 3333;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("MONGO_URI is not defined in .env");
    process.exit(1); // Quitte le processus avec un code d'erreur
}

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Could not connect to MongoDB", err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});