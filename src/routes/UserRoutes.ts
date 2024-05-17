import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

router.post("/users", UserController.createUser);

export default router;
