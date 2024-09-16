// app\api\orders\mine\route.ts
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { auth } from '@/lib/auth';

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }
  const { user } = req.auth;
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '15');
  const skip = (page - 1) * limit;

  const totalOrders = await OrderModel.countDocuments({ user: user._id });
  const orders = await OrderModel.find({ user: user._id }).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalOrders / limit);

  return Response.json({ orders, totalPages });
}) as any;
