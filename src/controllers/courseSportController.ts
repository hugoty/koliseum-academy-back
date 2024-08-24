import { Request, Response } from "express";
import courseSportService from "../services/courseSportService";
import { checkCourseCoach } from "../utils/checks";
import { genericController } from "../utils/error";

class CourseSportController {

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await checkCourseCoach(req);
            const courseId = Number(req.params.id);
            const sportId = Number(req.params.sportId);
            const newUserSport = await courseSportService.create({ courseId, sportId });
            res.status(201).json(newUserSport);
        });
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await checkCourseCoach(req);
            const courseSportId = Number(req.params.id);
            await courseSportService.delete(courseSportId);
            res.json({ message: 'Course\'s sport deleted successfully' });
        });
    }
}

export default new CourseSportController();
