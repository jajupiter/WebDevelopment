import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
import { rejects } from "assert";

dotenv.config();

class Database {
    private db: sqlite3.Database;

    constructor() {
        const dbPath = path.join(__dirname, "../../database.sqlite");
        this.db = new sqlite3.Database(dbPath);
        this.db.run("PRAGMA foreign_keys = ON");
        this.init();
    }

    private async init() {
        if (process.env.POPULATE_DB === "true") {
            await this.run(`
            CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            password TEXT NOT NULL, 
            username TEXT NOT NULL,
            intervaloRefetch INTEGER NOT NULL,
            capsLock INTEGER,
            darkMode INTEGER
            )
            `)
            await this.run(`
            CREATE TABLE IF NOT EXISTS tableros (
            id TEXT PRIMARY KEY,
            idUser TEXT NOT NULL,
            name TEXT NOT NULL,
            sololectura INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idUser) REFERENCES users (id) on DELETE CASCADE
            )
            `);
            await this.run(`
            CREATE TABLE IF NOT EXISTS tareas (
            id TEXT PRIMARY KEY,
            idTablero TEXT NOT NULL,
            content TEXT NOT NULL,
            checked INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idTablero) REFERENCES tableros (id) ON DELETE CASCADE
            )
            `);

            await this.run(`
            CREATE TABLE IF NOT EXISTS colaboraciones (
            idUser TEXT NOT NULL,
            idTablero TEXT NOT NULL,
            sololectura INTEGER NOT NULL,
            PRIMARY KEY (idUser, idTablero),
            FOREIGN KEY (idUser) REFERENCES users (id),
            FOREIGN KEY (idTablero) REFERENCES tableros (id) ON DELETE CASCADE
            )
            `);      

            await this.run(`INSERT INTO users (id, email, password, username, intervaloRefetch, capsLock, darkMode) VALUES ('1', 'ejemplo@gmail.com', 'hevuelto', 'ejemplito', 5, 0, 0)`);
            await this.run(`INSERT INTO users (id, email, password, username, intervaloRefetch, capsLock, darkMode) VALUES ('2', 'doscuartos@gmail.com', 'hevuelto', 'doscuartos',  5, 0, 0)`);
            await this.run(`INSERT INTO tableros (id, name, idUser) VALUES ('1', 'Personal', '1')`);
            await this.run(`INSERT INTO tareas (id, content, checked, idTablero) VALUES ('1', 'proyecto de progra', 0, '1')`);
            await this.run(`INSERT INTO colaboraciones (idUser, idTablero, sololectura) VALUES ('2', '1', 1)`);

        }
    }

    async run(sql: string, params: any[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) reject(err);
                else resolve();
            })
        })
    }

    async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err)
                else resolve(row as T)
            })
        })
    }

    async all<T>(sql: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err)
                else resolve(rows as T[])
            })
        })
    }

    close(): void {
        this.db.close();
    }

}
export const database = new Database();
