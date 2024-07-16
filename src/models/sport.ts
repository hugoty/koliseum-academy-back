import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ISportAttributes {
    id?: number;
    name: string;
    description: string;
}

interface ISportCreationAttributes extends Optional<ISportAttributes, "id"> { }

class Sport
    extends Model<ISportAttributes, ISportCreationAttributes>
    implements ISportAttributes {
    public id?: number;
    public name!: string;
    public description!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Sport.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "sport"
    }
);

export default Sport;
