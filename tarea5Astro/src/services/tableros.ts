import type { Tablero } from "../types";

export const tableros: Tablero[] = [
    {
        id: "0",
        nombre: "personal",
    }
]


//revisar ese return
export const getTableros = () => {
    return tableros;
}

export const addTablero = (nombre: string) => {
    const newTablero = { id: crypto.randomUUID(), nombre: nombre }
    tableros.push(newTablero);
    return newTablero;
}

export const deleteTablero = (id: string) => {
    console.log(id)
    const tablero = tableros.find((t) => t.id == id);
    console.log(tablero)
    if (!tablero) throw new Error();
    const index = tableros.indexOf(tablero);
    tableros.splice(index, 1);
    return tablero;
}



