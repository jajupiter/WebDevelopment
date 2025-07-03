import { randomUUID } from "crypto";
import {database} from "../../db/connection";
import {CreateTareaRequest, Tarea} from "../../types"

export class TareaRepository 
{
    async getAllTareas() : Promise<Tarea[]>
    {
        return database.all<Tarea>("SELECT * FROM tareas ORDER BY created_at ASC");
    }

    async getByIdTarea(id: string) : Promise<Tarea | undefined>
    {
        return database.get<Tarea>("SELECT * FROM tareas WHERE id = ?", [id]);
    }

    async createTarea(tareaData: CreateTareaRequest) : Promise<Tarea | undefined>
    {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await database.run("INSERT INTO tareas (id, content, checked, idTablero, created_at, updated_at) VALUES (?, ?, ?, ?,?,?)", 
            [id, tareaData.content, 0, tareaData.idTablero, now, now]
        );

        const tarea = await this.getByIdTarea(id);
        if(!tarea) throw new Error("Creacion de nueva tarea fallida");
        return tarea;
    }

    async checkTarea(id: string): Promise<Tarea | undefined>{

        await database.run("UPDATE tareas SET checked = 1-checked WHERE id = ?", [id]);
        const tarea = await this.getByIdTarea(id);
        return tarea;
    }

    async deleteTarea(id: string): Promise<Tarea | undefined>
    {
        const tarea = await this.getByIdTarea(id);
        await database.run("DELETE FROM tareas WHERE id = ?", [id])
        return tarea;
    }

    async editTarea(id: string, newContent: string) : Promise<Tarea | undefined>
    {
        await database.run("UPDATE tareas SET content = ? WHERE id = ?", [newContent, id])
        const tarea = await this.getByIdTarea(id);
        return tarea;
    }

    async deleteCompletas(idTablero: string) : Promise<Tarea[]>
    {
        const eliminadas = await database.all<Tarea>("SELECT * FROM tareas WHERE idTablero = ? AND checked = 1", [idTablero])
        await database.run("DELETE FROM tareas WHERE idTablero = ? AND checked = 1", [idTablero])
        return eliminadas
    }

    async existsTarea(id: string) : Promise<boolean>
    {
        const tarea = await this.getByIdTarea(id);
        return !!tarea;
    }
}