
import AuthController from "../controller/auth_controller";
import { Router } from "express";


const auth_routes = Router();


auth_routes.post("/login", AuthController.login);
auth_routes.post("/verify-otp", AuthController.verifyOtp);
auth_routes.post("/generate-credentials",AuthController.generateCredentials)


export default auth_routes;