import { Router } from "express";
import { ColaboracionRepository } from "../modules/colaboracion/colaboracion.repository";
import { authWithHeadersMiddleware } from "../middleware/auth.middleware";
import { ColaboracionController } from "../modules/colaboracion/colaboracion.controller";
import { ColaboracionService } from "../modules/colaboracion/colaboracion.service";
import { UserRepository } from "../modules/user/user.repository";
import { TableroRepository } from "../modules";

const collabRouter = Router();
const tableroRepository = new TableroRepository();
const userRepository = new UserRepository();
const collabRepository = new ColaboracionRepository();
const collabService  = new ColaboracionService(collabRepository, userRepository, tableroRepository );
const collabController = new ColaboracionController(collabService);

collabRouter.use(authWithHeadersMiddleware)

collabRouter.get("/", collabController.getAllCollabs);
collabRouter.post("/users", collabController.getTablerosByIdUser);
collabRouter.get("/:id", collabController.getCollabsByIds);
collabRouter.post("/", collabController.createCollab);
collabRouter.delete("/:id", collabController.deleteCollab);

export {collabRouter as collabRoute}