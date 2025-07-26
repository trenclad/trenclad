import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { z } from 'zod';

const forgotSchema = z.object({
  email: z.email(),
});

export async function POST(req: NextRequest) {
  const parsed = forgotSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  const emailNorm = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: emailNorm },
  });

  if (!user) {
    return NextResponse.json(
      { message: 'If an account exists, a password reset link will be sent' },
      { status: 200 }
    );
  }

  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000);

  await prisma.$transaction([
    prisma.resetToken.deleteMany({
      where: { identifier: emailNorm },
    }),
    prisma.resetToken.create({
      data: {
        identifier: emailNorm,
        token,
        expires,
      },
    }),
  ]);

  // const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  return NextResponse.json(
    { message: 'If an account exists, a password reset link will be sent' },
    { status: 200 }
  );
}
