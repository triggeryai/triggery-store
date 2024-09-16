// app\api\admin\orders\[id]\unpaid\route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { sendOrderStatusUpdateEmail } from '@/lib/mail'; // Import funkcji do wysyłania e-maili

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user.isAdmin) {
    return Response.json(
      { message: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }
  await dbConnect();
  
  // Pobierz zamówienie i populuj użytkownika
  const order = await OrderModel.findById(params.id).populate('user');
  if (order) {
    try {
      order.isPaid = false;
      order.paidAt = null; // Możesz zachować pierwotną datę, jeśli to potrzebne
      
      const updatedOrder = await order.save();

      // Sprawdź, czy użytkownik istnieje i ma e-mail
      const userEmail = order.user?.email;
      if (!userEmail) {
        return Response.json(
          { message: 'Brak adresu e-mail dla użytkownika' },
          {
            status: 400,
          }
        );
      }

      // Wysyłanie e-maila informującego o zmianie statusu zamówienia
      await sendOrderStatusUpdateEmail(userEmail, order._id, 'Nieopłacone');

      return Response.json(updatedOrder);
    } catch (err: any) {
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      );
    }
  } else {
    return Response.json(
      { message: 'Order not found' },
      {
        status: 404,
      }
    );
  }
}) as any;
