// pages/api/admin/emails/route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import EmailTemplateModel from '@/lib/models/EmailTemplate';

export const GET = auth(async (req: any) => {
  await dbConnect();

  try {
    const templates = await EmailTemplateModel.find({});
    return new Response(JSON.stringify(templates), { status: 200 });
  } catch (error: any) {
    console.error('GET Error:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
});

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();

  try {
    const { templateName, from, subject, html } = await req.json();
    const newTemplate = new EmailTemplateModel({ templateName, from, subject, html });
    await newTemplate.save();
    return new Response(JSON.stringify(newTemplate), { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
});

export const PUT = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();

  try {
    const { id, update } = await req.json();
    const updatedTemplate = await EmailTemplateModel.findByIdAndUpdate(id, update, { new: true });
    if (!updatedTemplate) {
      return new Response(JSON.stringify({ message: 'Template not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedTemplate), { status: 200 });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
});

export const DELETE = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();

  try {
    const { deleteId } = await req.json();
    await EmailTemplateModel.findByIdAndDelete(deleteId);
    return new Response({}, { status: 204 });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
});
