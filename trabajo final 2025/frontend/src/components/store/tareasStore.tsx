import { atom, createStore, useAtom, useAtomValue, useSetAtom } from "jotai";
import { parseJwt, unirSinDuplicados, type Collab, type Colors, type Configuracion, type Tablero, type Tarea } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFetchTableros } from "../../hooks";

export const baseURL = "http://localhost:3000/api";
export const tiempoCargando = 250
export const store = createStore(); // Store

export const tareasAtom = atom<Tarea[]>([]); // Array of tareas
export const loadingAtom = atom(false); // Loading state
export const errorAtom = atom<string | null>(null); // Error state

export const filtroAtom = atom<string>("");
export const editAtom = atom(false);
export const editContentAtom = atom<string>("")
export const tareaEditable = atom<Tarea | null>(null)
//auth
export const tokenAtom = atom<string>("");
//config
export const configContentAtom = atom<Configuracion>({ intervaloRefetch: 10000, capsLck: false, darkMode: false });
export const colorsAtom = atom<Colors>({crema: '#faebd7', celeste: '#b1e4e4', fondo: '#ffffff'})
//tableros
export const tableroActualAtom = atom<Tablero | null>(null)
export const tablerosAtom = atom<Tablero[]>([])
export const paginaActualAtom = atom(1);
export const tareasPorPaginaAtom = atom(3);




export function useFetchTarea() {
    const refetchIntervalo = useAtomValue(configContentAtom).intervaloRefetch
    const [token] = useAtom(tokenAtom);
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [, setTareas] = useAtom(tareasAtom);

    const { status, data, error } = useQuery({
        queryKey: ['listaTareas'],
        queryFn: async () => {
            const response = await fetch(`${baseURL}/tableros/tasks`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!response) throw new Error('Ocurrio un error al traer las tareas ')
            const data: { tasks: Tarea[] } = await response.json()
            return data.tasks
        },
        refetchInterval: refetchIntervalo
    });

    useEffect(() => {
        if (status === "pending") {
            setLoading(true);
            setError(null);
        }

        if (status === "error" && error) {
            setError(error.message);
            setLoading(false);
        }

        if (status === "success" && data) {
            setTimeout(() => {
                setLoading(false);
                setTareas(data);
            }, tiempoCargando)
        }
    }, [status, data, error]);

    return { status, data, error };
}

export const fetchTareasAtom = atom(
    null,
    async (get, set) => {
        const token = get(tokenAtom);
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const response = await fetch(`${baseURL}/tableros/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Error al obtener las tareas");

            const data: { tasks: Tarea[] } = await response.json();
            set(tareasAtom, data.tasks);
        } catch (error) {
            set(errorAtom, error instanceof Error ? error.message : "Error desconocido");
        } finally {
            set(loadingAtom, false);
        }
    }
);

export const fetchTablerosAtom = atom(
    null,
    async (get, set) => {
        const token = get(tokenAtom);
        const decode = parseJwt(token);

        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const response = await fetch(`${baseURL}/tableros/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Error al obtener los tableros");

            const data: { tablerosList: Tablero[] } = await response.json();
            const tableros = data.tablerosList.filter((t) => t.idUser == decode.id)
            set(tablerosAtom, tableros);
            set(tableroActualAtom, tableros[0])
        } catch (error) {
            set(errorAtom, error instanceof Error ? error.message : "Error desconocido");
        } finally {
            set(loadingAtom, false);
        }
    }
);

export const fetchColaboracionesAtom = atom(
    null,
    async (get, set) => {
        const tableros = get(tablerosAtom);
        const token = get(tokenAtom);
        const decode = parseJwt(token)

        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const response = await fetch(`${baseURL}/tableros/collabs/users/`, {
                method: 'POST',
                body: JSON.stringify({idUser: decode.id}),
                headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Error al obtener las colaboraciones");
            
            const data: {tableros : Tablero[]} = await response.json();
            set(tablerosAtom, tableros.concat(data.tableros))

            console.log(data.tableros);
            //data? set(tablerosAtom, tableros.concat(data.tableros)) : set(tablerosAtom, tableros);
            console.log(tableros)
        } catch (error) {
            set(errorAtom, error instanceof Error ? error.message : "Error desconocido");
        } finally {
            set(loadingAtom, false);
        }
    }
);

export function useFetchCollab() {
    const [token] = useAtom(tokenAtom);
    const decode = parseJwt(token);
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [tableros , setTableros] = useAtom(tablerosAtom);
    const [, setFetchTableros] = useAtom(fetchTablerosAtom);

    const { status, data, error } = useQuery({
        queryKey: ['listaColaboraciones'],
        queryFn: async () => {
            console.log(decode.id)
             const response = await fetch(`${baseURL}/tableros/collabs/users/`, {
                method: 'POST',
                body: JSON.stringify({idUser: decode.id}),
                headers: {
                    'Content-Type': 'applic ation/json', Authorization: `Bearer ${token}`}
            });
            if (!response) throw new Error('Ocurrio un error al traer las colaboraciones ')
            const data: { tableros: Tablero[] } = await response.json();
            console.log(data)
            return data.tableros
        },
    });

    useEffect(() => {
        if (status === "pending") {
            setLoading(true);
            setError(null);
        }

        if (status === "error" && error) {
            setError(error.message);
            setLoading(false);
        }

        if (status === "success" && data) {
            setTimeout(() => {
                setLoading(false);
                setTableros(unirSinDuplicados(tableros, data));
            }, tiempoCargando)
        }
    }, [status, data, error]);

    return { status, data, error };
}

/*export function useFetchTableros() {
    const setError = useSetAtom(errorAtom);
    const setLoading = useSetAtom(loadingAtom);
    const setTableros = useSetAtom(tablerosAtom);
    const setTableroActual = useSetAtom(tableroActualAtom);

    const { status, data, error } = useQuery({
        queryKey: ['listaTableros'],
        queryFn: async () => {
            const response = await fetch(`${baseURL}/tableros`);
            const data: { tableros: Tablero[] } = await response.json()
            return data.tableros;
        }
    });

    useEffect(() => {
        if (status === "pending") {
            setLoading(true);
            setError(null);
        }

        if (status === "error" && error) {
            setError(error.message);
            setLoading(false);
        }

        if (status === "success" && data) {
            setTimeout(() => {
                setLoading(false);
                setTableros(data);
                setTableroActual(data[0]);
            }, tiempoCargando)
        }
    }, [status, data, error]);

    return { status, data, error };
}*/

export const tareasFiltradasAtom = atom((get) => {
    const tareas = get(tareasAtom);
    console.log(tareas)
    const filtro = get(filtroAtom);
    switch (filtro) {
        case "completas":
            return tareas.filter((t) => t.checked)
        case "incompletas":
            return tareas.filter((t) => !t.checked)
        default:
            return tareas;
    }
}
)



