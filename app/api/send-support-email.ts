// pages/api/send-support-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendSupportEmail } from '../../lib/mail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userEmail, message } = req.body;
    try {
      await sendSupportEmail(userEmail, message);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}