import express from "express";
import authUser from "../middlewares/authUser.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { getBestJobsForUser, getBestCandidatesForJob } from "../controllers/match.controllers.js";

const router = express.Router();

// A student gets the best jobs matched to their resume
router.route("/jobs").get(authUser, authorizeRole("student"), getBestJobsForUser);

// A recruiter gets the best candidates mapped to a specific job
router.route("/candidates/:id").get(authUser, authorizeRole("recruiter"), getBestCandidatesForJob);

export default router;
