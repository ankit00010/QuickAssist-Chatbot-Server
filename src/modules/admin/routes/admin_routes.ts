import { Router } from "express"
import AdminClassController from "../controller/admin_controller";
import { AuthMiddleware } from "../../../config/check_token";




const admin_routes = Router();
admin_routes.use(AuthMiddleware.authenticateToken);
admin_routes.use(AuthMiddleware.isAdmin);
admin_routes.post("/add-data", AdminClassController.addData);
admin_routes.put("/edit-data/:id", AdminClassController.editData);
admin_routes.delete("/delete-data/:id", AdminClassController.deleteData);

export default admin_routes;