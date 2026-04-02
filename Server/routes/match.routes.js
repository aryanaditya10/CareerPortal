import express from "express";
import authUser from "../middlewares/authUser.js";
import { getBestJobsForUser, getBestCandidatesForJob } from "../controllers/match.controllers.js";

const router = express.Router();

// A student gets the best jobs matched to their resume
router.route("/jobs").get(authUser, getBestJobsForUser);

// A recruiter gets the best candidates mapped to a specific job
router.route("/candidates/:id").get(authUser, getBestCandidatesForJob);

export default router;
