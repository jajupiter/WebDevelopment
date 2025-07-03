import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, type MouseEvent } from "react";
import type { Tarea } from "../types.ts";
import { useAtom, useAtomValue } from "jotai";
import { baseURL, editAtom, editContentAtom, errorAtom, loadingAtom, tableroActualAtom, tareaEditable, tiempoCargando, tokenAtom } from "./store/tareasStore.tsx";
import { toast } from "sonner";

export function NuevaTareaForm() {
    const [token] = useAtom(tokenAtom);
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [, setEditContent] = useAtom(editContentAtom);
    const [toggleEdit, setEditAtom] = useAtom(editAtom);
    const [tareaEdit] = useAtom(tareaEditable);
    const [tableroActual] = useAtom(tableroActualAtom);

    const queryClient = useQueryClient();

    const { mutate: addTarea } = useMutation({
        mutationFn: async ({ content, idTablero }: { content: string, idTablero: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tableros/tasks`, {
                method: 'POST',
                body: JSON.stringify({ action: 'agregar-tarea', content, idTablero }),
                headers: { 'Content-Type': 'application/json', Authorization : `Bearer ${token}` },
            });
            if (response.status == 401) throw new Error('No existe un usuario en sesion')
            const data: { tarea: Tarea } = await response.json();
            return data.tarea;
        },

        onSuccess: (data) => {
            queryClient.setQueryData(['listaTareas'], (prev: Tarea[]) => [...prev, data]);
            toast.success("Exitazo!", { description: "Tarea agregada (:" })
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

    const { mutate: editTarea } = useMutation({
        mutationFn: async ({ action, id, content }: { action: string, id: string, content: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tableros/tasks/${id}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ action: action, id: id, content: content }),
                    headers: { "Content-Type": "application/json" , Authorization : `Bearer ${token}`},
                }
            )
            const data = await response.json();
            return data
        },

        onSuccess: () => {
           queryClient.invalidateQueries({queryKey: ['listaTareas']})
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

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = formData.get("content")?.toString();
        if (!content) { return alert("el formulario esta vacio") }
        if (toggleEdit) {
            setEditContent(content)
            editTarea({ action: "edit", id: tareaEdit?.id!, content: content })
        }
        else {
            addTarea({ content: content, idTablero: tableroActual!.id });
        }
        setEditAtom(false)
        target.reset();
    }

    function handleCancelEdit(e: MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setEditAtom(false);
    }

    function render() {
        if (useAtomValue(editAtom)) {
            return (
                <>
                    <input
                        className="border border-gray-300 rounded px-3 py-1 flex-grow"
                        type="text"
                        name="content"
                        placeholder={tareaEdit?.content}
                    />

                    <button
                        className="bg-gray-100 hover:bg-red-300 px-4 py-1 rounded"
                        onClick={(e) => handleCancelEdit(e as unknown as MouseEvent<HTMLButtonElement, MouseEvent>)}
                    >
                        Cancelar
                    </button>

                    <button
                        className="bg-gray-100 hover:bg-[#b1e4e4] px-4 py-1 rounded"
                        type="submit"
                    >
                        Guardar
                    </button>
                </>
            )
        }
        return (
            <>
                <input
                    className="border border-gray-300 rounded px-3 py-1 flex-grow"
                    type="text"
                    name="content"
                    placeholder="Contenido de la tarea"
                />
                <button
                    className="bg-[#7fffd4]l hover:bg-teal-300 px-4 py-1 rounded"
                    type="submit"
                >
                    Add
                </button>
            </>
        )

    }


    return (
        <section className="px-4 py-2">
            <form
                action="/api/tasks"
                method="post"
                className="flex justify-center items-center bg-[#faebd7] rounded-xl mx-auto w-3/5 p-3 gap-3 mb-5"
                onSubmit={handleSubmit}
            >
                {render()}
            </form>
        </section>

    )
}
