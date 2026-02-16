import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2/r2Client';
import { prisma } from '@/lib/prisma/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(req: NextRequest) {
  // check session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // check ADMIN role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // validate request body
  const { r2Key } = await req.json();

  if (!r2Key) {
    return NextResponse.json({ error: 'Missing r2Key' }, { status: 400 });
  }

  // delete from R2
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: r2Key,
    }),
  );

  return NextResponse.json({ success: true });
}
