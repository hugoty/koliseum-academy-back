import sequelize from "../config/database";
import User from "./User"; // Importer le modèle User (assurez-vous du chemin correct)

// Synchronisez tous les modèles avec la base de données
const syncModels = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing models:", error);
        process.exit(1); // Quitte le processus avec un code d'erreur
    }
};

export { sequelize, syncModels };
