import { useAtom } from "jotai";
import { baseURL, colorsAtom, errorAtom, filtroAtom, loadingAtom, paginaActualAtom, tableroActualAtom, tareasFiltradasAtom, tareasPorPaginaAtom, tokenAtom, useFetchTarea } from "./store/tareasStore";
import { TareaItem } from "./TareaItem"
import type { Tarea } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import spinner from '../assets/spinner.png'
import errorcito from '../assets/errorcito.png'
import notareas from '../assets/notareas.png'
import { toast } from "sonner";
import { useEffect, type FormEvent } from "react";


export function TareaList() {
    //fetcheado de tareas
    useFetchTarea();
    //-const [, fetchTareas] = useAtom(fetchTareasAtom);
    //fetchTareas();
    const [tareasFiltradas] = useAtom(tareasFiltradasAtom)
    const [filtro, setFiltro] = useAtom(filtroAtom);
    const [tableroActual] = useAtom(tableroActualAtom);
    const tareas = tareasFiltradas.filter((t) => t.idTablero == tableroActual?.id);

    //renderizado de paginacion 
    const [paginaActual, setPaginaActual] = useAtom(paginaActualAtom);
    const [nTareasPorPagina] = useAtom(tareasPorPaginaAtom)
    const lastTareaIndex: number = paginaActual * nTareasPorPagina;
    const firstTareaIndex = lastTareaIndex - nTareasPorPagina;
    const tareasListPorPagina = tareas.slice(firstTareaIndex, lastTareaIndex);
    const paginasPosibles = tareas.length % nTareasPorPagina == 0 ? tareas.length / nTareasPorPagina : Math.round(tareas.length / nTareasPorPagina) + 1;
    //manejo de estados del tarealist
    const queryClient = useQueryClient();
    const [token] = useAtom(tokenAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [error, setError] = useAtom(errorAtom);
    const [color] = useAtom(colorsAtom);


    useEffect(() => {
        setPaginaActual(1)
    }, [tableroActual])


    const { mutate: handleDltComplete } = useMutation({
        mutationFn: async () => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tableros/tasks`, {
                method: 'DELETE',
                body: JSON.stringify({ idTablero: `${tableroActual?.id}` }),
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            const data: { eliminadas: Tarea[] } = await response.json();
            console.log(data)
            return data.eliminadas;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listaTareas'] })
            toast.success("Exitazo!", { description: "Ahora haz las que te faltan! (:" })
        },
        onError: (error) => {
            setError(error.message);
            alert('Se rompió: ' + error.message);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    function handleClickLeft() {
        if (paginaActual == 1) {
            toast.error("oopsis", { description: "aun nos sobran tareas para llegar a esa pagina" })
        } else {
            setPaginaActual(paginaActual - 1)
        }

    }

    function handleClickRight() {
        if (!(paginaActual < paginasPosibles)) {
            toast.error("oopsis", { description: "aun nos faltan tareas para llegar a esa pagina" })
        } else {
            setPaginaActual(paginaActual + 1)
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = parseInt(formData.get("content")!.toString());
        if (!content) { return toast.error('Oopsis!', { description: 'El formulario esta vacio' }) }
        if (content > paginasPosibles) {
            toast.error("oopsis", { description: "aun nos faltan tareas para llegar a esa pagina" })
        } else {
            setPaginaActual(content)
        }
        target.reset()
    }

    function errorACK() {
        setError(null);
    }

    const render = () => {
        if (!token) {
            return (
                <section className=" items-center  bg-[#c4ab8b] rounded-xl mx-auto w-3/5 p-3 h-full font-bold">
                    <div className=" flex justify-center items-center bg-[#c4ab8b]  mx-auto w-full p-3 gap-2 h-full font-bold">
                        <img src={notareas} className="h-20" />
                        <p className="text-white">Parece que aun no te has logueado. </p>
                    </div>
                    <a className=" text-white flex justify-center hover:bg-white hover:text-[#c4ab8b] px-3 py-1 rounded text-sm" href="http://localhost:5173/auth">Logearme</a>
                </section>
            )
        }
        if (loading) {
            return (
                <section className=" flex justify-center items-center  bg-[rgb(177,228,228)] rounded-xl mx-auto w-3/5 p-3 gap-2 h-full font-bold">
                    <img src={spinner} className="animate-spin duration-initial h-20" />
                    <p className="text-white">cargando mensajes...</p>
                </section>
            )
        }
        if (error) {
            return (
                <section className=" flex justify-center items-center  bg-[#e4b1b1] rounded-xl mx-auto w-3/5 p-3 gap-2 h-full font-bold">
                    <img src={errorcito} className="h-20" />
                    <p className="text-white">Error: {error}
                        <button className=" text-white flex justify-center hover:bg-white hover:text-[#e4b1b1] px-3 py-1 rounded text-sm"
                            onClick={() => errorACK()}
                        >okis</button>
                    </p>

                </section>
            )
        }

        if (tareas.length < 1) {
            return (<>
                <section className=" flex justify-center items-center  bg-[#c4ab8b] rounded-xl mx-auto w-3/5 p-3 gap-2 h-full font-bold">
                    <img src={notareas} className="h-20" />
                    <p className="text-white">Aun no hay tareas.</p>
                </section>
            </>)
        }

        return (
            <section className={` rounded-xl mx-auto w-3/5 p-3`} style={{ backgroundColor: color.crema }}>
                <ul id="task-list" >
                    {
                        tareasListPorPagina.map((tarea) => (
                            <TareaItem
                                key={tarea.id}
                                tarea={tarea}
                            />
                        ))
                    }
                </ul>
            </section>)
    }


    return (
        <section style={{background: color.fondo}}>

            {render()}
            <section className="h-5" style={{background: color.fondo}}/>
            <section className="flex justify-center  rounded-xl mx-auto w-1/5 p-1 gap-1" style={{background: color.celeste}}>
                <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={() => handleClickLeft()}
                >{"<"}</button>
                <form className="w-8 flex justify-center items-center" onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" name="content" className="w-2" placeholder={paginaActual.toString()} />
                </form>
                <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={() => handleClickRight()}
                >{">"}</button>
            </section>
            <section className="h-5" style={{background: color.fondo}} />

            <section
                className={`flex justify-center rounded-xl mx-auto w-3/5 p-3 gap-2`}
                style={{ backgroundColor: color.crema }}
            >
                <button
                    type="submit"
                    name="action"
                    value="delete-checked"
                    data-action-button="delete-button"
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={(e) => { e.preventDefault(); handleDltComplete() }}
                >
                    Borrar completadas
                </button>
                <button
                    type="submit"
                    name="action"
                    value="completas"
                    data-action-button="check-button"
                    className={`${filtro == "completas" ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 px-3 py-1 rounded text-sm`}
                    onClick={() => { setFiltro("completas") }}
                >Completadas
                </button>

                <button
                    type="submit"
                    name="action"
                    value="incompletas"
                    data-action-button="uncheck-button"
                    className={`${filtro == "incompletas" ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 px-3 py-1 rounded text-sm`}
                    onClick={() => { setFiltro("incompletas") }}
                >Faltantes
                </button>

                <button
                    type="submit"
                    name="action"
                    value="todas"
                    data-action-button="list-button"
                    className={`${filtro == "" ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 px-3 py-1 rounded text-sm`}
                    onClick={() => { setFiltro("") }}
                >Todas
                </button>
            </section>
            <section className="h-60" style={{background: color.fondo}} />

        </section>

    )
}

