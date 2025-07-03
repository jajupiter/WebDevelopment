import { useAtom } from "jotai";
import { baseURL, configContentAtom, errorAtom, loadingAtom, tableroActualAtom, tiempoCargando, tokenAtom } from "./store/tareasStore";
import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { type Tarea, parseJwt, type User } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

export function Configuracion() {
    const nav = useNavigate();
    const [token] = useAtom(tokenAtom);
    const decode = token ? parseJwt(token) : "";
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [configContent, setConfigContent] = useAtom(configContentAtom);
    const iRefetch = ` ${(configContent.intervaloRefetch / 1000).toString()} s`

    const { mutate: updtConfiguracion } = useMutation({
        mutationFn: async ({ id, intervaloRefetch, capsLock, darkMode }: { id: string, intervaloRefetch: number, capsLock: boolean, darkMode: boolean }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/users/${id}`, {
                method: 'POST',
                body: JSON.stringify({ update: { id, intervaloRefetch, capsLock, darkMode } }),
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            if (response.status == 401) throw new Error('No existe un usuario en sesion')
            const data: { user: User } = await response.json();
            return data.user;
        },

        onSuccess: (data) => {
            setConfigContent({ intervaloRefetch: data.intervaloRefetch, capsLck: data.capsLock, darkMode: data.darkMode })
            toast.success("Exitazo!", { description: "Configuraciones guardadas (:" })
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

    function handleGuardado(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = formData.get("content")?.toString();
        const capsLck = formData.get("capsLck")?.toString() == 'on' ? true : false;
        const refetch = content? parseInt(content) * 1000 : 5;
        console.log(refetch)
        updtConfiguracion({ id: decode.id, intervaloRefetch: refetch, capsLock: capsLck, darkMode: false })
        target.reset();
    }



    function handleBack() {
        nav('/', { replace: true })
    }

    return (<>
        <div className="flex-col flex justify-center  bg-[#b1e4e4] rounded-xl mx-auto w-3/5 p-3 gap-2">
            <div className="items-center flex ">
                <h1 className="text-white font-bold">Configuraciones</h1>
            </div>
            <form onSubmit={handleGuardado} >

                <div>
                    <ul>
                        <li className="flex justify-around items-center w-full gap-1 p-2">
                            <p className="flex-grow">Intervalo de Refectch</p>
                            <div className="flex justify-around items-center gap-1">
                                <input name="content" type="text" className="w-10 h-6 rounded flex justify-center items-end-safe text-sm bg-[#f0f8ff]" placeholder={iRefetch} />
                            </div>
                        </li>
                        <li className="flex justify-around items-center w-full gap-3 p-2" >
                            <p className="flex-grow">{configContent.capsLck ? 'DESACTIVAR MAYUSCULAS' : 'activar mayusculas'}</p>
                            <input type="checkbox"
                                name="capsLck"
                                className="w-20 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff] hover:bg-[#b1dbff]"
                            ></input>
                        </li>
                        <li className="flex justify-around items-center w-full gap-3 p-2" >
                            <p className="flex-grow">{configContent.darkMode ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}</p>
                            <input type="checkbox"
                                name="capsLck"
                                className="w-20 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff] hover:bg-[#b1dbff]"
                            ></input>
                        </li>
                    </ul>
                </div>
                <div className="items-center flex justify-center gap-2" >
                    <button onClick={() => handleBack()} className="w-20 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff] hover:bg-[#b1dbff] transition-colors"
                    >Volver</button>
                    <button type="submit" className="w-20 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff] hover:bg-[#b1dbff] transition-colors"
                    >Guardar</button>
                </div>
            </form>

        </div>
    </>)
}


