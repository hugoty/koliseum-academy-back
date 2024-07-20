import { Level } from "../models/data";
import courseRepository from "../repositories/courseRepository";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";
import userService from "./userService";

class CourseService {

    private checkLevels(data: any) {
        checkAttr(data, 'course', ['levels']);
        if (!Array.isArray(data.levels)) {
            throw new Error('CODE400: course\'s levels attribute should be an array');
        }
        if (data.levels.some((lvl: any) => !Object.values(Level).includes(lvl))) {
            throw new Error('CODE400: course\'s levels attribute should be an array of levels');
        }
    }

    bidon() { return true; }

    async create(data: any) {
        return await genericServRepo('courseService.create', 'Error creating course', [data], async (data) => {
            this.checkLevels(data);
            const newCourse = await courseRepository.create(data);
            return newCourse;
        });
    }

    async getById(id: number, publicCourse = true) {
        return await genericServRepo('courseService.getById', 'Error fetching course', [id], async (id) => {
            let course = await courseRepository.getById(id);
            if (publicCourse) delete course.dataValues.Users;
            const owner = await userService.getById(course.ownerId);
            delete owner.ownedCourses;
            course.dataValues.owner = owner;
            return course;
        });
    }

    async update(id: number, data: any) {
        this.checkLevels(data);
        return await genericServRepo('courseService.update', 'Error updating course', [id, data], async (id, data) => {
            const updatedCourse = await courseRepository.update(id, data);
            return updatedCourse;
        });
    }

    async delete(id: number) {
        return await genericServRepo('courseService.delete', 'Error deleting course', [id], async (id) => {
            await courseRepository.delete(id);
            return { message: "Course deleted successfully" };
        });
    }
}

export default new CourseService();
