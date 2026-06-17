import { Router } from "express";
import {
  createSubmission,
  getStudentProgress,
  getStudentSubmissions
} from "../controllers/submission.controller.js";

const submissionRouter = Router();

submissionRouter.post("/", createSubmission);
submissionRouter.get("/student/:studentId", getStudentSubmissions);
submissionRouter.get("/student/:studentId/progress", getStudentProgress);

export default submissionRouter;
