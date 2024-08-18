import sequelize from "../config/database";
import Course from "./course";
import CourseSport from "./courseSport";
import Sport from "./sport";
import Subscription from "./subscription";
import User from "./user";
import UserSport from "./userSport";

// Export des modèles pour une utilisation ailleurs dans l'application
const models = {
    User,
    Course,
    Subscription,
    Sport,
    UserSport,
    CourseSport,
};

export { sequelize };
export default models;
