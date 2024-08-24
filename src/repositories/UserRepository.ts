import { Op } from "sequelize";
import Course from "../models/course";
import { CoachSearchData } from "../models/data";
import Sport from "../models/sport";
import User from "../models/user";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";

class UserRepository {

    async getAll() {
        return await genericServRepo('userRepository.getAll', 'Error fetching all users', [], async () => {
            const users = await User.findAll();
            return users;
        });
    }

    async searchCoaches(data: CoachSearchData) {
        return await genericServRepo('userRepository.searchCoaches', 'Error searching coaches', [data], async (data) => {
            const where: Record<string, any> = {};
            if (data.name) {
                where[Op.or as any] = [
                    { firstName: { [Op.like]: `%${data.name}%` } },
                    { lastName: { [Op.like]: `%${data.name}%` } }
                ];
            }
            if (data.locations && data.locations.length > 0) {
                where.locations = {
                    [Op.or]: data.locations.map((location: string) => ({
                        [Op.like]: `%${location}%`
                    }))
                };
            }
            const users = await User.findAll({
                where,
                include: [
                    {
                        model: Sport,
                        where: data.sports && data.sports.length > 0 ? {
                            id: { [Op.in]: data.sports }
                        } : undefined,
                        through: {
                            attributes: ['id', 'level']
                        }
                    }
                ]
            });
            return users;
        });
    }

    async create(data: any) {
        return await genericServRepo('userRepository.create', 'Error creating user', [data], async (data) => {
            data = checkAttr(data, 'user', [], ['roles', 'id']);
            const newUser = await User.create(data);
            return newUser;
        });
    }

    async getById(id: number) {
        return await genericServRepo('userRepository.getById', 'Error fetching user', [id], async (id) => {
            const user = await User.findByPk(id, {
                include: [
                    {
                        model: Sport,
                        through: {
                            attributes: ['id', 'level']
                        }
                    },
                    {
                        model: Course,
                        through: {
                            attributes: ['id', 'status']
                        }
                    }
                ]
            });
            if (!user) {
                throw new Error('CODE404: User not found');
            }
            return user;
        });
    }

    async getByEmail(email: string) {
        return await genericServRepo('userRepository.getByEmail', 'Error fetching user by email', [email], async (email) => {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('CODE404: User not found');
            }
            return user;
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('userRepository.update', 'Error updating user', [id, data], async (id, data) => {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('CODE404: User not found');
            }
            data = checkAttr(data, 'user', [], ['roles', 'id']);
            const newUser = { ...user, data };
            await user.update(data);
            return user;
        });
    }

    async delete(id: number) {
        return await genericServRepo('userRepository.delete', 'Error deleting user', [id], async (id) => {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('CODE404: User not found');
            }
            await user.destroy();
            return { message: 'User deleted successfully' };
        });
    }
}

export default new UserRepository();
