import { useAtom} from 'jotai'
import añadir from '../assets/añadir.svg'
import { TableroItem } from './TableroItem'
import { baseURL, colorsAtom, errorAtom, fetchColaboracionesAtom, fetchTablerosAtom, loadingAtom, tableroActualAtom, tablerosAtom, tiempoCargando, tokenAtom, useFetchCollab } from './store/tareasStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Tablero } from '../types'
import { toast } from 'sonner'
import { useFetchCollabs, useFetchTableros } from '../hooks'

export function Tableros() {
    const [, fetchTableros] = useAtom(fetchTablerosAtom);
    const [, fetchTablerosByCollab] = useAtom(fetchColaboracionesAtom)
    //fetchTableros();
    useFetchTableros();
    useFetchCollab();
    const [token] = useAtom(tokenAtom);
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [tableroActual] = useAtom(tableroActualAtom);
    const [color] = useAtom(colorsAtom);
    //useFetchTableros()
    const [tablerosList] = useAtom(tablerosAtom);

    const queryClient = useQueryClient();


    const { mutate: addTablero } = useMutation(
        {
            mutationFn: async (name: string) => {
                const response = await fetch(`${baseURL}/tableros/`,
                    {
                        method: "POST",
                        body: JSON.stringify({ name: name }),
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                    }
                )
                if (response.status == 401) throw new Error('No existe un usuario en sesion')
                const data: { tablero: Tablero } = await response.json()
                return data.tablero
            },

            onSuccess: (data) => {
                fetchTableros()
                toast.success("Exitazo!", { description: "Tablero agregada (:" })
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

    function handleClickAdd() {
        const content = prompt("Ingresa el nombre del nuevo tablero");
        addTablero(content!);
    }

    function render() {
        if (tableroActual) {
            return (<>
                {
                    tablerosList.map((t) => (
                        <TableroItem key={t.id} tablero={t} />
                    ))
                }
            </>)
        } else {
            return (<>
                <p className="font-medium" >Aun no existen tableros. Crea uno (:</p>
            </>)
        }
    }

    return (<>
        <div className="windows flex justify-between  items-center px-8 py-4" style={{background: color.fondo}}>
            <div className="window flex justify-around w-full bg-[#f0f8ff4b] border-b-2 border-[#7fffd4]l mx-4 rounded-sm">
                {
                    render()
                }
            </div>
            <button onClick={() => handleClickAdd()}>
                <img src={añadir} className="h-8 cursor-pointer" />
            </button>
        </div>
    </>)
}