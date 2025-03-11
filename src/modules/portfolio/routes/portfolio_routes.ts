import { Router } from "express";
import PortfolioController from "../controller/portfolio_controller";

const portfolio_router = Router();



portfolio_router.post("/send-email",PortfolioController.sendEmail);




export default portfolio_router;