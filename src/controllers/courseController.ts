import { Request, Response } from "express";
import courseService from "../services/courseService";
import { checkCourseCoach, isAdminOrCourseOwner } from "../utils/checks";
import { genericController } from "../utils/error";

class CourseController {

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const courseData = req.body;
            const newCourse = await courseService.create({ ...courseData, ownerId: (req as any).user.id });
            res.status(201).json(newCourse);
        }, false);
    }

    async getById(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const courseId = Number(req.params.id);
            const fullAccess = await isAdminOrCourseOwner(req);
            const course = await courseService.getById(courseId, !fullAccess);
            if (course) {
                res.json(course);
            } else {
                res.status(404).json({ error: "Course not found" });
            }
        });
    }

    async update(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await checkCourseCoach(req);
            const courseId = Number(req.params.id);
            const courseData = req.body;
            const updatedCourse = await courseService.update(courseId, courseData);
            res.json(updatedCourse);
        });
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await checkCourseCoach(req);
            const courseId = Number(req.params.id);
            await courseService.delete(courseId);
            res.json({ message: "Course deleted successfully" });
        });
    }
}

export default new CourseController();
