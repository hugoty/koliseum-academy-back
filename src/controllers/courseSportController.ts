import { Request, Response } from "express";
import courseSportService from "../services/courseSportService";
import { genericController } from "../utils/error";
import courseController from "./courseController";

class CourseSportController {

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await courseController.checkCourseCoach(req);
            const courseId = Number(req.params.id);
            const courseSportId = Number(req.params.courseSportId);
            const newUserSport = await courseSportService.create({ courseId, courseSportId });
            res.status(201).json(newUserSport);
        });
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await courseController.checkCourseCoach(req);
            const courseSportId = Number(req.params.id);
            await courseSportService.delete(courseSportId);
            res.json({ message: 'Course\'s sport deleted successfully' });
        });
    }
}

export default new CourseSportController();
