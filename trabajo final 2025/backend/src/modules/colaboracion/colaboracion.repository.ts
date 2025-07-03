import { database } from "../../db/connection";
import { Collab, CreateCollabRequest } from "../../types";

export class ColaboracionRepository
{

    async getAllCollabs() : Promise <Collab[]> {
        const colaboraciones = await database.all<Collab>('SELECT * FROM colaboraciones');
        return colaboraciones
    }

    async getCollabByIds(ids: {idUser: string; idTablero:string}): Promise<Collab | undefined>{
        const colaboracion = await database.get<Collab>('SELECT * FROM colaboraciones WHERE idUser = ? AND idTablero = ?', [ids.idUser, ids.idTablero]);
        if(!colaboracion) throw new Error('No se pudo obtener la colaboracion deseada');
        return colaboracion
    }

    async createCollab(createCollabRequest : CreateCollabRequest): Promise<Collab | undefined>{
        await database.run('INSERT INTO colaboraciones (idUser, idTablero, permiso) VALUES (?, ?, ?)', 
            [createCollabRequest.idUser, createCollabRequest.idTablero, createCollabRequest.permiso]);
        const colaboracion = await this.getCollabByIds(createCollabRequest);
        return colaboracion;
    }

    async deleteCollab(ids: {idUser: string; idTablero:string}): Promise<Collab | undefined>
    {
        const colaboracion = await this.getCollabByIds(ids);
        await database.run('DELETE FROM colaboraciones WHERE idUser = ? AND idTablero = ?', [ids.idUser, ids.idTablero]);
        return colaboracion
    }

}