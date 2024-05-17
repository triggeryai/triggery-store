import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '15')
  const skip = (page - 1) * limit

  const totalOrders = await OrderModel.countDocuments()
  const orders = await OrderModel.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name')
    .skip(skip)
    .limit(limit)

  const totalPages = Math.ceil(totalOrders / limit)

  return Response.json({ orders, totalPages })
}) as any
