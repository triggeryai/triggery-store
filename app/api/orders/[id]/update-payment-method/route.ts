// app\api\orders\[id]\update-payment-method\route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const PUT = auth(async (req, { params }) => {
  if (!req.auth) {
    return Response.json({ message: 'Nieautoryzowany' }, { status: 401 });
  }

  if (req.bodyUsed) {
    return Response.json({ message: 'Treść żądania została już odczytana' }, { status: 400 });
  }

  const body = await req.json();
  const { paymentMethod } = body;

  await dbConnect();
  const order = await OrderModel.findById(params.id);
  if (!order) {
    return Response.json({ message: 'Zamówienie nie zostało znalezione' }, { status: 404 });
  }

  // Allow both the owner of the order and admins to update the payment method
  if (order.user.toString() === req.auth.user._id || req.auth.user.isAdmin) {
    order.paymentMethod = paymentMethod;

    // Check if required fields are present, if not, set default values
    if (!order.shippingAddress.shippingCost) {
      order.shippingAddress.shippingCost = 0; // or another default value
    }
    if (!order.shippingAddress.shippingMethod) {
      order.shippingAddress.shippingMethod = 'DomyślnaMetoda'; // or another default value
    }

    try {
      const updatedOrder = await order.save();
      return Response.json(updatedOrder);
    } catch (error) {
      return Response.json({ message: error.message }, { status: 400 });
    }
  } else {
    return Response.json({ message: 'Użytkownik nie ma uprawnień do aktualizacji tego zamówienia' }, { status: 403 });
  }
});
