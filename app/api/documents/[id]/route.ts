import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { type NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        project: { select: { id: true, name: true } },
        uploadedBy: { select: { firstName: true, lastName: true } },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const projectId = formData.get('projectId') as string;

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        type,
        projectId: projectId || null,
      },
      include: {
        project: { select: { name: true } },
        uploadedBy: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.document.findUnique({
      where: { id: params.id },
      select: { filePath: true },
    });

    await prisma.document.delete({
      where: { id: params.id },
    });

    if (existing?.filePath) {
      const relative = existing.filePath.startsWith('/')
        ? existing.filePath.slice(1)
        : existing.filePath;
      const fileLocation = path.join(process.cwd(), 'public', relative);
      await unlink(fileLocation).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
