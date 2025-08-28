import { screen } from "@testing-library/dom";
import { describe } from "node:test";
import page from "./page";
import { render } from "@testing-library/react";
import { it, vi } from "vitest";
import { getLibroById } from "../serverActions";

vi.mock('../serverActions', () =>
({
    getLibroById : vi.fn()
}))

describe('Libros [id]', () =>
{
    it('render correctly', async () =>
    {
        render(await page({params: {id: ''}}))
        const encabezado = screen.getByText('Libreate varon');
        const librtoTitulo = screen.getByTestId('descripcion')
    })
}
)