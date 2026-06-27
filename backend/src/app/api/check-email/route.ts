import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    const existing = await prisma.registration.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { exists: false },
      { status: 200 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
