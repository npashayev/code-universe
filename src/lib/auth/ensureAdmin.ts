'use server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/next-auth/authOptions';
import { prisma } from '@/lib/prisma/prisma';

import { handlePrismaError } from '../utils/handlePrismaError';

export const ensureAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Authentication required: no active session found');
  }

  const user = await prisma.user
    .findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })
    .catch((err: unknown) =>
      handlePrismaError(err, 'ensureAdmin', 'Failed to fetch user.'),
    );

  if (user?.role !== 'ADMIN') {
    throw new Error(
      `Access denied: user ${session.user.email} does not have admin privileges`,
    );
  }
};
