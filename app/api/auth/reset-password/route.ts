import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const resetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const parsed = resetSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const { token, newPassword } = parsed.data;

  const resetToken = await prisma.resetToken.findUnique({
    where: {
      identifier_token: {
        identifier: token,
        token,
      },
    },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired reset token' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: resetToken.identifier },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const pwHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email: resetToken.identifier },
    data: { password: pwHash },
  });

  await prisma.resetToken.delete({
    where: {
      identifier_token: {
        identifier: resetToken.identifier,
        token: resetToken.token,
      },
    },
  });

  return NextResponse.json(
    { message: 'Password successfully updated' },
    { status: 200 }
  );
}
