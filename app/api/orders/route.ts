import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel, { OrderItem } from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import { round2, getGuestCheckoutStatus } from '@/lib/utils'; // Import function to check Guest Checkout status
import mongoose from 'mongoose';

const calcPrices = (orderItems: OrderItem[]) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const POST = auth(async (req: any) => {
  await dbConnect();

  // Check Guest Checkout status
  const isGuestCheckoutEnabled = await getGuestCheckoutStatus();

  // If Guest Checkout is disabled and user is not logged in, return 403 Forbidden
  if (!isGuestCheckoutEnabled && !req.auth) {
    return new Response(
      JSON.stringify({ message: 'Guest checkout is disabled and user is not logged in' }),
      {
        status: 403,
      }
    );
  }

  const { user } = req.auth || {}; // Handle the case where the user is not logged in but Guest Checkout is enabled

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload = await req.json();

    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
      },
      'price countInStock'
    ).session(session);

    const dbOrderItems = payload.items.map((item: { _id: string, qty: number, image: string }) => {
      const product = dbProductPrices.find((p) => p._id.equals(item._id));
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.countInStock < item.qty) {
        throw new Error('Not enough stock');
      }
      return {
        ...item,
        product: item._id,
        price: product.price,
        image: item.image, // Ensure the image field is included
        _id: undefined,
      };
    });

    for (const item of dbOrderItems) {
      await ProductModel.updateOne(
        { _id: item.product },
        { $inc: { countInStock: -item.qty } }
      ).session(session);
    }

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user ? user._id : null, // Upewnij się, że user może być null
  });
  
    const createdOrder = await newOrder.save({ session });

    await session.commitTransaction();

    return new Response(
      JSON.stringify({ message: 'Order has been created', order: createdOrder }),
      {
        status: 201,
      }
    );
  } catch (err: any) {
    await session.abortTransaction();
    return new Response(
      JSON.stringify({ message: err.message || 'An error occurred' }),
      {
        status: 500,
      }
    );
  } finally {
    session.endSession();
  }
}) as any;
