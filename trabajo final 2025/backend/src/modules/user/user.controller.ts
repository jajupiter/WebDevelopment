import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserRequest } from "../../types";


export class UserController {
    constructor(private readonly userService: UserService) { }

    getAllUsers = async (req: Request, response: Response): Promise<void> => {
        try {
            const usersList = await this.userService.getAllUsers();
            response.json({ usersList });
        } catch (error) {
            console.log(error)
            response.status(500).json({ error: "Obtencion de usuarios fallida." })
        }
    }

    getUserById = async (req: Request, response: Response): Promise<void> => {
        try {
            const request = req.body;
            const user = await this.userService.getUserById(request.id);
            if (!user) { response.status(404).json({ error: "Usuario no encontrado." }); return }
            response.json({ user })
        }
        catch (err) {
            console.log(err)
            response.status(500).json({ error: "Obtencion de usuario fallida." })
        }
    }

    createUser = async (req: Request, response: Response): Promise<void> => {
        try {
            const name = req.body;
            const user = await this.userService.createUser(name);
            response.status(201).json({ user })
        } catch (error) {
            console.log(error)
            response.status(500).json({ error: "Creacion de usuario fallida." })
        }
    }


    deleteUser = async (req: Request, response: Response): Promise<void> => {
        try {
            const request = req.body;
            const dlt = await this.userService.deleteUser(request.id);
            if (!dlt) { response.status(404).json({ error: "Usuario no encontrado." }) } else {response.status(200).json({dlt})}
        } catch (error) {
            response.status(500).json({ error: "Falla al eliminar el usario" })
        }
    }

    editConfigUser = async (req: Request, response: Response): Promise<void> => {
        try {
            const request = req.body;
            const user = await this.userService.editConfigUser(request.update);
            if (!user) { response.status(404).json({ error: "Usuario no encontrado." }) } else {response.status(200).json({user})}
        } catch (error) {
            response.status(500).json({ error: "Falla al editar las configuraciones del usario" })
        }
    }

    login = async (req: Request, response: Response): Promise<void> =>{
        try{
            const request = req.body; 
            const token = await this.userService.login(request.email, request.password);
            response.cookie("token", token, {
                secure: true, 
                signed: true,
                httpOnly: true,
                maxAge: 1000*60*60*24*30
            })

            response.json({token})
        }catch (e) {
            console.log(e)
            response.status(500).json({ error: "Login fallido:", e })
        }
    }

    logout = async(req: Request, response: Response) =>
    {
        response.clearCookie("userId");
        response.json({message: "Salio de su cuenta."})
    }
}