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
  idUser: string;
  name: string;
  permiso: string;
  sololectura:string;
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

export type Collab = 
{
  idUser: string;
  idTablero: string;
  permiso: string; 
}

export type Colors = 
{
  crema: string;
  celeste: string;
  fondo: string; 
  
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

export function unirSinDuplicados<T extends { id: string }>(arr1: T[], arr2: T[]): T[] {
  return [...arr1, ...arr2].filter(
    (item, index, self) =>
      index === self.findIndex((obj) => obj.id === item.id)
  );
}