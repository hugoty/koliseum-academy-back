import bcrypt from "bcrypt";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Course from "./course"; // Import the Course model
import Subscription from "./subscription"; // Import the Subscription model

interface IUserAttributes {
    id?: number;
    firstName?: string;
    lastName?: string;
    email: string;
    passwordHash: string;
    salt: string;
    dateOfBirth?: Date;
    subscriptions?: Subscription[];
    roles?: string;
    courses?: Course[];
    sports?: string;
}

interface IUserCreationAttributes
    extends Optional<
        IUserAttributes,
        "id" | "roles" | "subscriptions" | "courses"
    > {}

class User
    extends Model<IUserAttributes, IUserCreationAttributes>
    implements IUserAttributes
{
    public id!: number;
    public firstName?: string;
    public lastName?: string;
    public email!: string;
    public passwordHash!: string;
    public salt!: string;
    public dateOfBirth?: Date;
    public roles?: string;
    public subscriptions?: Subscription[];
    public courses?: Course[];
    public sports?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async checkPassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.passwordHash;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        roles: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: JSON.stringify(["student"]),
            get() {
                const roles = this.getDataValue("roles");
                return roles ? JSON.parse(roles) : [];
            },
            set(value: string[]) {
                this.setDataValue("roles", JSON.stringify(value));
            },
        },
        sports: {
            type: DataTypes.STRING, // Changed to TEXT for JSON storage
            allowNull: true,
            defaultValue: JSON.stringify([""]),
            get() {
                const sports = this.getDataValue("sports");
                return sports ? JSON.parse(sports) : [];
            },
            set(value: string[]) {
                this.setDataValue("sports", JSON.stringify(value));
            },
        },
    },
    {
        sequelize,
        tableName: "user",
        hooks: {
            beforeSave: async (user: User) => {},
        },
    }
);

export default User;
