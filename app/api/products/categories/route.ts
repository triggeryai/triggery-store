// app\api\products\categories\route.ts
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/CategoryModel' // Import the CategoryModel

export const GET = async () => {
  await dbConnect()
  // Get all categories and select only the 'name' field
  const categories = await CategoryModel.find({}, 'name').lean()
  // Map the result to return an array of names
  const categoryNames = categories.map((category) => category.name)
  return Response.json(categoryNames)
}
