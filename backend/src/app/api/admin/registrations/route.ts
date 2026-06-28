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

export async function GET(request: NextRequest) {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });

    // Transform data for frontend
    const transformedData = registrations.map((reg) => ({
      id: reg.id,
      name: reg.fullName,
      email: reg.email,
      joined: reg.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
    }));

    return NextResponse.json(
      { success: true, data: transformedData, count: transformedData.length },
      { headers: corsHeaders() }
    );
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