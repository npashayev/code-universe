// npm i -D tsx
// npx tsx adminUser.ts

import * as readline from 'readline';

import bcrypt from 'bcrypt';

import { prisma } from '@/lib/prisma/prisma';
import { type UserRole } from '@/types/next-auth';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main(): Promise<void> {
  try {
    const action = await question(
      "Type 'create' to create or 'update' to update a user: ",
    );

    if (action === 'create') {
      const email = await question('Email: ');
      const firstName = await question('First Name: ');
      const lastName = await question('Last Name: ');
      const password = await question('Password: ');

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        console.error('User with this email already exists!');
        rl.close();
        process.exit(1);
      }

      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          hashedPassword,
          role: 'ADMIN',
        },
      });

      // eslint-disable-next-line no-console
      console.log('Admin user created successfully:', {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      });
    } else if (action === 'update') {
      const email = await question('Email of user to update: ');

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.error('No user found with this email.');
        rl.close();
        process.exit(1);
      }

      const updateType = await question(
        "Type 'password' to update password or 'role' to update role: ",
      );

      if (updateType === 'password') {
        const newPassword = await question('New Password: ');
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
          where: { email },
          data: { hashedPassword },
        });

        // eslint-disable-next-line no-console
        console.log(`Password updated successfully for ${email}.`);
      } else if (updateType === 'role') {
        const newRole = await question('New Role (ADMIN/USER): ');

        if (!['ADMIN', 'USER'].includes(newRole)) {
          console.error('Invalid role. Must be ADMIN or USER.');
          rl.close();
          process.exit(1);
        }

        await prisma.user.update({
          where: { email },
          data: { role: newRole as UserRole },
        });

        // eslint-disable-next-line no-console
        console.log(`Role updated successfully for ${email} to ${newRole}.`);
      } else {
        console.error("Invalid option. Type 'password' or 'role'.");
        rl.close();
        process.exit(1);
      }
    } else {
      console.error("Invalid action. Type 'create' or 'update'.");
      rl.close();
      process.exit(1);
    }

    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
  }
}

void main();
