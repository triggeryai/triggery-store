import dbConnect from '@/lib/dbConnect'
import { auth } from '@/lib/auth'
import OrderModel from '@/lib/models/OrderModel'
import UserModel from '@/lib/models/UserModel'
import ProductModel from '@/lib/models/ProductModel'

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

  const period = req.nextUrl.searchParams.get('period') || 'monthly'
  const startDate = req.nextUrl.searchParams.get('startDate')
  const endDate = req.nextUrl.searchParams.get('endDate')
  const year = req.nextUrl.searchParams.get('year') || new Date().getFullYear()

  let matchStage = {}
  let dateFormat

  switch (period) {
    case 'daily':
      dateFormat = '%Y-%m-%d'
      if (startDate && endDate) {
        matchStage = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      }
      break
    case 'weekly':
      dateFormat = '%Y-%U'
      break
    case 'monthly':
      dateFormat = '%Y-%m'
      matchStage = { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } }
      break
    case 'yearly':
      dateFormat = '%Y'
      matchStage = { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } }
      break
    default:
      dateFormat = '%Y-%m'
  }

  const ordersCount = await OrderModel.countDocuments(matchStage)
  const productsCount = await ProductModel.countDocuments()
  const usersCount = await UserModel.countDocuments()

  const ordersPriceGroup = await OrderModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ])
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0

  const salesData = await OrderModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const productsData = await ProductModel.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const usersData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  return Response.json({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    salesData,
    productsData,
    usersData,
  })
}) as any
