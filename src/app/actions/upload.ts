'use server';

import { getServerSession } from 'next-auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2/r2Client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma/prisma';
import type { PresignedItem } from '@/types/r2';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export interface PresignRequestItem {
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

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }
}

export async function presignUpload(
  items: PresignRequestItem[],
): Promise<{ items: PresignedItem[] }> {
  await ensureAdmin();

  if (items.length === 0) {
    throw new Error('Missing items array');
  }

  for (const item of items) {
    if (!item.fileKey || !item.fileType || !item.fileSize || !item.type) {
      throw new Error(`Missing fields for ${item.fileKey}`);
    }
    if (!ALLOWED_TYPES.includes(item.fileType)) {
      throw new Error(`Invalid file type for ${item.fileKey}`);
    }
    if (item.fileSize > MAX_FILE_SIZE) {
      throw new Error(`File too large for ${item.fileKey}`);
    }
  }

  const results = await Promise.all(
    items.map(async ({ fileKey, fileType, fileSize, type }) => {
      const r2Key = generateR2Key(type, fileType);

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

      return {
        fileKey,
        r2Key,
        presignedUrl,
        publicUrl,
      } satisfies PresignedItem;
    }),
  );

  return { items: results };
}

export async function deleteUpload(r2Key: string): Promise<{ success: true }> {
  await ensureAdmin();

  if (!r2Key) {
    throw new Error('Missing r2Key');
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: r2Key,
    }),
  );

  return { success: true };
}
