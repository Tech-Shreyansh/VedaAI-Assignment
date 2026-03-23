import express from "express";
import { createAssignment, getAssignmentById, getAssignments } from "../controllers/assignment.controller";

const router = express.Router();

router.post("/create", createAssignment);
router.get("/", getAssignments);
router.get("/:id", getAssignmentById);

export default router;