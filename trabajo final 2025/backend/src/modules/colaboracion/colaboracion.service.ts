import { Collab, CreateCollabRequest, Tablero } from "../../types";
import { TableroRepository } from "../tablero/tablero.repository";
import { UserRepository } from "../user/user.repository";
import { ColaboracionRepository } from "./colaboracion.repository";

export class ColaboracionService {
    constructor(private readonly colaboracionRepository : ColaboracionRepository, private readonly userRepository : UserRepository, private readonly tableroRepository : TableroRepository){}

    async getAllCollabs() : Promise <Collab[]>
    {
        return this.colaboracionRepository.getAllCollabs();
    }

    async getCollabsByIds(ids: {idUser: string; idTablero:string}): Promise<Collab | undefined>{
        return this.colaboracionRepository.getCollabByIds(ids)
    }

    async getCollabByIdUser(idUser: string) : Promise<Collab[]>{
        return this.colaboracionRepository.getCollabByIdUser(idUser);
    }

    async getTablerosByCollabs(idUser : string) : Promise<(Tablero | undefined)[]> 
    {
        const colaboraciones = await this.colaboracionRepository.getCollabByIdUser(idUser);
        const tableros =await Promise.all(colaboraciones.map((col)=>{
            col.permiso ?? this.tableroRepository.editPermisoTablero(col.idTablero);
            return this.tableroRepository.getByIdTablero(col.idTablero);
        }))
        return tableros
    }

    async createCollab(update: {email: string, idTablero: string, permiso: boolean}) : Promise<Collab | undefined>
    {
        const user = await this.userRepository.getUserByEmail(update.email);
        const request: CreateCollabRequest = {idTablero: update.idTablero, idUser: user!.id, permiso: update.permiso}
        return this.colaboracionRepository.createCollab(request);
    }

    async deleteCollab(ids: {idUser: string; idTablero:string}) : Promise<Collab | undefined>
    {
        return this.colaboracionRepository.deleteCollab(ids);
    }
}