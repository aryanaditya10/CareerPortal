import express from "express";
import { getCompanyDetailsById, getCompanyDetailsByUser, registerCompany, updateCompany } from "../controllers/company.controllers.js";
import authUser from "../middlewares/authUser.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { singleUpload } from "../middlewares/multer.js";

const companyRouter = express.Router()

companyRouter.post("/register", authUser, authorizeRole("recruiter"), registerCompany);
companyRouter.get("/get", authUser, authorizeRole("recruiter"), getCompanyDetailsByUser);
companyRouter.get("/get/:id", authUser, authorizeRole("recruiter"), getCompanyDetailsById);
companyRouter.post("/update/:id", authUser, authorizeRole("recruiter"), singleUpload, updateCompany);


export default companyRouter;

