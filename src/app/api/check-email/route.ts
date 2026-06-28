import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

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

    return NextResponse.json({ exists: !!existing }, { headers: corsHeaders() });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { exists: false },
      { status: 200, headers: corsHeaders() }
    );
  } finally {
    await prisma.$disconnect();
  }
}
