import { Router } from "express";
import {
  createProblem,
  deleteProblem,
  getProblemById,
  getProblems,
  updateProblem
} from "../controllers/problem.controller.js";

const problemRouter = Router();

problemRouter.get("/", getProblems);
problemRouter.get("/:problemId", getProblemById);
problemRouter.post("/", createProblem);
problemRouter.put("/:problemId", updateProblem);
problemRouter.delete("/:problemId", deleteProblem);

export default problemRouter;
