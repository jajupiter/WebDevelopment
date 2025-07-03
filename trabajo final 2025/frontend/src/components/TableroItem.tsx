import type { Tablero, Tarea } from "../types"
import basura from "../assets/tacho.png"
import extra from "../assets/threedots.svg"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { errorAtom, loadingAtom, baseURL, tiempoCargando, tableroActualAtom, tareasFiltradasAtom, tareasAtom, store, tokenAtom, fetchTablerosAtom } from "./store/tareasStore";
import { replace, useNavigate } from "react-router-dom";


type TableroItemProps =
    {
        tablero: Tablero
    }

export function TableroItem({ tablero }: TableroItemProps) {
    const [, fetchTableros] = useAtom(fetchTablerosAtom);
    const [token] = useAtom(tokenAtom);
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [, setTableroActual] = useAtom(tableroActualAtom);
    const nav = useNavigate()
    const queryClient = useQueryClient();

    const { mutate: deleteTablero } = useMutation({
        mutationFn: async ({ action, id }: { action: string, id: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tableros/${id}`,
                {
                    method: 'DELETE',
                    body: JSON.stringify({ action: action, id: id }),
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                }
            )
            const data: { tablero: Tablero } = await response.json();
            return data.tablero
        },

        onSuccess: () => {
            fetchTableros()
            toast.success("Exitazo!", { description: "Tablero eliminado (:" })
        },

        onError: (e) => {
            setError(e.message)
            toast.error('Se rompió: ', { description: `${e.message}` })

        },

        onSettled: () => {
            setTimeout(() => {
                setLoading(false);
            }, tiempoCargando)
        }
    })

    function handleClickDelete() {
        deleteTablero({ action: "delete", id: tablero.id })
    }

    function handleSelectTablero() {
        setLoading(true);
        setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['listaTareas'] })
        }, tiempoCargando / 2);
        setTableroActual(tablero);
        setLoading(false);
    }

    function handleThreeDots() {
        nav("/permissions", {replace: true})
    }

    return (<>
        <div className="flex justify-between items-center w-3/5">
            <button
                onClick={(e) => { e.preventDefault(); handleThreeDots() }}
                data-action-button="delete-button"
                className="text-gray-500 hover:text-red-500 transition-colors"
            >
                <img src={extra} className="h-4" />
            </button>
            <button onClick={() => handleSelectTablero()} className="font-medium focus:bg-[#bed2e3] rounded-md p-1 ">{tablero.name}</button>

            <button
                onClick={(e) => { e.preventDefault(); handleClickDelete() }}
                data-action-button="delete-button"
                className="text-gray-500 hover:text-red-500 transition-colors"
            >
                <img src={basura} className="h-4" />
            </button>

        </div>
    </>)
}