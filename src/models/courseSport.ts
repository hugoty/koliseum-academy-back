import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Course from "./course";
import Sport from "./sport";

interface ICourseSportAttributes {
    id?: number;
}

interface ICourseSportCreationAttributes extends Optional<ICourseSportAttributes, "id"> { }

class CourseSport extends Model<ICourseSportAttributes, ICourseSportCreationAttributes> implements ICourseSportAttributes {
    public id?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

CourseSport.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        }
    },
    {
        sequelize,
        tableName: "courseSport",
        indexes: [
            {
                unique: true,
                fields: ['courseId', 'sportId']
            }
        ]
    }
);

Course.belongsToMany(Sport, { through: CourseSport, foreignKey: 'courseId' });
Sport.belongsToMany(Course, { through: CourseSport, foreignKey: 'sportId' });

export default CourseSport;
