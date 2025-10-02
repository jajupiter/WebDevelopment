import type { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { message, signature } = req.body;

    if (!message || !signature) {
      return res.status(400).json({ ok: false, error: 'Missing parameters' });
    }

    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });

    if (result.success) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(401).json({ ok: false });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Verification failed' });
  }
}
