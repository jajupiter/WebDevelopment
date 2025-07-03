import { CreateUserRequest, User } from "../../types";
import { UserRepository } from "./user.repository";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export class UserService 
{
    constructor( private readonly userRepository : UserRepository){}

    async getAllUsers() : Promise<User[]>
    {
        return await this.userRepository.getAllUsers();
    }

    async getUserById(id: string) : Promise<User | undefined>
    {
        return this.userRepository.getUserById(id);
    }

    async createUser(createRequest : CreateUserRequest): Promise<User | undefined>{
        const exists = await this.userRepository.getUserByEmail(createRequest.email);
        if(exists) throw new Error('El email ingresado ya esta siendo usado para una cuenta.')
        const hashedPassword = await hash(createRequest.password);
        return this.userRepository.createUser({...createRequest, password: hashedPassword});
    }

    async deleteUser(id: string) : Promise<boolean>{
        return await this.userRepository.deleteUser(id)
    }

    async editConfigUser(update: {id: string, intervaloRefetch: number, capsLock: boolean, darkMode: boolean}): Promise<User | undefined>{
        return await this.userRepository.editConfigUser(update);
    }

    async existsUser(id: string) : Promise<boolean>{
        return await this.userRepository.existsUser(id)
    }

    async login(email: string, password: string): Promise<string>{
        const user = await this.userRepository.getUserByEmail(email);
        if(!user) throw new Error('El email ingresado no se ha registrado.');
        const validacion = await verify(user.password, password);
        if(!validacion) throw new Error('La contraseña ingresada es incorrecta.');
        const token = jwt.sign({id: user.id, email: user.email, username: user.username, intervaloRefetch: user.intervaloRefetch, capsLock : user.capsLock, darkMode: user.darkMode}, "secret");
        return token
    }
}