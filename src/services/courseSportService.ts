import courseRepository from "../repositories/courseRepository";
import courseSportRepository from "../repositories/courseSportRepository";
import { genericServRepo } from "../utils/error";

class CourseSportService {

    async getById(id: number) {
        return await genericServRepo('courseSportService.getById', 'Error fetching course\'s sport', [id], async (id) => {
            return await courseSportRepository.getById(id);
        });
    }

    async create(data: any) {
        return await genericServRepo('courseSportService.create', 'Error creating course\'s sport', [data], async (data) => {
            return await courseSportRepository.create(data);
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('courseSportService.update', 'Error updating course\'s sport', [id, data], async (id, data) => {
            return await courseSportRepository.update(id, data);
        });
    }

    async delete(id: number) {
        return await genericServRepo('courseSportService.delete', 'Error deleting course\'s sport', [id], async (id) => {
            const courseSport = await courseSportRepository.getById(id);
            const course = await courseRepository.getById(courseSport.courseId);
            if (course.Sports.length <= 1) throw new Error('CODE400: you cannot remove the only sport remaining in a course');
            return await courseSportRepository.delete(id);
        });
    }
}

export default new CourseSportService();
