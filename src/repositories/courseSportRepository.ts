import CourseSport from "../models/courseSport";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";

class CourseSportRepository {

    async getById(id: number) {
        return await genericServRepo('courseSportRepository.getById', 'Error fetching course\'s sports', [id], async (id) => {
            const courseSport = await CourseSport.findByPk(id);
            if (!courseSport) {
                throw new Error("CODE404: Course\'s sport not found");
            }
            return courseSport;
        });
    }

    async create(data: any) {
        return await genericServRepo('courseSportRepository.create', 'Error creating course\'s sports', [data], async (data) => {
            data = checkAttr(data, 'courseSport', ['courseId', 'sportId'], ['id']);
            const newCourseSport = await CourseSport.create(data);
            return newCourseSport;
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('courseSportRepository.update', 'Error updating course\'s sports', [id, data], async (id, data) => {
            const courseSport = await this.getById(id);
            data = checkAttr(data, 'courseSport', [], ['courseId', 'sportId', 'id']);
            await courseSport.update(data);
            return courseSport;
        });
    }

    async delete(id: number) {
        return await genericServRepo('courseSportRepository.delete', 'Error deleting course\'s sports', [id], async (id) => {
            const courseSport = await this.getById(id);
            await courseSport.destroy();
            return courseSport;
        });
    }
}

export default new CourseSportRepository();
