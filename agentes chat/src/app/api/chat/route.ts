import { convertToModelMessages, streamText, tool } from 'ai';
import { client } from '../ai';
import z from 'zod/v4';
import { libro } from '@/app/types';
import { error } from 'console';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = convertToModelMessages(messages)

  try {
    const result = streamText({
      model: client('minimax/minimax-m2:free'),
      system: 'You are a helpful assistant.',
      messages: modelMessages,

      tools: {

        searchBooks: {
          description: 'Buscar libros en Google Books API por título, autor, tema, o palabras clave ',
          inputSchema: z.object({
            query: z.string().describe('El titulo, autor, tema, o palabra clave para buscar un libro'),
            maxResults: z.number().default(10).describe('Numero de resultaos a retornar'),
            orderBy: z.string().default('relevance').describe('Criterio de ordenamiento')
          }),

          execute: async ({ query, orderBy, maxResults }) => {
            console.log(query);
            console.log(orderBy)
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&orderBy=${orderBy}`);

            if (!response.ok) return ({ error: 'Error al buscar en la API de Google' });

            const data = await response.json();
            const books = data.items.map((b: libro) => ({
              ID: b.id,
              titulo: b.volumeInfo.title,
              autor: b.volumeInfo.authors,
              thumbnail: b.volumeInfo.imageLinks.thumbnail ?? ''
            }))
            console.log('antes debooks')

            if (books.length > 0) {
              console.log(books)
              return { books }
            }
          }
        }
      }

    });

    return result.toUIMessageStreamResponse();

  } catch (e) {
    return e 
  }
}
