// app\api\admin\orders\[id]\undeliver\route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { sendOrderStatusUpdateEmail } from '@/lib/mail'; // Import funkcji do wysyłania e-maili

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }
  try {
    await dbConnect();

    // Pobierz zamówienie i populuj użytkownika
    const order = await OrderModel.findById(params.id).populate('user');
    if (order) {
      order.isDelivered = false;
      order.deliveredAt = null;

      const updatedOrder = await order.save();

      // Sprawdź, czy użytkownik istnieje lub gość i ma e-mail
      const email = order.email || order.user?.email;
      if (!email) {
        return Response.json(
          { message: 'Brak adresu e-mail dla użytkownika lub gościa' },
          {
            status: 400,
          }
        );
      }

      // Wysyłanie e-maila informującego o zmianie statusu zamówienia na "niedostarczone"
      await sendOrderStatusUpdateEmail(email, order._id, 'Niedostarczone');

      return Response.json(updatedOrder);
    } else {
      return Response.json(
        { message: 'Order not found' },
        {
          status: 404,
        }
      );
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;
