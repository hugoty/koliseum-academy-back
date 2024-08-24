import { Level } from "../models/data";
import courseRepository from "../repositories/courseRepository";
import courseSportRepository from "../repositories/courseSportRepository";
import sportRepository from "../repositories/sportRepository";
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

    async create(data: any) {
        return await genericServRepo('courseService.create', 'Error creating course', [data], async (data) => {
            this.checkLevels(data);
            if (!('sportIds' in data)) {
                throw new Error('CODE400: course\'s sport ids are not provided');
            }
            if (!Array.isArray(data.sportIds)) {
                throw new Error('CODE400: course\'s sport ids should be an array');
            }
            if (data.sportIds.length === 0) {
                throw new Error('CODE400: course\'s sport ids array should not be empty');
            }
            for (let sportId of data.sportIds) {
                try {
                    const sport = await sportRepository.getById(sportId);
                } catch (error: any) {
                    throw new Error(`CODE400: sport id ${sportId} not found`);
                }
            }
            const newCourse = await courseRepository.create(data);
            for (let sportId of data.sportIds) {
                await courseSportRepository.create({ courseId: newCourse.id, sportId });
            }
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
