import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import listo from '../assets/task.png'
import { parseJwt, type Collab } from '../types';
import { baseURL, colorsAtom, errorAtom, loadingAtom, tableroActualAtom, tiempoCargando, tokenAtom } from './store/tareasStore';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';


export function Permisos() {
    const [token] = useAtom(tokenAtom);
    const decode = parseJwt(token)
    const [, setLoading] = useAtom(loadingAtom);
    const [, setError] = useAtom(errorAtom);
    const [tableroActual] = useAtom(tableroActualAtom);
    const [color] = useAtom(colorsAtom)
    const nav = useNavigate()

    const { mutate: createCollab } = useMutation({
        mutationFn: async ({ idTablero, email, permiso }: { idTablero: string, email: string, permiso: boolean }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tableros/collabs`, {
                method: 'POST',
                body: JSON.stringify({ update: { idTablero, email, permiso } }),
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            if (response.status == 401) throw new Error('No existe un usuario en sesion')
            const data: { collab: Collab } = await response.json();
            return data.collab;
        },

        onSuccess: () => {
            toast.success("Exitazo!", { description: "Colaboracion creada (:" })
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

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const email = formData.get("email")?.toString();
        if(email == decode.email) return toast.error('Epa!', {description: 'Evitemos compartir tableros de ti para ti'})
        const permiso = formData.get("permiso")?.toString() == 'lectura' ? true : false;
        if (!email) return toast.error('Por favor llena todos los campos')
        createCollab({ idTablero: tableroActual!.id, email: email, permiso: permiso })
    }

    function handleBack() {
        nav("/", { replace: true })
    }

    return (<>
        <header  style={{backgroundColor: color.celeste}}>
            <div id="title" className="h-24 flex justify-center items-center">
                <h1 className="flex justify-center items-center text-2xl font-bold w-9/10">
                    tasking.com
                    <img src={listo} alt="imagen de tareas" className="h-8" />
                </h1>
            </div>
        </header>

        <section className='h-8'></section>

        <section style={{backgroundColor: color.fondo}}>
            <div className=" rounded-xl mx-auto w-3/5 p-3 gap-2" style={{backgroundColor: color.celeste}}>
                <div className="items-center flex justify-center p-4">
                    <h1 className="text-white font-bold text-2xl">Invitar a colaborar</h1>
                </div>

                <div className="items-center flex justify-center" >
                    <form onSubmit={handleSubmit}>
                        <ul>
                            <li className='p-3'>
                                Compartir con: <input type="text" className=' bg-white rounded' name="email" placeholder='email de user' />
                            </li>
                            <li className='p-3 '>
                                Dar los siguientes permisos: <input type="text" className=' bg-white rounded' name='permiso' placeholder='lectura / edicion' />
                            </li>
                        </ul>
                        <div className='items-center flex justify-center gap-4 py-2'>
                            <button type='submit' className='bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm flex justify-center'> Compartir </button>
                            <button type='button' onClick={() => handleBack()} className='bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm flex justify-center'>Volver</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </>)
}