import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'

export const PUT = auth(async (...request: any) => {
    const [req, { params }] = request;
    console.log("Request:", request);
    if (!req.auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (req.bodyUsed) {
        console.log("Body has already been read");
        return Response.json({ message: 'Request body already read' }, { status: 400 });
    }
    const body = await req.json();
    const { paymentMethod } = body;
    console.log("Received paymentMethod:", paymentMethod);

    await dbConnect();
    const order = await OrderModel.findById(params.id);
    if (!order) {
      return Response.json({ message: 'Order not found' }, { status: 404 });
    }
    console.log("Order found:", order);

    if (order.user.toString() === req.auth.user._id) {
        order.paymentMethod = paymentMethod;
        const updatedOrder = await order.save();
        console.log("Order updated successfully: ", updatedOrder);
        return Response.json(updatedOrder);
    } else {
        return Response.json({ message: 'User does not have permission to update this order' }, { status: 403 });
    }
});
