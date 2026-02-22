// npm i -D tsx
// npx tsx adminUser.ts

import { prisma } from '@/lib/prisma/prisma';
import bcrypt from 'bcrypt';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main(): Promise<void> {
  try {
    const action = await question(
      "Type 'create' to create a new admin or 'update' to update a password: ",
    );

    if (action === 'create') {
      const email = await question('Email: ');
      const firstName = await question('First Name: ');
      const lastName = await question('Last Name: ');
      const password = await question('Password: ');

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        console.log('User with this email already exists!');
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

      console.log('Admin user created successfully:', {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      });
    } else if (action === 'update') {
      const email = await question('Email of user to update: ');
      const newPassword = await question('New Password: ');

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.log('No user found with this email.');
        rl.close();
        process.exit(1);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email },
        data: { hashedPassword },
      });

      console.log(`Password updated successfully for ${email}.`);
    } else {
      console.log("Invalid action. Type 'create' or 'update'.");
    }

    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
  }
}

main();
