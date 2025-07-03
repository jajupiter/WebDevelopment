import { CreateTareaRequest, Tarea } from "../../types";
import { TareaRepository } from "./tarea.repository";

export class TareaService 
{
    constructor( private readonly tareasRepository : TareaRepository){}
    async getAllTareas(): Promise<Tarea[]>
    {
       return this.tareasRepository.getAllTareas();
    }
    async getTareaById(id: string): Promise<Tarea | undefined>
    {
        return this.tareasRepository.getByIdTarea(id);
    }
    async createTarea(tarea: CreateTareaRequest): Promise<Tarea | undefined>
    {
        return this.tareasRepository.createTarea(tarea);
    }
    async checkTarea(id: string): Promise<Tarea | undefined>
    {
        return this.tareasRepository.checkTarea(id);
    }
    async editTarea(id: string, newContent: string): Promise<Tarea | undefined>
    {
        return this.tareasRepository.editTarea(id, newContent);
    }
    async deleteTarea(id: string): Promise<Tarea | undefined>
    {
        return this.tareasRepository.deleteTarea(id);
    }
    async deleteCompletas(idTablero: string): Promise<Tarea[]>{
        return this.tareasRepository.deleteCompletas(idTablero);
    }
    async existsTarea(id: string) : Promise<boolean>
    {
        return this.tareasRepository.existsTarea(id);
    }
}