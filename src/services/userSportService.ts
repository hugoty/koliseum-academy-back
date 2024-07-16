import { Level } from "../models/data";
import userSportRepository from "../repositories/userSportRepository";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";

class UserSportService {

    private checkLevel(data: any) {
        checkAttr(data, 'course', ['level']);
        if (typeof data.level !== 'string') {
            throw new Error('CODE400: user\'s sport\'s level attribute should be a string');
        }
        if (!Object.values(Level).includes(data.level)) {
            throw new Error('CODE400: user\'s sport\'s level attribute should be a level');
        }
    }

    async getById(id: number) {
        return await genericServRepo('userSportService.getById', 'Error fetching user\'s sport', [id], async (id) => {
            return await userSportRepository.getById(id);
        });
    }

    async create(data: any) {
        return await genericServRepo('userSportService.create', 'Error creating user\'s sport', [data], async (data) => {
            this.checkLevel(data);
            return await userSportRepository.create(data);
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('userSportService.update', 'Error updating user\'s sport', [id, data], async (id, data) => {
            this.checkLevel(data);
            return await userSportRepository.update(id, data);
        });
    }

    async delete(id: number) {
        return await genericServRepo('userSportService.delete', 'Error deleting user\'s sport', [id], async (id) => {
            return await userSportRepository.delete(id);
        });
    }
}

export default new UserSportService();
