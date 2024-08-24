import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ICourseAttributes {
    id?: number;
    startDate: Date;
    endDate: Date;
    places: number;
    remainingPlaces: number;
    locations: string;
    price: number;
    ownerId?: number;
    levels?: string;
    detail?: string;
}

interface ICourseCreationAttributes extends Optional<ICourseAttributes, "id"> { }

class Course
    extends Model<ICourseAttributes, ICourseCreationAttributes>
    implements ICourseAttributes {
    public id?: number;
    public startDate!: Date;
    public endDate!: Date;
    public places!: number;
    public remainingPlaces!: number;
    public locations!: string;
    public price!: number;
    public ownerId?: number;
    public levels?: string;
    public detail?: string;

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
        remainingPlaces: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        detail: {
            type: DataTypes.STRING,
            allowNull: true,
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
        ownerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
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
        }
    },
    {
        sequelize,
        tableName: "course"
    }
);

export default Course;
