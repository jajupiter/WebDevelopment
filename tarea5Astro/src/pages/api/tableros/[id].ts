
import type { APIRoute } from "astro";
import type { Tablero } from "../../../types";
import { deleteTablero } from "../../../services/tableros";


type Action = "delete" | "edit";

const parseFromJSON = (data: { action: Action}) => {
    return data
};

const parseFromData = (formData: FormData) => {
    return formData.get("action")?.toString() as Action | undefined;
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params;
    const contentType = request.headers.get("Content-Type");

    const data = parseFromJSON(await request.json());
    const action = data.action

    if(!action) return new Response("Action is required", ({status: 400}));
    if(!id) return new Response("Id is required", ({status: 404}));

    let tablero : Tablero | null = null; 

    try{
        switch(action)
        {
            case "delete":
                tablero = deleteTablero(id);
                break;
        }

    } catch (error)
    {
        return new Response("Error", {status : 404});
    }

    if(contentType === "application/json")
    {
        return new Response(JSON.stringify({succes: true, tablero}), {status: 200});
    }

    return redirect("/");
}

