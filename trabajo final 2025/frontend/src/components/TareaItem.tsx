import { parseJwt, type Tarea } from "../types";
import basura from "../assets/tacho.png"
import lapiz from "../assets/lapiz.png"
import { baseURL, colorsAtom, configContentAtom, editAtom, errorAtom, loadingAtom, tableroActualAtom, tareaEditable, tiempoCargando, tokenAtom } from "./store/tareasStore";
import { useAtom, useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type TareaItemProps =
    {
        tarea: Tarea,
    }


export function TareaItem({ tarea }: TareaItemProps) {
    const [token] = useAtom(tokenAtom);
    const decode = parseJwt(token);
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [, setEditAtom] = useAtom(editAtom);
    const [, setTareaEditable] = useAtom(tareaEditable);
    const [tableroActual] = useAtom(tableroActualAtom);
    const capsLock = useAtomValue(configContentAtom).capsLck;
    const [color] = useAtom(colorsAtom);
    const queryClient = useQueryClient();

    const { mutate: actionTarea } = useMutation({
        mutationFn: async ({ action, id, content }: { action: string, id: string, content: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tableros/tasks/${id}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ action: action, id: id, content: content }),
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                }
            )
            const data = await response.json();
            console.log("salidade action", data)
            return data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listaTareas'] })
            toast.success("Exitazo!", { description: "Tarea editada (:" })
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


    function handleClickCheck() {
        actionTarea({ action: "check", id: tarea.id, content: "relleno" });
    }

    function handleClickDelete() {
        actionTarea({ action: "delete", id: tarea.id, content: "relleno" });
    }

    function handleClickEdit() {
        setEditAtom(true)
        setTareaEditable(tarea)
        //actionTarea({ action: "edit", id: tarea.id, content: "relleno" });
    }

    function render() {
        if (tableroActual!.idUser != decode.id && (tableroActual?.sololectura)) {
            return (<>
                <section className={`flex justify-center items-center border-b  mx-auto w-auto p-3`}  style={{backgroundColor: color.crema, borderColor: color.celeste}}>
                    <li data-id={tarea.id} className="flex justify-around items-center w-200 gap-3">
                        <button
                            className="w-18 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff]"
                            data-action-button="check-button"
                            data-checked={tarea.checked}
                        >{tarea.checked ? "checked:)" : "check"}</button>
                        <p data-content="content" className="flex-grow">{capsLock ? tarea.content.toUpperCase() : tarea.content}</p>

                    </li>
                </section>
            </>)
        }
        return (<>
            <section className={`flex justify-center items-center border-b  mx-auto w-auto p-3`} style={{backgroundColor: color.crema, borderColor: color.celeste}} >
                <li data-id={tarea.id} className="flex justify-around items-center w-200 gap-3">
                    <button
                        className="w-18 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff]"
                        onClick={(e) => { e.preventDefault(); handleClickCheck() }}
                        data-action-button="check-button"
                        data-checked={tarea.checked}
                    >{tarea.checked ? "checked:)" : "check"}</button>
                    <p data-content="content" className="flex-grow">{capsLock ? tarea.content.toUpperCase() : tarea.content}</p>
                    <button
                        onClick={(e) => { e.preventDefault(); handleClickEdit() }}
                        data-action-button="delete-button"
                        className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <img src={lapiz} className="h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); handleClickDelete() }}
                        data-action-button="delete-button"
                        className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <img src={basura} className="h-4" />
                    </button>
                </li>
            </section>
        </>)
    }



    return (
        render()
    )
}