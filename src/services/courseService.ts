import { CourseSearchData, Level } from "../models/data";
import Sport from "../models/sport";
import User from "../models/user";
import courseRepository from "../repositories/courseRepository";
import courseSportRepository from "../repositories/courseSportRepository";
import sportRepository from "../repositories/sportRepository";
import userRepository from "../repositories/userRepository";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";
import userService from "./userService";

class CourseService {

    private checkLevels(data: any) {
        if (!('levels' in data)) return;
        if (!Array.isArray(data.levels)) {
            throw new Error('CODE400: course\'s levels attribute should be an array');
        }
        if (data.levels.some((lvl: any) => !Object.values(Level).includes(lvl))) {
            throw new Error('CODE400: course\'s levels attribute should be an array of levels');
        }
    }

    async create(data: any) {
        return await genericServRepo('courseService.create', 'Error creating course', [data], async (data) => {
            checkAttr(data, 'course', ['levels', 'sportIds', 'locations']);
            this.checkLevels(data);
            if (!Array.isArray(data.sportIds)) {
                throw new Error('CODE400: course\'s sport ids should be an array');
            }
            if (data.sportIds.length === 0) {
                throw new Error('CODE400: course\'s sportIds array should not be empty');
            }
            if (!Array.isArray(data.locations)) {
                throw new Error('CODE400: course\'s locations should be an array');
            }
            if (data.locations.length === 0) {
                throw new Error('CODE400: course\'s location array should not be empty');
            }
            for (let sportId of data.sportIds) {
                try {
                    const sport = await sportRepository.getById(sportId);
                } catch (error: any) {
                    throw new Error(`CODE400: sport id ${sportId} not found`);
                }
            }
            if ('remainingPlaces' in data) {
                if (data.remainingPlaces < 0) {
                    throw new Error(`CODE400: remainingPlaces (${data.remainingPlaces}) cannot be negative`);
                }
                if (data.remainingPlaces > data.places) {
                    throw new Error(`CODE400: remainingPlaces (${data.remainingPlaces}) cannot be higher than the course's place amount (${data.places})`);
                }
            }
            else data.remainingPlaces = data.places;
            const newCourse = await courseRepository.create(data);
            for (let sportId of data.sportIds) {
                await courseSportRepository.create({ courseId: newCourse.id, sportId });
            }
            return newCourse;
        });
    }

    async searchCourses(data: CourseSearchData) {
        return await genericServRepo('userService.searchCourses', 'Error searching courses', [], async () => {
            this.checkLevels(data);
            if (data.coachName) {
                const coaches = await userRepository.searchCoaches({ name: data.coachName });
                if (coaches.length === 0) return [];
                data.coachIds = coaches.map((coach: User) => coach.id);
            }
            const courses = await courseRepository.searchCourses(data);
            const res = [];
            for (const course of courses) {
                const owner = await userService.getById(course.ownerId);
                delete owner.ownedCourses;
                course.dataValues.owner = owner;
                delete course.dataValues.ownerId;
                res.push(course);
            }
            return res;
        });
    }

    async getById(id: number, publicCourse = true) {
        return await genericServRepo('courseService.getById', 'Error fetching course', [id], async (id) => {
            let course = await courseRepository.getById(id);
            if (publicCourse) delete course.dataValues.Users;
            const owner = await userService.getById(course.ownerId);
            delete owner.ownedCourses;
            course.dataValues.owner = owner;
            delete course.dataValues.ownerId;
            return course;
        });
    }

    async update(id: number, data: any) {
        this.checkLevels(data);
        return await genericServRepo('courseService.update', 'Error updating course', [id, data], async (id, data) => {
            const course = await courseRepository.getById(id);
            if ('remainingPlaces' in data) {
                if (data.remainingPlaces < 0) {
                    throw new Error(`CODE400: remainingPlaces (${data.remainingPlaces}) cannot be negative`);
                }
                if (data.remainingPlaces > course.places) {
                    throw new Error(`CODE400: remainingPlaces (${data.remainingPlaces}) cannot be higher than the course's place amount (${course.places})`);
                }
            }
            if (
                'sportIds' in data &&
                Array.isArray(data.sportIds)
            ) {
                if (data.sportIds.length === 0) throw new Error(`CODE400: a course must have at least one sport`);
                for (const sportId of data.sportIds) {
                    if (!course.Sports.some((sport: Sport) => sport.id === sportId)) await courseSportRepository.create({ courseId: id, sportId });
                }
                for (const sport of course.Sports) {
                    if (!data.sportIds.includes(sport.id)) await courseSportRepository.delete(sport.CourseSport.id);
                }
            }
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
