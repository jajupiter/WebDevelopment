import { Request, Response } from "express";
import { TableroService } from "./tablero.service";
import { CreateTableroRequest } from "../../types";
import { table } from "console";

export class TableroController {
    constructor(private readonly tableroService: TableroService) { }

    getAlltableros = async (req: Request, response: Response): Promise<void> => {
        try {
            const tablerosList = await this.tableroService.getAllTableros();
            if (!tablerosList) throw new Error('Aun no hay tableros disponibles')
            response.json({ tablerosList });
        } catch (error) {
            console.log(error)
            response.status(500).json({ error: "Obtencion de tableros fallida." })
        }
    }

    getTableroById = async (req: Request, response: Response): Promise<void> => {
        try {
            const request = req.body;
            const tablero = await this.tableroService.getTableroById(request.id);
            if (!tablero) { response.status(404).json({ error: "Tablero no encontrado." }); return }
            response.json({ tablero })
        }
        catch (error) {
            response.status(500).json({ error: "Obtencion de tablero fallida." })
        }
    }

    createTablero = async (req: Request, response: Response): Promise<void> => {
        try {
            const tableroReq = {name: req.body.name, idUser: req.user.id};
            const tablero = await this.tableroService.createTablero(tableroReq);
            response.status(201).json({ tablero })
        } catch (error) {
            console.log(error)
            response.status(500).json({ error: "Creacion de tablero fallida." })
        }
    }


    deleteTablero = async (req: Request, response: Response): Promise<void> => {
        try {
            const request = req.body;
            const dlt = await this.tableroService.deleteTablero(request.id);
            if (!dlt) { response.status(404).json({ error: "Tablero no encontrado." }) } else { response.status(200).json({ dlt }) }
        } catch (error) {
            console.log(error)
            response.status(500).json({ error: "Falla al eliminar el tablero" })
        }
    }

    existsTablero = async (req: Request, response: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const tableroExists = await this.tableroService.existsTablero(id);
            response.status(200).json({ tableroExists })
        } catch (error) {
            response.status(500).json({ error: "Obtencion de tablero fallida." })
        }
    }
}