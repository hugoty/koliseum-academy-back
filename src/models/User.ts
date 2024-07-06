import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database";

interface IUserAttributes {
    id?: number;
    firstName?: string;
    lastName?: string;
    email: string;
    passwordHash: string;
    salt: string;
    dateOfBirth?: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, "id"> {}

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
    },
    {
        sequelize,
        tableName: "users",
        hooks: {
            beforeSave: async (user: User) => {
                if (user.changed("passwordHash")) {
                    const salt = await bcrypt.genSalt(12);
                    user.salt = salt;
                    user.passwordHash = await bcrypt.hash(
                        user.passwordHash,
                        salt
                    );
                }
            },
        },
    }
);

export default User;
