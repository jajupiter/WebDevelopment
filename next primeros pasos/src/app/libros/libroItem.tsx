'use client'

import { Card } from "@/components/ui/card";
import { resenasStore } from "@/resenaStore";
import { bookss } from "@/types";
import { useState } from "react";

export default function LibroItem() {
    const useResenaStore = resenasStore();
    const libros = useResenaStore.libros;
    const modoBusqueda = useResenaStore.modoBusqueda;
    const searchIBSN = useResenaStore.searchByISBN;
    const searchTitulo = useResenaStore.searchByTitle;
    const searchAuthor = useResenaStore.searchByAuthor;

    const handleSubmit = () => {

    }

    const setModoBusqueda = (e: Event) =>
    {
        
    }

    return (<>
        <div className="flex justify-center">
            <form onSubmit={handleSubmit}>
                <select name="modoBUsqueda">
                    <option value="titulo">Titulo</option>
                    <option value="IBSN">IBSN</option>
                    <option value="autor">Autor</option>
                </select>
                <input className="bg-amber-400" type="button" value={1} onClick/>
                <input className="bg-blue-100" type="text" placeholder="Buscar libro" />
            </form>
        </div>
        <div className="flex-wrap w-1/3 bg-amber-100">
            {libros ? libros.map((b) =>
                <Card key={b.id} className="w-40" >
                    <img key={b.id} src={b.volumeInfo.imageLinks.thumbnail} alt="" />
                    <p >{b.volumeInfo.title}</p>
                    <p>{b.volumeInfo.publishedDate?.slice(0, 4)}</p>
                </Card>
            ) : <p>Realiza una busqueda</p>}
        </div>
    </>)

}