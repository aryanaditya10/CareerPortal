import express from "express";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controllers.js";
import authUser from "../middlewares/authUser.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const applicantionRouter = express.Router()

applicantionRouter.post("/apply/:id", authUser, authorizeRole("student"), applyJob);
applicantionRouter.get("/get", authUser, authorizeRole("student"), getAppliedJobs);
applicantionRouter.get("/:id/applicants", authUser, authorizeRole("recruiter"), getApplicants);
applicantionRouter.post("/status/:id/update", authUser, authorizeRole("recruiter"), updateStatus);


export default applicantionRouter;
