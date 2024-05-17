import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import CategoryModel from '@/lib/models/CategoryModel'

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

  const totalProducts = await ProductModel.countDocuments()
  const products = await ProductModel.find()
    .populate('category', 'name')
    .skip(skip)
    .limit(limit)
    .lean()

  // Transform products to replace category object with just the name
  const transformedProducts = products.map((product) => ({
    ...product,
    category: product.category.name,
  }))

  const totalPages = Math.ceil(totalProducts / limit)

  return Response.json({ products: transformedProducts, totalPages })
}) as any

export const POST = auth(async (req: any) => {
  const body = await req.json()
  console.log('Request body:', body)

  if (!req.auth || !req.auth.user?.isAdmin) {
    console.log('Unauthorized access attempt')
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const { name, slug, price, image, brand, countInStock, description, categoryId } = body
    console.log('Creating product with data:', { name, slug, price, image, brand, countInStock, description, categoryId })

    const category = await CategoryModel.findById(categoryId)
    if (!category) {
      console.log(`Category not found: ${categoryId}`)
      return Response.json({
        message: 'Category not found. Please create a category.',
        redirect: '/admin/categories'
      }, { status: 400 })
    }

    const product = new ProductModel({
      name,
      slug,
      image,
      price,
      category: categoryId,
      brand,
      countInStock,
      description,
    })

    await product.save()
    const productObject = product.toObject()
    productObject.category = category.name
    console.log('Product created successfully:', productObject)

    return Response.json({ message: 'Product created successfully', product: productObject }, { status: 201 })
  } catch (error) {
    console.error('Error while creating product:', error)
    return Response.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
  }
})
