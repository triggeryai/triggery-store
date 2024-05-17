import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const PUT = auth(async (...request: any) => {
    const [req, { params }] = request;
    if (!req.auth) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (req.bodyUsed) {
        return Response.json({ message: 'Request body already read' }, { status: 400 });
    }

    const body = await req.json();
    const { paymentMethod } = body;

    await dbConnect();
    const order = await OrderModel.findById(params.id);
    if (!order) {
        return Response.json({ message: 'Order not found' }, { status: 404 });
    }

    // Sprawdzamy, czy użytkownik jest właścicielem zamówienia
    if (order.user.toString() === req.auth.user._id) {
        order.paymentMethod = paymentMethod;

        // Sprawdzamy, czy wymagane pola są obecne, jeśli nie, ustawiamy domyślne wartości
        if (!order.shippingAddress.shippingCost) {
            order.shippingAddress.shippingCost = 0; // lub inna domyślna wartość
        }
        if (!order.shippingAddress.shippingMethod) {
            order.shippingAddress.shippingMethod = 'DefaultMethod'; // lub inna domyślna wartość
        }

        try {
            const updatedOrder = await order.save();
            return Response.json(updatedOrder);
        } catch (error) {
            return Response.json({ message: error.message }, { status: 400 });
        }
    } else {
        return Response.json({ message: 'User does not have permission to update this order' }, { status: 403 });
    }
});
