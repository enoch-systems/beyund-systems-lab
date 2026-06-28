import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { fullName, email } = body;
    const { id } = await params;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.registration.update({
      where: { id },
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating registration:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update registration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.registration.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting registration:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete registration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
