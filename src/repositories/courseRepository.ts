import { Op } from "sequelize";
import Course from "../models/course";
import { SearchData } from "../models/data";
import Sport from "../models/sport";
import User from "../models/user";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";

class CourseRepository {

    async create(data: any) {
        return await genericServRepo('courseRepository.create', 'Error creating course', [data], async (data) => {
            data = checkAttr(data, 'course', [], ['ownerId', 'id']);
            const newCourse = await Course.create(data);
            return newCourse;
        });
    }

    async searchCourses(data: SearchData) {
        return await genericServRepo('courseRepository.searchCourses', 'Error searching courses', [data], async (data) => {
            const where: Record<string, any> = {};

            if (data.minDate) {
                where.startDate = {
                    ...where.startDate,
                    [Op.gte]: new Date(data.minDate)
                };
            }
            if (data.maxDate) {
                where.endDate = {
                    ...where.endDate,
                    [Op.lte]: new Date(data.maxDate)
                };
            }
            if (data.minPlaces) {
                where.places = {
                    ...where.places,
                    [Op.gte]: data.minPlaces
                };
            }
            if (data.maxPlaces) {
                where.places = {
                    ...where.places,
                    [Op.lte]: data.maxPlaces
                };
            }
            if (data.minRemainingPlaces) {
                where.remainingPlaces = {
                    ...where.remainingPlaces,
                    [Op.gte]: data.minRemainingPlaces
                };
            }
            if (data.maxRemainingPlaces) {
                where.remainingPlaces = {
                    ...where.remainingPlaces,
                    [Op.lte]: data.maxRemainingPlaces
                };
            }
            if (data.coachIds && data.coachIds.length > 0) {
                where[Op.or as any] = data.coachIds.map((id: number) => ({
                    ownerId: id
                }));
            }
            if (data.locations && data.locations.length > 0) {
                where.locations = {
                    [Op.or]: data.locations.map((location: string) => ({
                        [Op.like]: `%${location}%`
                    }))
                };
            }
            const courses = await Course.findAll({
                where,
                include: [
                    {
                        model: Sport,
                        where: data.sports && data.sports.length > 0 ? {
                            id: { [Op.in]: data.sports }
                        } : undefined,
                        through: {
                            attributes: ['id']
                        }
                    }
                ]
            });
            return courses;
        });
    }

    async getCoachCourses(id: number) {
        return await genericServRepo('courseRepository.getCoachCourses', 'Error fetching coach\'s courses', [id], async (id) => {
            const courses = await Course.findAll({
                where: { ownerId: id }
            });
            if (!courses) {
                throw new Error('CODE404: Courses not found');
            }
            return courses;
        });
    }

    async getById(id: number) {
        return await genericServRepo('courseRepository.getById', 'Error fetching course', [id], async (id) => {
            const course = await Course.findByPk(id, {
                include: [
                    {
                        model: Sport,
                        through: {
                            attributes: ['id']
                        }
                    },
                    {
                        model: User,
                        through: {
                            attributes: ['id', 'status']
                        }
                    }
                ]
            });
            if (!course) {
                throw new Error('CODE404: Course not found');
            }
            return course;
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('courseRepository.update', 'Error updating course', [id, data], async (id, data) => {
            const course = await Course.findByPk(id);
            if (!course) {
                throw new Error('CODE404: Course not found');
            }
            data = checkAttr(data, 'course', [], ['ownerId', 'id']);
            await course.update(data);
            return course;
        });
    }

    async delete(id: number) {
        return await genericServRepo('courseRepository.delete', 'Error deleting course', [id], async (id) => {
            const course = await Course.findByPk(id);
            if (!course) {
                throw new Error('CODE404: Course not found');
            }
            await course.destroy();
            return { message: 'Course deleted successfully' };
        });
    }
}

export default new CourseRepository();
