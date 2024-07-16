import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Level } from "./data";
import Sport from "./sport";
import User from "./user";

interface IUserSportAttributes {
    id?: number;
    level?: string;
}

interface IUserSportCreationAttributes extends Optional<IUserSportAttributes, "id" | "level"> { }

class UserSport extends Model<IUserSportAttributes, IUserSportCreationAttributes> implements IUserSportAttributes {
    public id?: number;
    public level!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

UserSport.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        level: {
            type: DataTypes.ENUM,
            values: Object.values(Level),
            allowNull: false,
            defaultValue: Level.Beginner,
        }
    },
    {
        sequelize,
        tableName: "userSport",
        indexes: [
            {
                unique: true,
                fields: ['userId', 'sportId']
            }
        ]
    }
);

User.belongsToMany(Sport, { through: UserSport, foreignKey: 'userId' });
Sport.belongsToMany(User, { through: UserSport, foreignKey: 'sportId' });

export default UserSport;
