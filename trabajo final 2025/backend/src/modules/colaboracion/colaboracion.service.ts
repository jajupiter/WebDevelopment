import { Collab, CreateCollabRequest } from "../../types";
import { ColaboracionRepository } from "./colaboracion.repository";

export class ColaboracionService {
    constructor(private readonly colaboracionRepository : ColaboracionRepository){}

    async getAllCollabs() : Promise <Collab[]>
    {
        return this.colaboracionRepository.getAllCollabs();
    }

    async getCollabByIds(ids: {idUser: string; idTablero:string}) : Promise<Collab | undefined>{
        return this.colaboracionRepository.getCollabByIds(ids);
    }

    async createCollab(createCollabRequest: CreateCollabRequest) : Promise<Collab | undefined>
    {
        return this.colaboracionRepository.createCollab(createCollabRequest);
    }

    async deleteCollab(ids: {idUser: string; idTablero:string}) : Promise<Collab | undefined>
    {
        return this.colaboracionRepository.deleteCollab(ids);
    }
}