import e, { Request, Response } from "express";
import { ColaboracionService } from "./colaboracion.service";
import { error } from "console";

export class ColaboracionController {
    constructor(private readonly colaboracionService: ColaboracionService) { }

    getAllCollabs = async (req: Request, res: Response) => {
        try {
            const colaboraciones = this.colaboracionService.getAllCollabs();
            if(!colaboraciones) throw new Error('Aun no hay colaboraciones disponibles');
            res.json({colaboraciones});
        } catch(err) {
            console.log(err);
            res.status(500).json({error: 'No se pudieron traer todas las colaboraciones'});
        }
    }

    getCollabByIds = async (req: Request, res: Response) =>
    {
        try{
            const request = req.body;
            const colaboracion = this.colaboracionService.getCollabByIds(request.ids);
            if(!colaboracion) throw new Error('Colaboracion no encontrada.');
            res.json({colaboracion})
        } catch(err) {
            console.log(err);
            res.status(500).json({error: 'No se pudo traer la colaboracion especificada.'})
        }
    }

    createCollab = async (req: Request, res: Response) =>
    {
        try{
            const request = req.body;
            const colaboracion = this.colaboracionService.createCollab(request.ids);
            if(!colaboracion) throw new Error('Request dudosa.');
            res.json({colaboracion})
        } catch(err) {
            console.log(err);
            res.status(500).json({error: 'No se pudo crear la colaboracion.'})
        }
    }

    deleteCollab = async (req: Request, res: Response) =>
    {
        try{
            const request = req.body;
            const colaboracion = this.colaboracionService.deleteCollab(request.ids);
            if(!colaboracion) throw new Error('Colaboracion no encontrada.');
            res.json({colaboracion})
        } catch(err) {
            console.log(err);
            res.status(500).json({error: 'No se pudo eliminar la colaboracion especificada.'})
        }
    }
}