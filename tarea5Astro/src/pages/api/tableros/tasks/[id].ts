import type { APIRoute } from "astro";
import { checkTarea, editTarea } from "../../../../services/tasks";
import { deleteTarea } from "../../../../services/tasks";
import type { Task } from "../../../../types";

type Action = "check" | "delete" | "edit";

const parseFromJSON = (data: { action: Action, content: string }) => {
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
    const content = data.content

    if(!action) return new Response("Action is required", ({status: 400}));
    if(!id) return new Response("Id is required", ({status: 404}));
    if(!content) return new Response("Content is required", ({status: 400}));

    let tarea : Task | null = null; 

    try{
        switch(action)
        {
            case "check":
                tarea = checkTarea(id);
                break;
            case "delete":
                tarea = deleteTarea(id);
                break;
            case "edit":
                tarea = editTarea(id, content);
        }

/*
        if (action == "check"){
            tarea = checkTarea(id);
        } else if (action == "delete"){
            tarea = deleteTarea(id);
        }*/
    } catch (error)
    {
        return new Response("Error", {status : 404});
    }

    if(contentType === "application/json")
    {
        return new Response(JSON.stringify({succes: true, tarea}), {status: 200});
    }

    return redirect("/");
}

