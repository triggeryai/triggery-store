// app\api\get-messages.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import ChatMessageModel from '../../lib/models/ChatMessageModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const { recipient } = req.query;

    try {
      const messages = await ChatMessageModel.find({ recipient }).sort({ timestamp: -1 });
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
