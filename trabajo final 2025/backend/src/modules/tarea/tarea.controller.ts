import { Tarea } from "../../types";
import { Request, Response } from "express";
import { TareaService } from "./tarea.service";
import { error } from "console";

export class TareaController {
    constructor(private readonly tareaService: TareaService) { }

    getAllTareas = async (req: Request, response: Response): Promise<void> => {
        try {
            const tasks = await this.tareaService.getAllTareas();
            response.json({ tasks });
        } catch (error) {
            response.status(500).json({ error: "Obtencion de tareas fallida." })
        }
    }



    getTareaById = async (req: Request, response: Response): Promise<void> => {
        try {
            const request = req.body;
            const tarea = await this.tareaService.getTareaById(request.id);
            if (!tarea) { response.status(404).json({ error: "Tarea no encontrada." }); return }
            response.json({ tarea })
        }
        catch (error) {
            response.status(500).json({ error: "Obtencion de tarea faliida." })
        }
    }

    createTarea = async (req: Request, response: Response): Promise<void> => {
        try {
            const tareaData = req.body;
            if (!tareaData.content) { response.status(404).json({ error: "La tarea ingresada no puede ser vacia." }); return }
            if (!tareaData.idTablero) { response.status(404).json({ error: "Se requiere saber a que tablero pertenecera la tarea" }); return }
            const tarea = await this.tareaService.createTarea({ content: tareaData.content, idTablero: tareaData.idTablero });
            response.status(201).json({ tarea })
        } catch (error) {
            console.log(error)
            response.status(500).json({ error: "Creacion de tarea fallida." })
        }
    }

    actionTarea = async (req: Request, response: Response): Promise<void> => {
        try {
            const request = req.body;
            switch(request.action)
            {
                case "check":
                    const tareaC = await this.tareaService.checkTarea(request.id);
                    response.json({tareaC});
                    break
                case "edit":
                    const tareaE = await this.tareaService.editTarea(request.id, request.content);
                    response.json({tareaE});
                    break
                case "delete":
                    const tareaD = await this.tareaService.deleteTarea(request.id);
                    response.json({tareaD});
            }

        }
        catch (error) {
            console.log(error)
            response.status(500).json({ error: "Chequeo de tarea faliida." })
        }
    }

    checkTarea = async (req: Request, response: Response): Promise<void> => {
        try {
            const {id} = req.params;
            const tarea = this.tareaService.checkTarea(id);
            if (!tarea) { response.status(404).json({ error: "Tarea no encontrada." }); return }
            response.json({ tarea })
        }
        catch (error) {
            response.status(500).json({ error: "Chequeo de tarea faliida." })
        }
    }


    deleteTarea = async (req: Request, response: Response): Promise<void> => {
        try {
            const {id} = req.params;
            const dlt = await this.tareaService.deleteTarea(id);
            if (!dlt) { response.status(404).json({ error: "Tarea no encontrada." }); return }
            response.status(200)
        } catch (error) {
            response.status(500).json({ error: "Falla al eliminar la tarea" })
        }
    }

    editTarea = async (req: Request, response: Response): Promise<void> => {
        try {
            const tareaData = req.body;
            if (!tareaData.id) { response.status(404).json({ error: "Tarea no encontrada." }); return }
            if (!tareaData.content) { response.status(404).json({ error: "La edicion a ingresar no puede ser vacia." }); return }
            const tarea = await this.tareaService.editTarea(tareaData.id, tareaData.content);
            response.status(200).json({ tarea })
        } catch (error) {
            response.status(500).json({ error: "Creacion de tarea fallida." })
        }
    }

    deleteCompletas = async (req: Request, response: Response) : Promise<void> =>
    {
        try {
            const request = req.body;
            const eliminadas = this.tareaService.deleteCompletas(request.idTablero);
            response.json({eliminadas});
        } catch(error){
            response.status(500).json({error: "Fallo la eliminacion de las tareas completas"})
        }
    }

    existsTarea = async(req: Request, response: Response): Promise<void> => {
        try {
            const {id} = req.params;
            const tareaExists = await this.tareaService.existsTarea(id);
            response.status(200).json({tareaExists})
        } catch (error) {
            response.status(500).json({ error: "Obtencion de tarea fallida." })
        }
    }
}