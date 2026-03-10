import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';

export const handlePrismaError = (
  err: unknown,
  context: string,
  message = 'Failed to fetch data.',
): never => {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2023'
  ) {
    notFound();
  }

  console.error(
    `[${context}] Database error:`,
    err instanceof Error ? err.message : err,
  );
  throw new Error(message);
};
