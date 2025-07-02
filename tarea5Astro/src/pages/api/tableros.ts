import type { APIRoute } from "astro";
import { addTablero, getTableros } from "../../services/tableros";

export const GET: APIRoute = async ({ request, redirect }) => {
    const tableros = getTableros();
    return new Response(JSON.stringify({ tableros }), { status: 200 })
}

const parseFromJSON = (json: { content: string }) => {
    return json.content
};




export const POST: APIRoute = async ({ request, params, redirect }) => {
    const contentType = request.headers.get("Content-Type");
    const data: { nombre: string } = await request.json();
    console.log(data)
    if (!data.nombre) return new Response("nombre is required", ({ status: 400 }))
    const tablero = addTablero(data.nombre);
    return new Response(JSON.stringify({ tablero }), { status: 201 });


    return redirect("/");
}

