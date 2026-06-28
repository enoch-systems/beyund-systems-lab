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
    const { fullName, email } = body;

    // Validate input
    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Check for duplicate email
    const existing = await prisma.registration.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: "This email has already been registered" },
        { status: 409, headers: corsHeaders() }
      );
    }

    // Create new registration
    const newRegistration = await prisma.registration.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
      },
    });

    return NextResponse.json(
      { success: true, data: newRegistration },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      { error: "Failed to save registration" },
      { status: 500, headers: corsHeaders() }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: registrations }, { headers: corsHeaders() });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500, headers: corsHeaders() }
    );
  } finally {
    await prisma.$disconnect();
  }
}
