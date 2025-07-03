import { CreateTableroRequest, Tablero } from "../../types";
import { TableroRepository } from "./tablero.repository";

export class TableroService 
{
    constructor( private readonly tablerosRepository : TableroRepository){}
    async getAllTableros(): Promise<Tablero[]>
    {
       return this.tablerosRepository.getAllTableros();
    }
    async getTableroById(id: string): Promise<Tablero | undefined>
    {
        return this.tablerosRepository.getByIdTablero(id);
    }
    async createTablero(Tablero: CreateTableroRequest): Promise<Tablero | undefined>
    {
        return this.tablerosRepository.createTablero(Tablero);
    }
    async deleteTablero(id: string): Promise<boolean>
    {
        return this.tablerosRepository.deleteTablero(id);
    }
    async existsTablero(id: string) : Promise<boolean>
    {
        return this.tablerosRepository.existsTablero(id);
    }
}
