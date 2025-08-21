import React from "react"
import { bookss } from "@/types";
import LibroItem from "./libroItem";


const page = async () => {
    const data = await fetch('https://www.googleapis.com/books/v1/volumes?q=harry+potter');
    const books : bookss= await data.json();
    const array = books.items

    console.log(books);
    console.log(array[0].volumeInfo);

    const handleSubmit = () =>
    {

    }
    return(<>
        <div className="">
            <div className="flex justify-center">
                <h1>Libros</h1>
            </div>
            <div>
                <LibroItem></LibroItem>
            </div>
        </div>
    </>)
}

export default page