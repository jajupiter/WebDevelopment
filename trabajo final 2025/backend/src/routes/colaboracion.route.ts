import { Router } from "express";
import { ColaboracionRepository } from "../modules/colaboracion/colaboracion.repository";
import { authWithHeadersMiddleware } from "../middleware/auth.middleware";
import { ColaboracionController } from "../modules/colaboracion/colaboracion.controller";
import { ColaboracionService } from "../modules/colaboracion/colaboracion.service";

const collabRouter = Router();
const collabRepository = new ColaboracionRepository();
const collabService  = new ColaboracionService(collabRepository);
const collabController = new ColaboracionController(collabService);

collabRouter.use(authWithHeadersMiddleware)

collabRouter.get("/", collabController.getAllCollabs);
collabRouter.get("/:id", collabController.getCollabByIds);
collabRouter.post("/", collabController.createCollab);
collabRouter.delete("/:id", collabController.deleteCollab);

export {collabRouter as collabRoute}