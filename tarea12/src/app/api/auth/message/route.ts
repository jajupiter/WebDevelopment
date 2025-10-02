import type { NextApiRequest, NextApiResponse } from 'next';
import { generateNonce } from 'siwe';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(generateNonce());
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
