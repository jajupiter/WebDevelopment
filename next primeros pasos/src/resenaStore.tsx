import { create } from "zustand";
import { libro } from "./types";

export type resena = 
{
    id: string,
    libroId: string,
    title: string,
    opinion: string,
    calificacion: number
    likes: number,
    dislikes: number
}

export type resenaItemState = 
{
    resenas: resena[], 
    libros: libro[] | null,
    modoBusqueda: string,
    setResenas: (newResenas: resena[]) => void,
    setModoBusqueda: (index: number) => void,
    likesCounter: (resenaId: string, action : string) => void,
    //getLibro: () => libro,
    searchByTitle: (title: string) => void;
    searchByISBN: (ISBN: number) => void;
    searchByAuthor: (author: string) => void;
}

export const resenasStore = create<resenaItemState>((set, get) =>
({
    
    resenas: [{id: '1', libroId: '4RENAQAAMAAJ', title : 'esbuenishimoo', opinion: 'cine', calificacion: 4, likes: 2, dislikes: 0}],
    libros: null,
    modoBusqueda: 'titulo',

    setResenas : (newResenas : resena[]) => set({resenas : newResenas}),
    setModoBusqueda: (index: number) =>
    {
        switch(index){
            case 1: set({modoBusqueda : 'titulo'})
            case 2: set({modoBusqueda : 'IBSN'})
            case 3: set({modoBusqueda : 'author'})
        }
    },

    likesCounter : (resenaId: string, action : string) => 
    {
        const resenas = get().resenas
        const index = resenas.findIndex((r) => r.id === resenaId);
        if(!index) throw new Error('No se encontro la reseña especificada');
        action === 'like' ? resenas[index].likes = resenas[index].likes + 1 : resenas[index].dislikes + 1;
    },

    searchByTitle: async (title: string) => 
    {
        const urlTitle = title.replaceAll(' ', '+')
        const response = await fetch( `https://www.googleapis.com/books/v1/volumes?q=title:${urlTitle}`);
        if(!response) throw new Error('Falla al fetchear')
        const data = await response.json();
        const libros = data.items
        set({libros: libros})
    },

    searchByISBN: async (ISBN: number) => 
    {
        const response = await fetch( `https://www.googleapis.com/books/v1/volumes?q=title:${ISBN}`);
        if(!response) throw new Error('Falla al fetchear')
        const data = await response.json()        
        const libros =  data.items
        set({libros: libros})
    },

    searchByAuthor: async (author: string) => 
    {
        const urlTitle = author.replaceAll(' ', '+')
        const response = await fetch( `https://www.googleapis.com/books/v1/volumes?q=title:${urlTitle}`);
        if(!response) throw new Error('Falla al fetchear')
        const data = await response.json();
        const libros = data.items
        set({libros: libros})
    }
}))
