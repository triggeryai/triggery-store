// app\api\socket\route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import mongoose from 'mongoose';
import ChatMessage from '@/lib/models/ChatMessageModel';

const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_connection_string';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io');
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });

    io.on('connection', (socket) => {
      console.log('User connected');

      // Send chat history to the client
      ChatMessage.find().sort({ createdAt: 1 }).exec((err, messages) => {
        if (!err) {
          socket.emit('chat-history', messages);
        }
      });

      socket.on('send-message', async ({ message, userEmail }) => {
        const chatMessage = new ChatMessage({ email: userEmail, message });
        await chatMessage.save();

        io.emit('receive-message', { email: userEmail, message });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
