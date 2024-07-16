import SportRepository from "../repositories/sportRepository";
import { genericServRepo } from "../utils/error";

class SportService {

    async getAll() {
        return await genericServRepo('sportService.getAll', 'Error fetching all sports', [], async () => {
            return await SportRepository.getAll();
        });
    }

    async getById(id: number) {
        return await genericServRepo('sportService.getById', 'Error fetching sport', [id], async (id) => {
            return await SportRepository.getById(id);
        });
    }

    async create(data: any) {
        return await genericServRepo('sportService.create', 'Error creating sport', [data], async (data) => {
            return await SportRepository.create(data);
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('sportService.update', 'Error updating sport', [id, data], async (id, data) => {
            return await SportRepository.update(id, data);
        });
    }

    async delete(id: number) {
        return await genericServRepo('sportService.delete', 'Error deleting sport', [id], async (id) => {
            return await SportRepository.delete(id);
        });
    }
}

export default new SportService();
