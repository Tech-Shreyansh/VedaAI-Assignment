import express from "express";
import { createAssignment, getAssignmentById, getAssignments, regenerateAssignment } from "../controllers/assignment.controller";

const router = express.Router();

router.post("/create", createAssignment);
router.get("/", getAssignments);
router.get("/:id", getAssignmentById);
router.patch("/:id", regenerateAssignment);

export default router;