import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client } from '@/lib/r2/r2Client';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma/prisma';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

interface PresignRequestItem {
  fileKey: string;
  fileType: string;
  fileSize: number;
  type: 'planet-main' | 'planet-content';
}

function generateR2Key(
  type: 'planet-main' | 'planet-content',
  fileType: string,
): string {
  const timestamp = Date.now();
  const unique = crypto.randomUUID();
  const ext = EXTENSION_MAP[fileType] ?? 'jpg';

  switch (type) {
    case 'planet-main':
      return `planets/main/${timestamp}-${unique}.${ext}`;
    case 'planet-content':
      return `planets/content/${timestamp}-${unique}.${ext}`;
  }
}

export async function POST(req: NextRequest) {
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
  const { items }: { items: PresignRequestItem[] } = await req.json();

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Missing items array' }, { status: 400 });
  }

  for (const item of items) {
    if (!item.fileKey || !item.fileType || !item.fileSize || !item.type) {
      return NextResponse.json(
        { error: `Missing fields for ${item.fileKey}` },
        { status: 400 },
      );
    }
    if (!ALLOWED_TYPES.includes(item.fileType)) {
      return NextResponse.json(
        { error: `Invalid file type for ${item.fileKey}` },
        { status: 400 },
      );
    }
    if (item.fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large for ${item.fileKey}` },
        { status: 400 },
      );
    }
  }

  // generate all presigned URLs in parallel
  const results = await Promise.all(
    items.map(async ({ fileKey, fileType, fileSize, type }) => {
      const r2Key = generateR2Key(type, fileType); // unique key generated server-side

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: r2Key,
        ContentType: fileType,
        ContentLength: fileSize,
      });

      const presignedUrl = await getSignedUrl(r2Client, command, {
        expiresIn: 300,
      });
      const publicUrl = `${process.env.R2_PUBLIC_URL}/${r2Key}`;

      return { fileKey, r2Key, presignedUrl, publicUrl };
    }),
  );

  return NextResponse.json({ items: results });
}
