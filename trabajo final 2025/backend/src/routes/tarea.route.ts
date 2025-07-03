import {Router} from "express";
import { TareaRepository } from "../modules/tarea/tarea.repository";
import { TareaService } from "../modules/tarea/tarea.service";
import { TareaController } from "../modules/tarea/tarea.controller"
import { authWithHeadersMiddleware } from "../middleware/auth.middleware";


const tareaRouter = Router();
const tareaRepository = new TareaRepository();
const tareaService  = new TareaService(tareaRepository);
const tareaController = new TareaController(tareaService);

tareaRouter.use(authWithHeadersMiddleware);

tareaRouter.get("/", tareaController.getAllTareas);
tareaRouter.get("/:id", tareaController.getTareaById);
tareaRouter.post("/", tareaController.createTarea);
tareaRouter.delete("/:id", tareaController.deleteTarea);
tareaRouter.post("/:id", tareaController.actionTarea);
tareaRouter.delete("/", tareaController.deleteCompletas);

 export {tareaRouter as tareaRoute}