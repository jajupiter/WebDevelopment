import { toast } from "sonner";
import listo from "../assets/task.png"
import type { User } from "../types";
import { baseURL, errorAtom, loadingAtom, tiempoCargando, tokenAtom } from "./store/tareasStore";
import { useMutation } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { type FormEvent } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const toggleAccountExistsAtom = atom(false)

export function Authorization() {
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [, setToken] = useAtom(tokenAtom);
    const [accountExists, setAccountExists] = useAtom(toggleAccountExistsAtom)
    const nav = useNavigate();

    const { mutate: registerUser } = useMutation({
        mutationFn: async ({ email, password, username }: { email: string, password: string, username: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/users/register`, {
                method: 'POST',
                body: JSON.stringify({ email, password, username }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data: { user: User } = await response.json();
            return data.user;
        },

        onSuccess: (data) => {
            toast.success("Exitazo!", { description: `Usuario ${data.username} registrado exitosamente (:` })
        },
        onError: (error) => {
            setError(error.message);
            toast.error('Se rompió: ', { description: `${error.message}` })
        },
        onSettled: () => {
            setTimeout(() => {
                setLoading(false);
            }, tiempoCargando)
        },
    });


    const { mutate: logIn } = useMutation({
        mutationFn: async ({ email, password }: { email: string, password: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/users/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data: { token: string } = await response.json();
            return data.token;
        },

        onSuccess: (data) => {
            setToken(data);
            const decode = jwtDecode(data);
            toast.success("Exitazo!", { description: `Bienvenido ${decode}` })
        },
        onError: (error) => {
            setError(error.message);
            toast.error('Se rompió: ', { description: `${error.message}` })
        },
        onSettled: () => {
            setTimeout(() => {
                setLoading(false);
                nav('/', { replace: true });

            }, tiempoCargando)
        },
    });

    function handleToggleAccount() {
        setAccountExists(!accountExists)
    }

    function handleSubmitRegister(e: FormEvent) {
        e.preventDefault()
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const userReg = { email: formData.get("email")!.toString(), username: formData.get("username")!.toString(), password: formData.get("password")!.toString()}
        console.log(userReg)
        if (!userReg.email || !userReg.password || !userReg.username) throw new Error("Por favor llene todos los campos.");
        registerUser(userReg);
    }

    function handleSubmitLogIn(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const userLogin = { email: formData.get("email")!.toString(), password: formData.get("password")!.toString() }
        if (!userLogin.email || !userLogin.password) throw new Error("Por favor llene todos los campos.")
        logIn(userLogin);
    }

    const registerRender = () => {
        return (<>
            <div className="bg-[#b1e4e4] h-175  ">
                <div id="title" className="h-24 flex justify-center items-center">
                    <h1 className="flex justify-center items-center text-2xl font-bold w-9/10">
                        tasking.com
                        <img src={listo} alt="imagen de tareas" className="h-8" />
                    </h1>
                </div>
                <div className="bg-[#1da7a7] rounded-xl mx-auto w-4/5 p-4 gap-2 flex justify-center h-65 ">
                    <div>
                        <h1 className="text-white font-bold">Registrate!</h1>
                        <button className="hover:bg-[#ffffff] rounded p-1" onClick={handleToggleAccount}> Ya tengo cuenta!</button>
                    </div>

                    <form className="flex-col" onSubmit={(e) => handleSubmitRegister(e)}>
                        <div className="w-full  gap-10 flex-col p-2  ">
                            <h2> Username </h2>
                            <input name="username" type="text" className="w-full h-6 rounded flex justify-center items-end-safe text-sm bg-[#f0f8ff]" placeholder="ejemplito" />
                        </div>
                        <div className="w-full  gap-10 flex-col p-2  ">
                            <h2> Email </h2>
                            <input name="email" type="text" className="w-full h-6 rounded flex justify-center items-end-safe text-sm bg-[#f0f8ff]" placeholder="ejemplo@gmail.com" />
                        </div>
                        <div className="w-full  gap-10 flex-col p-2 ">
                            <h2> Password </h2>
                            <input name="password" type="password" className="w-full h-6 rounded flex justify-center items-end-safe text-sm bg-[#f0f8ff]" placeholder="password" />
                        </div>
                        <button type="submit" className="bg-gray-200 hover:bg-[#f9f9c9] px-3 py-1 rounded text-sm">Registrar</button>
                    </form>
                </div>
            </div>
        </>)
    }

    const logInRender = () => {
        return (<>
            <div className="bg-[#b1e4e4]  h-175 ">
                <div id="title" className="h-24 flex justify-center items-center">
                    <h1 className="flex justify-center items-center text-2xl font-bold w-9/10">
                        tasking.com
                        <img src={listo} alt="imagen de tareas" className="h-8" />
                    </h1>
                </div>
                <div className="bg-[#1da7a7] rounded-xl mx-auto w-4/5 p-4 gap-2 flex justify-center h-65 ">
                    <form className="flex-col" onSubmit={(e) => handleSubmitLogIn(e)}>
                        <div className="w-full  gap-10 flex-col p-2">
                            <h2> Email </h2>
                            <input name="email" type="text" className="w-full h-6 rounded flex justify-center items-end-safe text-sm bg-[#f0f8ff]" placeholder="password" />
                        </div>
                        <div className="w-full  gap-10 flex-col p-2">
                            <h2> Password </h2>
                            <input name="password" type="password" className="w-full h-6 rounded flex justify-center items-end-safe text-sm bg-[#f0f8ff]" placeholder="password" />
                        </div>
                        <button type="submit" className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">Iniciar sesion</button>
                    </form>

                    <div>
                        <h1 className="text-white font-bold">Inicio de Sesion</h1>
                        <button className="hover:bg-[#ffffff] rounded p-1" onClick={handleToggleAccount}> Aun no tienes cuenta?</button>
                    </div>
                </div>
            </div>
        </>)
    }

    return (<>
        {accountExists ? logInRender() : registerRender()}
    </>)
}

