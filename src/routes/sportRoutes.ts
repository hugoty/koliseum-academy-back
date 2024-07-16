import express from "express";
import sportController from "../controllers/sportController";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { verifyToken } from "../middlewares/verifyToken";

const sportRouter = express.Router();

sportRouter.get("/", sportController.getAll);
sportRouter.get("/:id", sportController.getById);
sportRouter.post("/", verifyToken, verifyAdmin, sportController.create);
sportRouter.put("/:id", verifyToken, verifyAdmin, sportController.update);
sportRouter.delete("/:id", verifyToken, verifyAdmin, sportController.delete);

export default sportRouter;
