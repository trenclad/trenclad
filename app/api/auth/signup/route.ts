import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const parsed = SignupSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const emailNorm = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: emailNorm },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const pwHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email: emailNorm,
      password: pwHash,
    },
  });

  return NextResponse.json({ message: 'User created successfully' });
}
