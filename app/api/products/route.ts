// app\api\products\route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const POST = auth(async (req, res) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await dbConnect();
    
    // Extract product data from the request body with defaults for potential null values
    const { 
      name = 'No name provided', 
      slug = 'no-slug', 
      price = 0, 
      image = 'no-image', 
      brand = 'no-brand', 
      countInStock = 0, 
      description = 'No description', 
      category = 'no category' // Default if category is null
    } = req.body;

    // Check if any critical fields are still null or add more checks as necessary
    if (!name || !slug) {
      res.status(400).json({ message: 'Missing name or slug for the product' });
      return;
    }

    // Create a new product instance
    const newProduct = new ProductModel({
      name,
      slug,
      price,
      image,
      brand,
      countInStock,
      description,
      category
    });

    // Save the new product to the database
    await newProduct.save();

    // Respond with success message and the new product's ID
    res.status(201).json({ message: 'Product created successfully', product: { _id: newProduct._id } });
  } catch (error) {
    // Log the error to the server console
    console.error('Error creating product:', error);

    // Respond with error message and error details
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

