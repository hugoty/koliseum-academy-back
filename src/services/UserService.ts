import bcrypt from 'bcrypt';
import { CoachSearchData, Role } from '../models/data';
import Sport from '../models/sport';
import courseRepository from "../repositories/courseRepository";
import userRepository from "../repositories/userRepository";
import userSportRepository from '../repositories/userSportRepository';
import { checkAttr, checkEmail, isCoach } from "../utils/checks";
import { genericServRepo } from "../utils/error";
import userSportService from './userSportService';

class UserService {

    async getAll() {
        return await genericServRepo('userService.getAll', 'Error fetching all users', [], async () => {
            const users = await userRepository.getAll();
            return users;
        });
    }

    async searchCoaches(data: CoachSearchData) {
        return await genericServRepo('userService.searchCoaches', 'Error searching coaches', [], async () => {
            const coaches = await userRepository.searchCoaches(data);
            return coaches;
        });
    }

    async create(data: any) {
        return await genericServRepo('userService.create', 'Error creating user', [data], async (data) => {
            try {
                checkAttr(data, 'user', ['email', 'password']);
                checkEmail(data.email);
                const existingUser = await userRepository.getByEmail(data.email);
                if (existingUser) throw new Error('CODE400: Email already used');
            } catch (error: any) {
                if (!error.message.includes('User not found')) {
                    throw error;
                }
            }

            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(data.password, salt);

            // Add passwordHash and salt to the user data
            data.passwordHash = passwordHash;
            data.salt = salt;
            delete data.password;

            const newUser = await userRepository.create(data);
            return newUser;
        });
    }

    async getById(id: number, publicProfile = true) {
        return await genericServRepo('userService.getById', 'Error fetching user', [id], async (id) => {
            const user = await userRepository.getById(id);
            let res = user.dataValues;
            if (publicProfile) res = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName
            };
            if (user.roles.includes(Role.Coach)) {
                res.Sports = user.Sports;
                res.ownedCourses = await courseRepository.getCoachCourses(user.id);
            }
            return res;
        });
    }

    async grantCoachRole(id: number) {
        return await genericServRepo('userService.grantCoachRole', 'Error granting coach role', [id], async (id) => {
            const user = await userRepository.getById(id);
            if (isCoach(user)) throw new Error('CODE400: User is already a coach');
            await userRepository.update(id, { ...user, roles: user.roles.concat([Role.Coach]) });
            return { message: "User deleted successfully" };
        });
    }

    async revokeCoachRole(id: number) {
        return await genericServRepo('userService.revokeCoachRole', 'Error revoking coach role', [id], async (id) => {
            const user = await userRepository.getById(id);
            if (!isCoach(user)) throw new Error('CODE400: User is already not a coach');
            await userRepository.update(id, { ...user, roles: user.roles.filter((role: Role) => role !== Role.Coach) });
            return { message: "User deleted successfully" };
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('userService.update', 'Error updating user', [id, data], async (id, data) => {
            if (data.email) checkEmail(data.email);
            if (
                'sports' in data &&
                Array.isArray(data.sports)
            ) {
                const user = await this.getById(id, false);
                for (const sport of data.sports) {
                    if (!('id' in sport) || typeof sport.id !== 'number') throw new Error('CODE400: sports property must be an array of { id: number; level?: Level }');
                    const sportInUser = user.Sports.find((sp: Sport) => sp.id === sport.id);
                    if (sportInUser) {
                        if (
                            'level' in sport &&
                            sport.level &&
                            sportInUser.level !== sport.level
                        ) {
                            await userSportService.update(sportInUser.UserSport.id, { level: sport.level });
                        }
                    }
                    else {
                        const userSport = { userId: id, sportId: sport.id };
                        if (sport.level) (userSport as any).level = sport.level;
                        await userSportService.create(userSport);
                    }
                }
                for (const sport of user.Sports) {
                    if (!data.sports.some((sp: { id: number }) => sp.id === sport.id)) {
                        await userSportRepository.delete(sport.UserSport.id);
                    }
                }
            }
            const updatedUser = await userRepository.update(id, data);
            return updatedUser;
        });
    }

    async delete(id: number) {
        return await genericServRepo('userService.delete', 'Error deleting user', [id], async (id) => {
            await userRepository.delete(id);
            return { message: "User deleted successfully" };
        });
    }
}

export default new UserService();
