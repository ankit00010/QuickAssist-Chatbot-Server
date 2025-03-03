import { Router } from "express"
import AdminClassController from "../controller/admin_controller";
import { AuthMiddleware } from "../../../config/check_token";




const admin_routes = Router();
admin_routes.use(AuthMiddleware.authenticateToken);
admin_routes.use(AuthMiddleware.isAdmin);
admin_routes.get("/faqs",AdminClassController.getFaqs)
admin_routes.post("/add-data", AdminClassController.addData);
admin_routes.put("/edit-data/:id", AdminClassController.editData);
admin_routes.delete("/delete-data/:id", AdminClassController.deleteData);
admin_routes.post("/admin-message", AdminClassController.adminMessage);
admin_routes.post("/questions/unanswered",AdminClassController.questionsUnAnswered);
admin_routes.delete("/questions/unanswered/delete/:id",AdminClassController.deleteQuestions);
admin_routes.get("/users/list",AdminClassController.usersList);

export default admin_routes;