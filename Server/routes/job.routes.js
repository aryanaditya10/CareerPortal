import express from 'express';
import { getAllJobs, getJobById, getRecruiterJobs, postJob } from '../controllers/job.controllers.js';
import authUser from '../middlewares/authUser.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const jobRouter = express.Router()


jobRouter.post("/post", authUser, authorizeRole("recruiter"), postJob);
jobRouter.get("/get", getAllJobs);
jobRouter.get("/get-recruiter-job", authUser, authorizeRole("recruiter"), getRecruiterJobs);
jobRouter.get("/get/:id", getJobById);



export default jobRouter;