import e, { Request, Response } from "express";
import { ColaboracionService } from "./colaboracion.service";
import { error, table } from "console";
import { UserService } from "../user/user.service";

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

    getTablerosByIdUser = async (req: Request, res: Response) =>
    {
        try{
            const request = req.user;
            const tableros = await this.colaboracionService.getTablerosByCollabs(request.id);
            if(!tableros) throw new Error('Colaboracion no encontrada.');
            console.log(tableros)
            res.json({tableros})
        } catch(err) {
            console.log(err);
            res.status(500).json({error: 'No se pudo traer los tableros en base a la collab especificada.'})
        }
    }

    getCollabsByIds = async (req: Request, res: Response) =>
    {
        try{
            const request = req.body;
            const colaboracion = await this.colaboracionService.getCollabsByIds(request);
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
            const colaboracion = await this.colaboracionService.createCollab(request.update);
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