import { CreateReadStreamOptions } from "fs/promises";
import { database } from "../../db/connection";
import { CreateUserRequest, User } from "../../types";

export class UserRepository
{
    async getAllUsers(): Promise<User[]>
    {
        return database.all<User>("SELECT * FROM users ORDER BY username")
    }

    async getUserById(id: string) : Promise<User | undefined>
    {
        return database.get<User>("SELECT * FROM users WHERE id = ?", [id])
    }

    async getUserByEmail(email: string) : Promise<User | undefined>
    {
        return database.get<User>("SELECT * FROM users WHERE email = ?", [email])
    }

    async createUser(request: CreateUserRequest) : Promise<User | undefined>
    {
        const id = crypto.randomUUID();
        await database.run("INSERT INTO users (id, email, password, username, intervaloRefetch) VALUES (?, ?, ?, ?, 5)",
            [id, request.email, request.password, request.username]
         )
        const user = await this.getUserById(id);
        if(!user) throw new Error("Creacion de nuevo usuario fallida")
        return user
    }

    async deleteUser(id: string) : Promise<boolean>
    {
        database.run("DELETE FROM users WHERE id = ?", [id])
        const dlt = await this.getUserById(id) ? true : false
        return dlt
    }

    async editConfigUser(update: {id: string, intervaloRefetch: number, capsLock: boolean, darkMode: boolean}) : Promise<User | undefined>
    {
        database.run("UPDATE users SET intervaloRefetch = ?, capsLock = ?, darkMode = ? WHERE id = ?", 
                [update.intervaloRefetch, update.capsLock, update.darkMode, update.id]);
        const user = this.getUserById(update.id);
        return user
    }

    async existsUser(id: string) : Promise<boolean>
    {
        const user = await this.getUserById(id);
        return !!user;
    }

}