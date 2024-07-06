import sequelize from "../config/database";
import User from "./User";

// Export des modèles pour une utilisation ailleurs dans l'application
const models = {
    User,
};

export { sequelize };
export default models;
