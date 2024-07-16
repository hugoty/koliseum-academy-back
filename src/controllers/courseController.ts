import { Request, Response } from "express";
import courseRepository from "../repositories/courseRepository";
import courseService from "../services/courseService";
import { isAdmin } from "../utils/checks";
import { genericController } from "../utils/error";

class CourseController {

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const courseData = req.body;
            const newCourse = await courseService.create({ ...courseData, userId: (req as any).user.id });
            res.status(201).json(newCourse);
        }, false);
    }

    async getById(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const courseId = Number(req.params.id);
            const course = await courseService.getById(courseId);
            if (course) {
                res.json(course);
            } else {
                res.status(404).json({ error: "Course not found" });
            }
        });
    }

    async update(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await this.checkCourseCoach(req);
            const courseId = Number(req.params.id);
            const courseData = req.body;
            const updatedCourse = await courseService.update(courseId, courseData);
            res.json(updatedCourse);
        });
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await this.checkCourseCoach(req);
            const courseId = Number(req.params.id);
            await courseService.delete(courseId);
            res.json({ message: "Course deleted successfully" });
        });
    }

    async checkCourseCoach(req: Request) {
        const user = (req as any).user;
        const courseId = Number(req.params.id);
        if (!isAdmin(user)) {
            const coach = await courseRepository.getCoachByCourseId(courseId);
            if (user.id !== coach.id) throw new Error('CODE403: The user is not the owner of this course');
        };
    }
}

export default new CourseController();
