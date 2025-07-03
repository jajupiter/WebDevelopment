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
}

export type Tablero = 
{
  id: string;
  nombre: string;
  tareas: Tarea[];
  idUser: string;
  owner: User;
}

export type User =
{
  id: string;
  username: string;
  email: string;
  password: string;
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

export interface CreateUserRequest
{
  username: string;
  email: string;
  password: string;
}

export interface CreateTableroRequest {
  name: string;
  idUser: string;
}

export interface CreateTareaRequest {
  content: string;
  idTablero: string;
}

export interface CreateCollabRequest {
  idUser: string;
  idTablero: string;
  permiso: string;
}