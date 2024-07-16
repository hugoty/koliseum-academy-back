import Sport from "../models/sport";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";

class SportRepository {

    async getAll() {
        return await genericServRepo('sportRepository.getAll', 'Error fetching all sports', [], async () => {
            const sports = await Sport.findAll();
            return sports;
        });
    }

    async getById(id: number) {
        return await genericServRepo('sportRepository.getById', 'Error fetching sport', [id], async (id) => {
            const sport = await Sport.findByPk(id);
            if (!sport) {
                throw new Error("CODE404: Sport not found");
            }
            return sport;
        });
    }

    async create(data: any) {
        return await genericServRepo('sportRepository.create', 'Error creating sport', [data], async (data) => {
            data = checkAttr(data, 'user', [], ['id']);
            const newSport = await Sport.create(data);
            return newSport;
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('sportRepository.update', 'Error updating sport', [id, data], async (id, data) => {
            const sport = await this.getById(id);
            data = checkAttr(data, 'sport', [], ['id']);
            await sport.update(data);
            return sport;
        });
    }

    async delete(id: number) {
        return await genericServRepo('sportRepository.delete', 'Error deleting sport', [id], async (id) => {
            const sport = await this.getById(id);
            await sport.destroy();
            return sport;
        });
    }
}

export default new SportRepository();
