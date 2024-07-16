import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Course from "./course";
import { RequestStatus } from "./data";
import User from "./user";

interface ISubscriptionAttributes {
    id?: number;
    status?: string;
}

interface ISubscriptionCreationAttributes extends Optional<ISubscriptionAttributes, "id" | "status"> { }

class Subscription extends Model<ISubscriptionAttributes, ISubscriptionCreationAttributes> implements ISubscriptionAttributes {
    public id?: number;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Subscription.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: Object.values(RequestStatus),
            allowNull: false,
            defaultValue: RequestStatus.Pending,
        }
    },
    {
        sequelize,
        tableName: "subscription",
        indexes: [
            {
                unique: true,
                fields: ['userId', 'courseId']
            }
        ]
    }
);

User.belongsToMany(Course, { through: Subscription, foreignKey: 'userId' });
Course.belongsToMany(User, { through: Subscription, foreignKey: 'courseId' });

export default Subscription;
