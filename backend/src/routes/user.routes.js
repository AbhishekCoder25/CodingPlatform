import { Router } from "express";
import {
  createAdminLogin,
  createStudentLogin,
  getUsers
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/admin-login", createAdminLogin);
userRouter.post("/student-login", createStudentLogin);

export default userRouter;
