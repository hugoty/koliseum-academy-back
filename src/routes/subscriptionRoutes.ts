import express from "express";
import subscriptionController from "../controllers/subscriptionController";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { verifyCoach } from "../middlewares/verifyCoach";
import { verifyToken } from "../middlewares/verifyToken";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/", verifyToken, verifyAdmin, subscriptionController.getAll);
subscriptionRouter.get("/:id", verifyToken, subscriptionController.getById);
subscriptionRouter.post("/create", verifyToken, verifyAdmin, subscriptionController.create);
subscriptionRouter.put("/:id", verifyToken, verifyAdmin, subscriptionController.update);
subscriptionRouter.delete("/:id", verifyToken, verifyAdmin, subscriptionController.delete);
subscriptionRouter.post("/:id/accept", verifyToken, verifyCoach, subscriptionController.accept);
subscriptionRouter.post("/:id/reject", verifyToken, verifyCoach, subscriptionController.reject);
subscriptionRouter.post("/:id/cancel", verifyToken, subscriptionController.cancel);

export default subscriptionRouter;
