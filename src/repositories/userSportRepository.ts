import UserSport from "../models/userSport";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";

class UserSportRepository {

    async getById(id: number) {
        return await genericServRepo('userSportRepository.getById', 'Error fetching user\'s sport', [id], async (id) => {
            const userSport = await UserSport.findByPk(id);
            if (!userSport) {
                throw new Error("CODE404: User\'s sport not found");
            }
            return userSport;
        });
    }

    async create(data: any) {
        return await genericServRepo('userSportRepository.create', 'Error creating user\'s sport', [data], async (data) => {
            data = checkAttr(data, 'userSport', ['userId', 'sportId'], ['id']);
            const newUserSport = await UserSport.create(data);
            return newUserSport;
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('userSportRepository.update', 'Error updating user\'s sport', [id, data], async (id, data) => {
            const userSport = await this.getById(id);
            data = checkAttr(data, 'userSport', [], ['userId', 'sportId', 'id']);
            await userSport.update(data);
            return userSport;
        });
    }

    async delete(id: number) {
        return await genericServRepo('userSportRepository.delete', 'Error deleting user\'s sport', [id], async (id) => {
            const userSport = await this.getById(id);
            await userSport.destroy();
            return userSport;
        });
    }
}

export default new UserSportRepository();
