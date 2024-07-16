import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ICourseAttributes {
    id?: number;
    startDate: Date;
    endDate: Date;
    places: number;
    location: string;
    price: number;
    userId?: number;
    levels?: string;
}

interface ICourseCreationAttributes extends Optional<ICourseAttributes, "id"> { }

class Course
    extends Model<ICourseAttributes, ICourseCreationAttributes>
    implements ICourseAttributes {
    public id?: number;
    public startDate!: Date;
    public endDate!: Date;
    public places!: number;
    public location!: string;
    public price!: number;
    public userId?: number;
    public levels?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Course.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        places: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        levels: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: JSON.stringify([]),
            get() {
                const levels = this.getDataValue("levels");
                return levels ? JSON.parse(levels) : [];
            },
            set(value: string[]) {
                this.setDataValue("levels", JSON.stringify(value));
            }
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            },
        }
    },
    {
        sequelize,
        tableName: "course"
    }
);

export default Course;
