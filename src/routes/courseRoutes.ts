import express from "express";
import courseController from "../controllers/courseController";
import courseSportController from "../controllers/courseSportController";
import subscriptionController from "../controllers/subscriptionController";
import { verifyCoach } from "../middlewares/verifyCoach";
import { verifyToken } from "../middlewares/verifyToken";

const courseRouter = express.Router();

// courseRouter.get("/", courseController.getAll);
courseRouter.post("/create", verifyToken, verifyCoach, courseController.create);
courseRouter.get("/:id", courseController.getById);
courseRouter.put("/:id", verifyToken, verifyCoach, courseController.update);
courseRouter.delete("/:id", verifyToken, verifyCoach, courseController.delete);
courseRouter.post("/:id/add-sport/:sportId", verifyToken, verifyCoach, courseSportController.create);
courseRouter.delete("/remove-sport/:id", verifyToken, verifyCoach, courseSportController.delete);
courseRouter.post("/:id/subscribe", verifyToken, subscriptionController.subscribe);

export default courseRouter;
