import bcrypt from "bcrypt";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Url } from "url";
import { STRING } from "sequelize";

interface IUserAttributes {
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  salt: string;
  locations: string;
  dateOfBirth?: Date;
  roles?: string;
  profilePicture?: string;
  uploadedDocs?: string[];
}

interface IUserCreationAttributes
  extends Optional<IUserAttributes, "id" | "roles"> {}

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
  public locations!: string;
  public dateOfBirth?: Date;
  public roles?: string;
  public profilePicture?: string;
  public uploadedDocs?: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.passwordHash;
  }
}

User.init(
  {
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploadedDocs: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

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
    locations: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: JSON.stringify([]),
      get() {
        const locations = this.getDataValue("locations");
        return locations ? JSON.parse(locations) : [];
      },
      set(value: string[]) {
        this.setDataValue("locations", JSON.stringify(value));
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
