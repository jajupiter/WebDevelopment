export type Tarea = {
    id: string;
    content: string;
    checked: boolean;
    idTablero: string; 
  };

export type Notificacion = {
    id: string;
    content: string;
  };

export type Configuracion = 
{
    intervaloRefetch: number;
    capsLck: boolean;
    darkMode: boolean;
}

export type Tablero = 
{
  id: string;
  name: string;
  tareas: Tarea[];
}

export type User = 
{
  id: string;
  email: string;
  password: string;
  username: string; 
  intervaloRefetch: number;
  capsLock: boolean;
  darkMode: boolean;
}

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}
