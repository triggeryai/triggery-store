// app/api/admin/users/route.ts
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/lib/models/UserModel'

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
  
  const user = await UserModel.findById(req.auth.user._id);
  if (!user) {
    return Response.json(
      { message: 'User not found' },
      {
        status: 401,
      }
    );
  }

  const users = await UserModel.find({}, 'name email isAdmin isActive')
  return Response.json(users)
}) as any

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  await dbConnect();
  
  const user = await UserModel.findById(req.auth.user._id);
  if (!user) {
    return Response.json(
      { message: 'User not found' },
      {
        status: 401,
      }
    );
  }

  const { name, email, password, isAdmin, isActive } = await req.json()

  try {
    const newUser = new UserModel({
      name,
      email,
      password,
      isAdmin: Boolean(isAdmin),
      isActive: Boolean(isActive),
    })
    await newUser.save()
    return Response.json({
      message: 'User created successfully',
      user: newUser,
    })
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
