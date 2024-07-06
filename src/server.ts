import { app } from "./app";
import sequelize from "./config/database";

// Configurations
const PORT = process.env.APPLICATION_PORT || 3333;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to MariaDB");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1); // Quitte le processus avec un code d'erreur
    }
};

startServer();
