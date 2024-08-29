import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/lib/models/CategoryModel';
import { auth } from '@/lib/auth';

// Define the structure of the request object passed by the auth middleware
interface AuthRequest extends NextRequest {
  auth?: {
    user?: {
      isAdmin: boolean;
    };
  };
}

// Ensure auth is correctly typed as a middleware function
type AuthMiddleware = (handler: (req: AuthRequest) => Promise<Response>) => (req: AuthRequest) => Promise<Response>;

// Apply the auth middleware with correct typing
const typedAuth = auth as AuthMiddleware;

// PUT handler
export async function PUT(req: AuthRequest): Promise<Response> {
  await dbConnect();

  // Check if the user is authorized
  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Extract the ID from the URL
    const categoryId = req.nextUrl.pathname.split('/').pop();
    const { name } = await req.json(); // Parse the JSON body of the request

    // Update the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    category.name = name;
    await category.save();

    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error) {
    // Handle errors with a consistent response
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// Optionally, if you need GET or DELETE handlers, implement them similarly:
export async function GET(req: AuthRequest): Promise<Response> {
  await dbConnect();

  // Check if the user is authorized
  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Retrieve the category by ID
    const categoryId = req.nextUrl.pathname.split('/').pop();
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: AuthRequest): Promise<Response> {
  await dbConnect();

  // Check if the user is authorized
  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delete the category by ID
    const categoryId = req.nextUrl.pathname.split('/').pop();
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted' }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
