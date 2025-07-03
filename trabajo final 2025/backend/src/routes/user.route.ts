import {Router} from "express";
import { UserRepository } from "../modules/user/user.repository";
import { UserService } from "../modules/user/user.service";
import { UserController } from "../modules/user/user.controller";


const userRouter = Router();
const userRepository = new UserRepository();
const userService  = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.get("/", userController.getAllUsers);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.post("/register", userController.createUser);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/:id", userController.editConfigUser);
userRouter.delete("/:id", userController.deleteUser);

 export {userRouter as userRoute}