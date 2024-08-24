import express from "express";
import userController from "../controllers/userController";
import userSportController from "../controllers/userSportController";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { verifyToken } from "../middlewares/verifyToken";

const userRouter = express.Router();

userRouter.get("/", verifyToken, userController.getProfile);
userRouter.get("/search-coaches", userController.searchCoaches);
userRouter.post("/:id/grant-coach", verifyToken, verifyAdmin, userController.grantCoachRole);
userRouter.post("/:id/revoke-coach", verifyToken, verifyAdmin, userController.revokeCoachRole);
userRouter.post("/create", userController.create);
userRouter.get("/:id", verifyToken, userController.getById);
userRouter.put("/:id", verifyToken, verifyAdmin, userController.update);
userRouter.delete("/:id", verifyToken, verifyAdmin, userController.delete);
userRouter.put("/", verifyToken, userController.updateProfile);
userRouter.delete("/", verifyToken, userController.deleteProfile);
userRouter.post("/:id/sport/:sportId", verifyToken, verifyAdmin, userSportController.create);
userRouter.put("/:id/sport/:sportId", verifyToken, verifyAdmin, userSportController.update);
userRouter.delete("/:id/sport/:sportId", verifyToken, verifyAdmin, userSportController.delete);
userRouter.post("/sport/:id", verifyToken, userSportController.addSport);
userRouter.put("/sport/:id", verifyToken, userSportController.updateSport);
userRouter.delete("/sport/:id", verifyToken, userSportController.removeSport);

export default userRouter;
