// app/api/admin/orders/[id]/pay/route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import UserModel from '@/lib/models/UserModel'; // Upewnij się, że model użytkownika jest zaimportowany
import { sendOrderStatusUpdateEmail } from '@/lib/mail'; // Import funkcji do wysyłania e-maili

export const PUT = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth || !req.auth.user?.isAdmin) {
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
      order.isPaid = true;
      order.paidAt = Date.now();

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

      // Wysyłanie e-maila informującego o opłaceniu zamówienia
      await sendOrderStatusUpdateEmail(userEmail, order._id, 'Opłacone');

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
