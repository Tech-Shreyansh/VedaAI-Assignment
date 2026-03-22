import express from "express";
import { createAssignment, getAssignments } from "../controllers/assignment.controller";

const router = express.Router();

router.post("/create", createAssignment);
router.get("/get", getAssignments);

export default router;