// app\api\auth\profile\route.ts
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/lib/models/UserModel'
import bcrypt from 'bcryptjs'

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }
  const { user } = req.auth
  const { name, email, password } = await req.json()
  await dbConnect()
  try {
    const dbUser = await UserModel.findById(user._id)
    if (!dbUser) {
      return Response.json(
        { message: 'User not found' },
        {
          status: 404,
        }
      )
    }
    
    // Sprawdzenie, czy email jest używany przez innego użytkownika
    const existingUser = await UserModel.findOne({ email })
    if (existingUser && existingUser._id.toString() !== dbUser._id.toString()) {
      return Response.json(
        { message: 'Email jest już używany przez innego użytkownika' },
        {
          status: 409, // Conflict
        }
      )
    }

    dbUser.name = name
    dbUser.email = email
    dbUser.password = password
      ? await bcrypt.hash(password, 5)
      : dbUser.password
    await dbUser.save()
    return Response.json({ message: 'User has been updated' })
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
