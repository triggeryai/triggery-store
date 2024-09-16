// next-amazona-v2/app/api/orders/[id]/route.ts
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import { auth } from '@/lib/auth'
import { getGuestCheckoutStatus } from '@/lib/utils'

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request

  const isGuestCheckoutEnabled = await getGuestCheckoutStatus()

  if (!req.auth && !isGuestCheckoutEnabled) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  await dbConnect()
  const order = await OrderModel.findById(params.id)

  if (!order) {
    return Response.json(
      { message: 'Order not found' },
      {
        status: 404,
      }
    )
  }

  return Response.json(order)
}) as any
