import { randomUUID } from "crypto";
import {database} from "../../db/connection";
import {CreateTableroRequest, Tablero} from "../../types"
import { throwDeprecation } from "process";

export class TableroRepository 
{
    async getAllTableros() : Promise<Tablero[]>
    {
        return database.all<Tablero>("SELECT * FROM tableros ORDER BY created_at ASC");
    }

    async getByIdTablero(id: string) : Promise<Tablero | undefined>
    {
        return database.get<Tablero>("SELECT * FROM tableros WHERE id = ?", [id]); 
    }

    async createTablero(tableroData: CreateTableroRequest) : Promise<Tablero | undefined>
    {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await database.run("INSERT INTO tableros (id, idUser, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", 
            [id, tableroData.idUser ,tableroData.name, now , now]
        );

        const tablero = await this.getByIdTablero(id);
        if(!tablero) throw new Error("Creacion de nuevo tablero fallida");
        return tablero;
    }

    async editPermisoTablero(id: string): Promise<Tablero | undefined>
    {
        await database.run("UPDATE tableros SET sololectura = 1 WHERE id = ?", [id]);
        const tablero = this.getByIdTablero(id);
        return tablero
    }

    async deleteTablero(id: string): Promise<boolean>
    {
        await database.run("DELETE FROM tableros WHERE id = ?", [id])
        return true
    }

    async existsTablero(id: string) : Promise<boolean>
    {
        const tablero = await this.getByIdTablero(id);
        return !!tablero
    }
}