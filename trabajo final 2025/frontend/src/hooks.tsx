// hooks/useFetchTableros.ts
import { useAtom } from 'jotai';
import { fetchColaboracionesAtom, fetchTablerosAtom, fetchTareasAtom } from './components/store/tareasStore';
import { useEffect } from 'react';

export function useFetchTableros() {
    const [, setFetchTableros] = useAtom(fetchTablerosAtom);

    useEffect(() => {
        setFetchTableros();
    }, [setFetchTableros]);
}

export function useFetchTareas() {
    const [, setFetchTareas] = useAtom(fetchTareasAtom);

    useEffect(() => {
        setFetchTareas();
    }, [setFetchTareas]);
}

export function useFetchCollabs() {
    const [, setFetchTablerosByCollab] = useAtom(fetchColaboracionesAtom);

    useEffect(() => {
        setFetchTablerosByCollab();
    }, [setFetchTablerosByCollab]);
}
