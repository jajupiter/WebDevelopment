import {Router} from "express";
import { TableroRepository } from "../modules/tablero/tablero.repository";
import { TableroService } from "../modules/tablero/tablero.service";
import { TableroController } from "../modules/tablero/tablero.controller"
import { authWithHeadersMiddleware } from "../middleware/auth.middleware";


const tableroRouter = Router();
const tableroRepository = new TableroRepository();
const tableroService  = new TableroService(tableroRepository);
const tableroController = new TableroController(tableroService);

tableroRouter.use(authWithHeadersMiddleware)

tableroRouter.get("/", tableroController.getAlltableros);
tableroRouter.get("/:id", tableroController.getTableroById);
tableroRouter.post("/", tableroController.createTablero);
tableroRouter.delete("/:id", tableroController.deleteTablero);

export {tableroRouter as tableroRoute}